"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yoga = void 0;
var process_1 = require("@connectfinancial/process");
var secret_manager_1 = require("@connectfinancial/secret-manager");
var prisma_database_1 = require("@connectfinancial/prisma-database");
var utils_1 = require("./utils");
var utils_2 = require("./graphql/resources/quotes/utils");
var graphql_yoga_1 = require("graphql-yoga");
var redis_event_target_1 = require("@graphql-yoga/redis-event-target");
var ioredis_1 = require("ioredis");
require("./shared/container");
var YogaComponentsSingleton_1 = __importDefault(require("./shared/utils/YogaComponentsSingleton"));
var ws_1 = require("ws");
var ws_2 = require("graphql-ws/lib/use/ws");
var http_1 = require("http");
var socketio = require("socket.io-client");
var Yoga = (function (_super) {
    __extends(Yoga, _super);
    function Yoga() {
        var _this = _super.call(this, "yoga", {
            cache: false,
            subscriber: true,
            publisher: true,
            database: true,
            configManager: false,
            secretManager: false,
        }) || this;
        Object.defineProperty(_this, "httpServer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        _this.prisma = new prisma_database_1.PrismaClient();
        _this.secretManager = new secret_manager_1.SecretManager();
        var yogaServer = (0, utils_1.yogaGraphQLServer)(_this);
        _this.httpServer = (0, http_1.createServer)(yogaServer);
        _this.wsServer = new ws_1.WebSocketServer({
            server: _this.httpServer,
            path: yogaServer.graphqlEndpoint,
        });
        (0, ws_2.useServer)({
            execute: function (args) { return args.rootValue.execute(args); },
            subscribe: function (args) { return args.rootValue.subscribe(args); },
            onSubscribe: function (ctx, msg) { return __awaiter(_this, void 0, void 0, function () {
                var _a, schema, execute, subscribe, contextFactory, parse, validate, args, errors;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = yogaServer.getEnveloped(__assign(__assign({}, ctx), { req: ctx.extra.request, socket: ctx.extra.socket, params: msg.payload })), schema = _a.schema, execute = _a.execute, subscribe = _a.subscribe, contextFactory = _a.contextFactory, parse = _a.parse, validate = _a.validate;
                            _b = {
                                schema: schema,
                                operationName: msg.payload.operationName,
                                document: parse(msg.payload.query),
                                variableValues: msg.payload.variables
                            };
                            return [4, contextFactory()];
                        case 1:
                            args = (_b.contextValue = _c.sent(),
                                _b.rootValue = {
                                    execute: execute,
                                    subscribe: subscribe,
                                },
                                _b);
                            errors = validate(args.schema, args.document);
                            if (errors.length)
                                return [2, errors];
                            return [2, args];
                    }
                });
            }); },
        }, _this.wsServer);
        _this.FXapiKey = _this.secretManager.get("FALCONX_API_KEY");
        _this.FXapiSecret = _this.secretManager.get("FALCONX_API_SECRET");
        _this.FXapiPassPhrase = _this.secretManager.get("FALCONX_API_PASSPHRASE");
        _this.feedStreamingClient = socketio("https://ws-stream.falconx.io/streaming", {
            transports: ["websocket"],
            autoConnect: false,
        });
        _this.orderReqClient = socketio("https://ws.falconx.io/order", {
            transports: ["websocket"],
            autoConnect: false,
        });
        return _this;
    }
    Object.defineProperty(Yoga.prototype, "init", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var datasourcesUrl, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4, _super.prototype.init.call(this)];
                        case 1:
                            _b.sent();
                            datasourcesUrl = this.secretManager.get("DATABASE_URL");
                            this.prisma = new prisma_database_1.PrismaClient({
                                datasources: {
                                    db: {
                                        url: datasourcesUrl,
                                    },
                                },
                            });
                            YogaComponentsSingleton_1.default.createInstance(this);
                            this.pubSub = (0, graphql_yoga_1.createPubSub)({
                                eventTarget: (0, redis_event_target_1.createRedisEventTarget)({
                                    publishClient: new ioredis_1.Redis({
                                        port: 6379,
                                        host: process.env.REDIS_URL || "localhost",
                                    }),
                                    subscribeClient: new ioredis_1.Redis({
                                        port: 6379,
                                        host: process.env.REDIS_URL || "localhost",
                                    }),
                                }),
                            });
                            _a = this;
                            return [4, (0, utils_1.firebaseInit)(this)];
                        case 2:
                            _a.firebase = _b.sent();
                            return [2];
                    }
                });
            });
        }
    });
    Object.defineProperty(Yoga.prototype, "runner", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return __awaiter(this, void 0, void 0, function () {
                var port;
                var _this = this;
                return __generator(this, function (_a) {
                    port = Number(process.env.PORT) || 7000;
                    this.httpServer.listen(port, "0.0.0.0", function () {
                        _this.logger.info("Yoga server listening on port ".concat(port));
                        _this.feedStreamingClient.on("connect", function () {
                            _this.logger.info("Yoga feedStreamingClient connected");
                        });
                        _this.feedStreamingClient.on("response", function (data) {
                            _this.logger.info(data, "fx-pricing-response");
                        });
                        _this.feedStreamingClient.on("stream", function (data) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, (0, utils_2.storePriceFeed)(this, data)];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        }); });
                        _this.feedStreamingClient.on("connect_error", function (msg) {
                            _this.logger.info("Yoga feedStreamingClient connect_error %s", msg);
                        });
                        _this.feedStreamingClient.on("error", function (msg) {
                            _this.logger.info("Yoga feedStreamingClient error %s", msg);
                        });
                        _this.feedStreamingClient.on("disconnect", function () {
                            _this.logger.info("Yoga feedStreamingClient disconnected");
                        });
                        _this.orderReqClient.on("disconnect", function () {
                            _this.logger.info("Yoga orderReqClient disconnected");
                        });
                        _this.orderReqClient.on("error", function (msg) {
                            _this.logger.info("Yoga orderReqClient error %s", msg);
                        });
                        _this.orderReqClient.on("response", function (data) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.logger.info(data, "fx-order-response");
                                        return [4, (0, utils_2.fxOrderResponse)(this, data)];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        }); });
                        _this.orderReqClient.on("notification", function (data) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.logger.info(data, "fx-order-notification");
                                        return [4, (0, utils_2.fxOrderNotification)(this, data)];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        }); });
                    });
                    return [2];
                });
            });
        }
    });
    return Yoga;
}(process_1.Process));
exports.Yoga = Yoga;
//# sourceMappingURL=app.js.map