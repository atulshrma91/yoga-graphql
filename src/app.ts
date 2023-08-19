import { Process } from "@connectfinancial/process";
import type { ConfigManager } from "@connectfinancial/config-manager";
import { SecretManager } from "@connectfinancial/secret-manager";
import type { Logger } from "@connectfinancial/logger";
import type { Cache, MockCache } from "@connectfinancial/redis";
import { PrismaClient } from "@connectfinancial/prisma-database";
import { yogaGraphQLServer, firebaseInit } from "./utils";
import {
  storePriceFeed,
  fxOrderResponse,
  fxOrderNotification,
} from "./graphql/resources/quotes/utils";
import { createPubSub } from "graphql-yoga";
import { createRedisEventTarget } from "@graphql-yoga/redis-event-target";
import { Redis } from "ioredis";
import type { MappedServices } from "@connectfinancial/utils";
import "./shared/container";
import YogaComponentsSingleton from "./shared/utils/YogaComponentsSingleton";
import type { Auth } from "firebase-admin/lib/auth/auth";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer, Server } from "http";
const socketio = require("socket.io-client");

interface ISecrets {
  FALCONX_API_KEY: string;
  FALCONX_API_SECRET: string;
  FALCONX_API_PASSPHRASE: string;
  DATABASE_URL: string;
  FIREBLOCKS_INTERNAL_API_KEY: string;
  FIREBASE_ADMIN: GcpServiceAccount;
  HIVE_TOKEN: string;
}

interface IServices {
  TRANSACTIONS_API_SERVICE: string;
  FIREBLOCKS_API_SERVICE: string;
  NOTIFIER_EMAIL_SERVICE: string;
  UNISWAP_API_SERVICE: string;
}

interface GcpServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

interface AuthServerConfig {
  whiteList: string[];
}

/**
 * Yoga
 */
export class Yoga extends Process<AuthServerConfig, ISecrets, IServices> {
  declare logger: Logger;
  declare cache: Cache | MockCache;
  declare configManager: ConfigManager<AuthServerConfig>;
  declare secretManager: SecretManager<ISecrets>;
  declare FXapiKey: string;
  declare FXapiSecret: string;
  declare FXapiPassPhrase: string;
  declare feedStreamingClient: any;
  declare orderReqClient: any;
  declare prisma: PrismaClient;
  declare pubSub: ReturnType<typeof createPubSub>;
  declare clients: MappedServices<IServices>;
  declare firebase: Auth;
  declare wsServer: WebSocketServer;
  httpServer: Server;

  /**
   * Constructor
   */
  constructor() {
    super("yoga", {
      cache: false,
      subscriber: true,
      publisher: true,
      database: true,
      configManager: false,
      secretManager: false,
    });
    this.prisma = new PrismaClient();
    this.secretManager  = new SecretManager();
    const yogaServer = yogaGraphQLServer(this);
    this.httpServer = createServer(yogaServer);
    this.wsServer = new WebSocketServer({
      server: this.httpServer,
      path: yogaServer.graphqlEndpoint,
    });
    useServer(
      {
        execute: (args: any) => args.rootValue.execute(args),
        subscribe: (args: any) => args.rootValue.subscribe(args),
        onSubscribe: async (ctx, msg) => {
          const {
            schema,
            execute,
            subscribe,
            contextFactory,
            parse,
            validate,
          } = yogaServer.getEnveloped({
            ...ctx,
            req: ctx.extra.request,
            socket: ctx.extra.socket,
            params: msg.payload,
          });
          const args = {
            schema,
            operationName: msg.payload.operationName,
            document: parse(msg.payload.query),
            variableValues: msg.payload.variables,
            contextValue: await contextFactory(),
            rootValue: {
              execute,
              subscribe,
            },
          };

          const errors = validate(args.schema, args.document);
          if (errors.length) return errors;
          return args;
        },
      },
      this.wsServer
    );
    this.FXapiKey = this.secretManager.get("FALCONX_API_KEY");
    this.FXapiSecret = this.secretManager.get("FALCONX_API_SECRET");
    this.FXapiPassPhrase = this.secretManager.get("FALCONX_API_PASSPHRASE");
    this.feedStreamingClient = socketio("https://ws-stream.falconx.io/streaming", {
      transports: ["websocket"],
      autoConnect: false,
    });
    this.orderReqClient = socketio("https://ws.falconx.io/order", {
      transports: ["websocket"],
      autoConnect: false,
    });
  }

  /**
   * Init
   */
  async init() {
    await super.init();
    const datasourcesUrl = this.secretManager.get("DATABASE_URL");
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: datasourcesUrl,
        },
      },
    });
    YogaComponentsSingleton.createInstance(this);
    this.pubSub = createPubSub({
      eventTarget: createRedisEventTarget({
        publishClient: new Redis({
          port: 6379,
          host: process.env.REDIS_URL || "localhost",
        }),
        subscribeClient: new Redis({
          port: 6379,
          host: process.env.REDIS_URL || "localhost",
        }),
      }),
    });
    this.firebase = await firebaseInit(this);
  }

  /**
   * Runner
   */
  async runner() {
    const port = Number(process.env.PORT) || 7000;
    this.httpServer.listen(port, "0.0.0.0", () => {
      this.logger.info(`Yoga server listening on port ${port}`);
      this.feedStreamingClient.on("connect", () => {
        this.logger.info("Yoga feedStreamingClient connected");
      });
      this.feedStreamingClient.on("response", (data: any) => {
        this.logger.info(data, "fx-pricing-response");
      });
      this.feedStreamingClient.on("stream", async (data: any) => {
        await storePriceFeed(this, data);
      });
      this.feedStreamingClient.on("connect_error", (msg: any) => {
        this.logger.info("Yoga feedStreamingClient connect_error %s", msg);
      });
      this.feedStreamingClient.on("error", (msg: any) => {
        this.logger.info("Yoga feedStreamingClient error %s", msg);
      });
      this.feedStreamingClient.on("disconnect", () => {
        this.logger.info("Yoga feedStreamingClient disconnected");
      });
      this.orderReqClient.on("disconnect", () => {
        this.logger.info("Yoga orderReqClient disconnected");
      });
      this.orderReqClient.on("error", (msg: any) => {
        this.logger.info("Yoga orderReqClient error %s", msg);
      });
      this.orderReqClient.on("response", async (data: any) => {
        this.logger.info(data, "fx-order-response");
        await fxOrderResponse(this, data);
      });
      this.orderReqClient.on("notification", async (data: any) => {
        this.logger.info(data, "fx-order-notification");
        await fxOrderNotification(this, data);
      });
    });
  }
}
