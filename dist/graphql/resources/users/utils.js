"use strict";
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
exports.getOobCode = exports.genVerificationLink = exports.genResetPasswordLink = exports.detectSuspiciousSignIn = void 0;
var crypto_1 = __importDefault(require("crypto"));
var env_1 = require("@connectfinancial/env");
var detectSuspiciousSignIn = function (context, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var histories, loginHistory, user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!userId) {
                    throw new Error("Error: User id not found");
                }
                return [4, context.yoga.prisma.loginHistories.findFirst({
                        where: {
                            userId: userId,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    })];
            case 1:
                histories = _a.sent();
                return [4, loginHistories(context.yoga.prisma, userId, context.authorization, context.headers)];
            case 2:
                loginHistory = _a.sent();
                if (!(loginHistory &&
                    histories &&
                    loginHistory.ipAddress !== (histories === null || histories === void 0 ? void 0 : histories.ipAddress))) return [3, 5];
                return [4, context.yoga.prisma.users.findUnique({
                        where: {
                            userId: userId,
                        },
                    })];
            case 3:
                user = _a.sent();
                if (!user) {
                    throw new Error("Error: User not found");
                }
                return [4, (0, exports.genResetPasswordLink)(context, user.email)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [3, 7];
            case 6:
                err_1 = _a.sent();
                throw new Error("Error: ".concat(err_1.message));
            case 7: return [2];
        }
    });
}); };
exports.detectSuspiciousSignIn = detectSuspiciousSignIn;
var loginHistories = function (prisma, userId, token, headers) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenHash, existsLogin, loginType, whitelist, userAgent, cFConnectingIP, cfIPCountry, acceptLanguage, acceptLanguageArr, uaMobile, loginHistory, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                tokenHash = crypto_1.default
                    .createHash("sha256")
                    .update(token)
                    .digest()
                    .toString("hex");
                return [4, prisma.loginHistories.findFirst({
                        where: {
                            userId: userId,
                            rawToken: tokenHash,
                        },
                    })];
            case 1:
                existsLogin = _b.sent();
                if (!!existsLogin) return [3, 5];
                return [4, prisma.loginTypes.findFirst({
                        where: { name: "NORMAL" },
                    })];
            case 2:
                loginType = _b.sent();
                if (!loginType) {
                    throw Error("Error: loginType not found");
                }
                return [4, prisma.whitelists.create({
                        data: {
                            loginTypeId: loginType.id,
                            isWhitelisted: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    })];
            case 3:
                whitelist = _b.sent();
                userAgent = headers.get("User-Agent");
                cFConnectingIP = headers.get("CF-Connecting-IP") || headers.get("x-real-ip");
                cfIPCountry = headers.get("CF-IPCountry");
                acceptLanguage = headers.get("Accept-Language");
                acceptLanguageArr = acceptLanguage.split(",");
                uaMobile = headers.get("sec-ch-ua-mobile");
                return [4, prisma.loginHistories.create({
                        data: {
                            rawToken: tokenHash,
                            userId: userId,
                            ipAddress: cFConnectingIP || "127.0.0.1",
                            accessDevice: userAgent
                                ? userAgent.match(/(?<=\().*?(?=;)/)[0]
                                : "Not Found",
                            accessLocation: cfIPCountry || "Not Found",
                            browser: userAgent
                                ? userAgent.match(/(firefox|msie|chrome|safari)[/\s]([\d.]+)/gi)[0]
                                : "Not Found",
                            timestamp: new Date(),
                            operatingSystem: userAgent
                                ? userAgent.match(/(?<=\().*?(?=;)/)[0]
                                : "Not Found",
                            language: (_a = acceptLanguageArr[0]) !== null && _a !== void 0 ? _a : "en-GB",
                            deviceType: uaMobile === "?0" ? "Desktop" : "Mobile" || "Not Found",
                            loginTypeId: loginType.id,
                            whitelistId: whitelist.id,
                            isActive: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    })];
            case 4:
                loginHistory = _b.sent();
                return [2, loginHistory];
            case 5: return [3, 7];
            case 6:
                err_2 = _b.sent();
                throw new Error("Error: ".concat(err_2.message));
            case 7: return [2];
        }
    });
}); };
var genResetPasswordLink = function (context, email) { return __awaiter(void 0, void 0, void 0, function () {
    var actionCode, link, resetLink, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                actionCode = getActionCode();
                return [4, context.yoga.firebase.generatePasswordResetLink(email, actionCode)];
            case 1:
                link = _a.sent();
                resetLink = replaceLink(link, actionCode.url);
                return [2, resetLink.replace("login", "reset-password")];
            case 2:
                err_3 = _a.sent();
                throw new Error("Error: ".concat(err_3.message));
            case 3: return [2];
        }
    });
}); };
exports.genResetPasswordLink = genResetPasswordLink;
var genVerificationLink = function (context, email) { return __awaiter(void 0, void 0, void 0, function () {
    var actionCode, link, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                actionCode = getActionCode();
                return [4, context.yoga.firebase.generateEmailVerificationLink(email, actionCode)];
            case 1:
                link = _a.sent();
                return [2, replaceLink(link, actionCode.url)];
            case 2:
                err_4 = _a.sent();
                throw new Error("Error: ".concat(err_4.message));
            case 3: return [2];
        }
    });
}); };
exports.genVerificationLink = genVerificationLink;
var getActionCode = function () {
    var _a;
    var url;
    if (env_1.local) {
        url = "http://localhost:3000";
    }
    else if (env_1.kube) {
        switch (env_1.env) {
            case "development":
                url = "http://dev-client.connect.financial/";
                break;
            case "staging":
                url = "http://staging-client.connect.financial/";
                break;
            case "production":
                url = "http://client.connect.financial/";
                break;
            default:
                url = "http://client.connect.financial/";
                break;
        }
    }
    else {
        url = (_a = process.env.FRONTEND_BASE_URL) !== null && _a !== void 0 ? _a : "http://localhost:3000";
    }
    return { url: url };
};
var replaceLink = function (link, url) {
    return link.replace("https://client.connect.financial", url);
};
var getOobCode = function (link) {
    return link.substring(link.search("oobCode") + 8, link.search("&apiKey"));
};
exports.getOobCode = getOobCode;
//# sourceMappingURL=utils.js.map