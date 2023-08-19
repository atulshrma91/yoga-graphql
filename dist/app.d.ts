/// <reference types="node" />
import { Process } from "@connectfinancial/process";
import type { ConfigManager } from "@connectfinancial/config-manager";
import { SecretManager } from "@connectfinancial/secret-manager";
import type { Logger } from "@connectfinancial/logger";
import type { Cache, MockCache } from "@connectfinancial/redis";
import { PrismaClient } from "@connectfinancial/prisma-database";
import { createPubSub } from "graphql-yoga";
import type { MappedServices } from "@connectfinancial/utils";
import "./shared/container";
import type { Auth } from "firebase-admin/lib/auth/auth";
import { WebSocketServer } from "ws";
import { Server } from "http";
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
export declare class Yoga extends Process<AuthServerConfig, ISecrets, IServices> {
    logger: Logger;
    cache: Cache | MockCache;
    configManager: ConfigManager<AuthServerConfig>;
    secretManager: SecretManager<ISecrets>;
    FXapiKey: string;
    FXapiSecret: string;
    FXapiPassPhrase: string;
    feedStreamingClient: any;
    orderReqClient: any;
    prisma: PrismaClient;
    pubSub: ReturnType<typeof createPubSub>;
    clients: MappedServices<IServices>;
    firebase: Auth;
    wsServer: WebSocketServer;
    httpServer: Server;
    constructor();
    init(): Promise<void>;
    runner(): Promise<void>;
}
export {};
