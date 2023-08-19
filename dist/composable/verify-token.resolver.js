"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.authenticateUser = exports.verifyTokenResolver = void 0;
var axios_1 = __importDefault(require("axios"));
var axios_cache_adapter_1 = require("axios-cache-adapter");
var graphql_1 = require("graphql");
var jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
var verifyTokenResolver = function (resolve) {
    return function (parent, args, context, info) { return __awaiter(void 0, void 0, void 0, function () {
        var whiteList, err_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    whiteList = context.yoga.configManager.get("whiteList");
                    if (!(context === null || context === void 0 ? void 0 : context.currentUser)) return [3, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, validateSessions(context.yoga, context.authorization)];
                case 2:
                    _a.sent();
                    return [3, 4];
                case 3:
                    err_1 = _a.sent();
                    return [2, Promise.reject(new graphql_1.GraphQLError(err_1.message))];
                case 4: return [4, context.yoga.prisma.users
                        .findFirstOrThrow({
                        where: { firebaseUID: context === null || context === void 0 ? void 0 : context.currentUser.firebaseUID },
                    })
                        .catch(function () {
                        return Promise.reject(new graphql_1.GraphQLError("Unauthorized! Token not provided!."));
                    })];
                case 5:
                    _a.sent();
                    if (whiteList.includes(context.operationName) && context.operationName !== "authorizeUser") {
                        return [2, Promise.reject(new graphql_1.GraphQLError("Unauthorized! operation"))];
                    }
                    return [2, resolve(parent, args, context, info)];
                case 6:
                    if (whiteList.includes(context.operationName)) {
                        return [2, resolve(parent, args, context, info)];
                    }
                    return [2, Promise.reject(new graphql_1.GraphQLError("Unauthorized!"))];
                case 7:
                    err_2 = _a.sent();
                    return [2, null];
                case 8: return [2];
            }
        });
    }); };
};
exports.verifyTokenResolver = verifyTokenResolver;
var cache = (0, axios_cache_adapter_1.setupCache)({
    maxAge: 7 * 60 * 60 * 1000,
});
var googleCerts = axios_1.default.create({
    adapter: cache.adapter,
    baseURL: "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
});
function getKey(header) {
    return __awaiter(this, void 0, void 0, function () {
        var keys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, googleCerts.get("")];
                case 1:
                    keys = (_a.sent()).data;
                    if (!Object.keys(keys).includes(header.kid)) {
                        throw new Error("Invalid KID");
                    }
                    return [2, keys[header.kid]];
            }
        });
    });
}
var options = {
    algorithms: ["RS256"],
    complete: true,
};
var authenticateUser = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var authBearer, decodedToken, header, key, decoded, decodedPayload, userId, err_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                authBearer = token.split("Bearer ");
                decodedToken = authBearer[authBearer.length > 1 ? 1 : 0];
                header = JSON.parse(Buffer.from(decodedToken.split(".")[0], "base64").toString("ascii"));
                return [4, getKey(header)];
            case 1:
                key = _b.sent();
                decoded = jsonwebtoken_1.default.verify(decodedToken, key, options);
                decodedPayload = decoded;
                userId = (_a = decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.payload) === null || _a === void 0 ? void 0 : _a.user_id;
                if (userId) {
                    return [2, decodedPayload === null || decodedPayload === void 0 ? void 0 : decodedPayload.payload];
                }
                return [2, null];
            case 2:
                err_3 = _b.sent();
                if (err_3 instanceof jsonwebtoken_1.TokenExpiredError) {
                    throw new Error("jwt expired");
                }
                return [2, null];
            case 3: return [2];
        }
    });
}); };
exports.authenticateUser = authenticateUser;
var validateSessions = function (yoga, token) { return __awaiter(void 0, void 0, void 0, function () {
    var authBearer, decodedToken, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                authBearer = token.split("Bearer ");
                decodedToken = authBearer[authBearer.length > 1 ? 1 : 0];
                return [4, yoga.firebase.verifyIdToken(decodedToken, true)];
            case 1:
                _a.sent();
                return [3, 3];
            case 2:
                error_1 = _a.sent();
                throw new Error(error_1);
            case 3: return [2];
        }
    });
}); };
//# sourceMappingURL=verify-token.resolver.js.map