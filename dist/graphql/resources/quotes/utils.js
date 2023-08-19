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
exports.spreadFeeLPS1toqeSpreadRevenueTransfer = exports.tradeFeeLPS1tobssRevenueTransfer = exports.LPsettlement1ToUserWalletTransfer = exports.targetAssetLPsettlement1Transfer = exports.reservedToLPsettlement1Transfer = exports.createAssetTrade = exports.createTransaction = exports.getWalletAssetByID = exports.getTargetWalletAssetByWallet = exports.getSourceWalletAssetByWallet = exports.getAssetBalanceType = exports.getOrderById = exports.updateOrder = exports.fxOrderNotification = exports.fxOrderResponse = exports.storeOrderRequest = exports.updateQuote = exports.fxOrderPayload = exports.getQuoteById = exports.storeQuoteRequest = exports.storePriceFeed = exports.fxUnsubscribePriceFeed = exports.fxSubscribePriceFeed = exports.createFXheaders = void 0;
var prisma_database_1 = require("@connectfinancial/prisma-database");
var hmac_sha256_1 = __importDefault(require("crypto-js/hmac-sha256"));
var enc_base64_1 = __importDefault(require("crypto-js/enc-base64"));
var uuid_1 = require("uuid");
var FixedNumberHelper_1 = require("@connectfinancial/utils/dist/FixedNumberHelper");
var createFXheaders = function (fxApiKey, fxApiSecret, fxApiPassPhrase) {
    var timestamp = new Date().getTime() / 1000;
    var message = timestamp + "GET" + "/socket.io/";
    var hmacKey = enc_base64_1.default.parse(fxApiSecret);
    var signature = (0, hmac_sha256_1.default)(message, hmacKey);
    var signatureB64 = signature.toString(enc_base64_1.default);
    return {
        "FX-ACCESS-SIGN": signatureB64,
        "FX-ACCESS-TIMESTAMP": timestamp,
        "FX-ACCESS-KEY": fxApiKey,
        "FX-ACCESS-PASSPHRASE": fxApiPassPhrase,
        "Content-Type": "application/json",
        "Sec-Webscoket-Key": "application/json",
    };
};
exports.createFXheaders = createFXheaders;
var fxSubscribePriceFeed = function (prisma, baseToken, quoteToken, quantity, quoteId) { return __awaiter(void 0, void 0, void 0, function () {
    var vendor, falconXtokenPair, falconXPayload, falconXBasetokenPair, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4, prisma.institutional_vendors.findFirst({
                        select: {
                            id: true,
                            identifier: true,
                        },
                        where: {
                            identifier: "FX",
                        },
                    })];
            case 1:
                vendor = _a.sent();
                return [4, prisma.tokenPairs.findFirst({
                        select: {
                            id: true,
                            baseToken: true,
                            quoteToken: true,
                            baseTokenPair: true,
                        },
                        where: {
                            baseToken: baseToken,
                            quoteToken: quoteToken,
                            vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id,
                        },
                    })];
            case 2:
                falconXtokenPair = _a.sent();
                if (!falconXtokenPair) return [3, 6];
                falconXPayload = void 0;
                if (!falconXtokenPair.baseTokenPair) return [3, 4];
                return [4, prisma.tokenPairs.findFirst({
                        select: {
                            id: true,
                            baseToken: true,
                            quoteToken: true,
                        },
                        where: {
                            id: falconXtokenPair.baseTokenPair,
                        },
                    })];
            case 3:
                falconXBasetokenPair = _a.sent();
                falconXPayload = {
                    token_pair: {
                        base_token: falconXBasetokenPair === null || falconXBasetokenPair === void 0 ? void 0 : falconXBasetokenPair.baseToken,
                        quote_token: falconXBasetokenPair === null || falconXBasetokenPair === void 0 ? void 0 : falconXBasetokenPair.quoteToken,
                    },
                    echo_id: true,
                    quantity: [Number(quantity)],
                    quantity_token: falconXBasetokenPair === null || falconXBasetokenPair === void 0 ? void 0 : falconXBasetokenPair.quoteToken,
                    client_request_id: quoteId,
                };
                return [3, 5];
            case 4:
                falconXPayload = {
                    token_pair: {
                        base_token: falconXtokenPair.baseToken,
                        quote_token: falconXtokenPair.quoteToken,
                    },
                    echo_id: true,
                    quantity: [Number(quantity)],
                    client_request_id: quoteId,
                };
                _a.label = 5;
            case 5: return [2, falconXPayload];
            case 6: return [3, 8];
            case 7:
                err_1 = _a.sent();
                throw new Error("Error: ".concat(err_1.message));
            case 8: return [2];
        }
    });
}); };
exports.fxSubscribePriceFeed = fxSubscribePriceFeed;
var fxUnsubscribePriceFeed = function (prisma, quote) { return __awaiter(void 0, void 0, void 0, function () {
    var vendor, sourceAsset, targetAsset, falconXtokenPair, falconXPayload, falconXBasetokenPair, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                return [4, prisma.institutional_vendors.findFirst({
                        select: {
                            id: true,
                            identifier: true,
                        },
                        where: {
                            identifier: "FX",
                        },
                    })];
            case 1:
                vendor = _a.sent();
                return [4, prisma.institutional_assets.findFirst({
                        where: {
                            id: quote.sourceAssetId,
                        },
                    })];
            case 2:
                sourceAsset = _a.sent();
                return [4, prisma.institutional_assets.findFirst({
                        where: {
                            id: quote.targetAssetId,
                        },
                    })];
            case 3:
                targetAsset = _a.sent();
                return [4, prisma.tokenPairs.findFirst({
                        select: {
                            id: true,
                            baseToken: true,
                            quoteToken: true,
                            baseTokenPair: true,
                        },
                        where: {
                            baseToken: sourceAsset.ticker,
                            quoteToken: targetAsset.ticker,
                            vendorId: vendor === null || vendor === void 0 ? void 0 : vendor.id,
                        },
                    })];
            case 4:
                falconXtokenPair = _a.sent();
                if (!falconXtokenPair) return [3, 8];
                falconXPayload = void 0;
                if (!falconXtokenPair.baseTokenPair) return [3, 6];
                return [4, prisma.tokenPairs.findFirst({
                        select: {
                            id: true,
                            baseToken: true,
                            quoteToken: true,
                        },
                        where: {
                            id: falconXtokenPair.baseTokenPair,
                        },
                    })];
            case 5:
                falconXBasetokenPair = _a.sent();
                falconXPayload = {
                    token_pair: {
                        base_token: falconXBasetokenPair === null || falconXBasetokenPair === void 0 ? void 0 : falconXBasetokenPair.baseToken,
                        quote_token: falconXBasetokenPair === null || falconXBasetokenPair === void 0 ? void 0 : falconXBasetokenPair.quoteToken,
                    },
                    client_request_id: quote.id,
                };
                return [3, 7];
            case 6:
                falconXPayload = {
                    token_pair: {
                        base_token: falconXtokenPair.baseToken,
                        quote_token: falconXtokenPair.quoteToken,
                    },
                    client_request_id: quote.id,
                };
                _a.label = 7;
            case 7: return [2, falconXPayload];
            case 8: return [3, 10];
            case 9:
                err_2 = _a.sent();
                throw new Error("Error: ".concat(err_2.message));
            case 10: return [2];
        }
    });
}); };
exports.fxUnsubscribePriceFeed = fxUnsubscribePriceFeed;
var storePriceFeed = function (yoga, data) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, data_1, feed, quote, diffInSec, falconXPayload, updateQuote_1, userQuotePrice, spreadFee, spreadFee, err_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                _i = 0, data_1 = data;
                _b.label = 1;
            case 1:
                if (!(_i < data_1.length)) return [3, 10];
                feed = data_1[_i];
                return [4, yoga.prisma.institutional_quotes.findFirst({
                        include: {
                            assets_quotes_sourceAssetIdToassets: true,
                            tokenPairs: true,
                            organizations: {
                                include: {
                                    pricingPlans: true,
                                },
                            },
                        },
                        where: {
                            id: feed.client_request_id,
                        },
                    })];
            case 2:
                quote = _b.sent();
                if (!(quote && quote.quantity === feed.quantity.value)) return [3, 9];
                diffInSec = (0, FixedNumberHelper_1.calNumbers)().divFixedNumber((0, FixedNumberHelper_1.calNumbers)().subFixedNumber(new Date(feed.t_create).getTime(), new Date(quote.createdAt).getTime())._value, 1000)._value;
                if (!(Number(diffInSec) > 40)) return [3, 4];
                return [4, (0, exports.fxUnsubscribePriceFeed)(yoga.prisma, quote)];
            case 3:
                falconXPayload = _b.sent();
                yoga.logger.info(falconXPayload);
                yoga.feedStreamingClient.emit("unsubscribe", falconXPayload);
                yoga.feedStreamingClient.disconnect();
                _b.label = 4;
            case 4:
                updateQuote_1 = void 0;
                userQuotePrice = void 0;
                if (!(quote.side === "BUY")) return [3, 6];
                spreadFee = (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(feed.buy_price.value, (0, FixedNumberHelper_1.calNumbers)().divFixedNumber(quote === null || quote === void 0 ? void 0 : quote.organizations.pricingPlans.price, 10000)._value)._value;
                userQuotePrice = (0, FixedNumberHelper_1.calNumbers)().addFixedNumber(feed.buy_price.value, spreadFee)._value;
                return [4, yoga.prisma.institutional_quotes.update({
                        where: {
                            id: quote.id,
                        },
                        data: {
                            rawQuotePrice: feed.buy_price.value,
                            spreadFee: spreadFee,
                            userQuotePrice: userQuotePrice,
                            finalQuoteValue: (0, FixedNumberHelper_1.calNumbers)().divFixedNumber(quote.quantity, userQuotePrice)._value,
                            updatedAt: new Date(feed.t_create).toISOString(),
                            quoteStatusId: 8,
                        },
                    })];
            case 5:
                updateQuote_1 = _b.sent();
                return [3, 8];
            case 6:
                spreadFee = (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(feed.sell_price.value, (0, FixedNumberHelper_1.calNumbers)().divFixedNumber(quote === null || quote === void 0 ? void 0 : quote.organizations.pricingPlans.price, 10000)._value)._value;
                userQuotePrice = (0, FixedNumberHelper_1.calNumbers)().subFixedNumber(feed.sell_price.value, spreadFee)._value;
                return [4, yoga.prisma.institutional_quotes.update({
                        where: {
                            id: quote.id,
                        },
                        data: {
                            rawQuotePrice: feed.sell_price.value,
                            spreadFee: spreadFee,
                            userQuotePrice: userQuotePrice,
                            finalQuoteValue: (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(userQuotePrice, quote.quantity)._value,
                            updatedAt: new Date(feed.t_create).toISOString(),
                            quoteStatusId: 8,
                        },
                    })];
            case 7:
                updateQuote_1 = _b.sent();
                _b.label = 8;
            case 8:
                yoga.pubSub.publish((_a = quote === null || quote === void 0 ? void 0 : quote.tokenPairs) === null || _a === void 0 ? void 0 : _a.queueTableName, quote.id, {
                    id: updateQuote_1.id,
                    quoteStatusId: updateQuote_1.quoteStatusId,
                    sourceAssetId: updateQuote_1.sourceAssetId,
                    targetAssetId: updateQuote_1.targetAssetId,
                    side: updateQuote_1.side,
                    userId: updateQuote_1.userId,
                    vendorId: updateQuote_1.vendorId,
                    createdAt: updateQuote_1.createdAt,
                    updatedAt: updateQuote_1.updatedAt,
                    buyPrice: feed.buy_price.value,
                    sellPrice: feed.sell_price.value,
                    quantity: updateQuote_1.quantity,
                });
                _b.label = 9;
            case 9:
                _i++;
                return [3, 1];
            case 10: return [3, 12];
            case 11:
                err_3 = _b.sent();
                throw new Error("Error: ".concat(err_3.message));
            case 12: return [2];
        }
    });
}); };
exports.storePriceFeed = storePriceFeed;
var storeQuoteRequest = function (prisma, baseToken, quoteToken, quantity, source, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var sourceAsset, targetAsset, tokenPair, organization, quote, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4, prisma.institutional_assets.findFirst({
                        where: {
                            ticker: baseToken,
                        },
                    })];
            case 1:
                sourceAsset = _a.sent();
                return [4, prisma.institutional_assets.findFirst({
                        where: {
                            ticker: quoteToken,
                        },
                    })];
            case 2:
                targetAsset = _a.sent();
                return [4, prisma.tokenPairs.findFirst({
                        include: {
                            vendors: true,
                        },
                        where: {
                            baseToken: baseToken,
                            quoteToken: quoteToken,
                        },
                    })];
            case 3:
                tokenPair = _a.sent();
                return [4, prisma.organizations.findFirst({
                        where: {
                            name: {
                                contains: source,
                                mode: "insensitive",
                            },
                        },
                    })];
            case 4:
                organization = _a.sent();
                return [4, prisma.institutional_quotes.create({
                        data: {
                            id: (0, uuid_1.v4)(),
                            quoteStatusId: 1,
                            sourceAssetId: sourceAsset === null || sourceAsset === void 0 ? void 0 : sourceAsset.id,
                            targetAssetId: targetAsset === null || targetAsset === void 0 ? void 0 : targetAsset.id,
                            side: tokenPair === null || tokenPair === void 0 ? void 0 : tokenPair.tradeSide,
                            userId: userId,
                            vendorId: tokenPair.vendors.id,
                            extraData: {},
                            error: {},
                            rawQuotePrice: "0",
                            spreadFee: "0",
                            userQuotePrice: "0",
                            finalQuoteValue: "0",
                            quantity: quantity,
                            tokenPairId: tokenPair === null || tokenPair === void 0 ? void 0 : tokenPair.id,
                            organizationId: organization === null || organization === void 0 ? void 0 : organization.id,
                        },
                    })];
            case 5:
                quote = (_a.sent());
                return [2, quote];
            case 6:
                err_4 = _a.sent();
                throw new Error("Error: ".concat(err_4.message));
            case 7: return [2];
        }
    });
}); };
exports.storeQuoteRequest = storeQuoteRequest;
var getQuoteById = function (prisma, quoteId) { return __awaiter(void 0, void 0, void 0, function () {
    var quote, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, prisma.institutional_quotes.findFirst({
                        where: {
                            id: quoteId,
                        },
                    })];
            case 1:
                quote = _a.sent();
                return [2, quote];
            case 2:
                err_5 = _a.sent();
                throw new Error("Error: ".concat(err_5.message));
            case 3: return [2];
        }
    });
}); };
exports.getQuoteById = getQuoteById;
var fxOrderPayload = function (prisma, quote, orderId) { return __awaiter(void 0, void 0, void 0, function () {
    var falconXtokenPair, falconXPayload, falconXBasetokenPair, err_6;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                return [4, prisma.tokenPairs.findFirst({
                        where: {
                            id: quote === null || quote === void 0 ? void 0 : quote.tokenPairId,
                        },
                    })];
            case 1:
                falconXtokenPair = _c.sent();
                if (!falconXtokenPair) return [3, 5];
                falconXPayload = void 0;
                if (!falconXtokenPair.baseTokenPair) return [3, 3];
                return [4, prisma.tokenPairs.findFirst({
                        select: {
                            id: true,
                            baseToken: true,
                            quoteToken: true,
                        },
                        where: {
                            id: falconXtokenPair.baseTokenPair,
                        },
                    })];
            case 2:
                falconXBasetokenPair = _c.sent();
                falconXPayload = {
                    message_type: "CREATE_ORDER_REQUEST",
                    client_order_id: orderId,
                    client_request_id: quote === null || quote === void 0 ? void 0 : quote.id,
                    token_pair: {
                        base_token: falconXBasetokenPair === null || falconXBasetokenPair === void 0 ? void 0 : falconXBasetokenPair.baseToken,
                        quote_token: falconXBasetokenPair === null || falconXBasetokenPair === void 0 ? void 0 : falconXBasetokenPair.quoteToken,
                    },
                    quantity: {
                        token: falconXBasetokenPair === null || falconXBasetokenPair === void 0 ? void 0 : falconXBasetokenPair.baseToken,
                        value: Number(quote === null || quote === void 0 ? void 0 : quote.finalQuoteValue).toFixed(8),
                    },
                    side: (_a = quote === null || quote === void 0 ? void 0 : quote.side) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                    limit_price: quote === null || quote === void 0 ? void 0 : quote.rawQuotePrice,
                    time_in_force: "fok",
                    slippage_bps: "5",
                };
                return [3, 4];
            case 3:
                falconXPayload = {
                    message_type: "CREATE_ORDER_REQUEST",
                    client_order_id: orderId,
                    client_request_id: quote === null || quote === void 0 ? void 0 : quote.id,
                    token_pair: {
                        base_token: falconXtokenPair === null || falconXtokenPair === void 0 ? void 0 : falconXtokenPair.baseToken,
                        quote_token: falconXtokenPair === null || falconXtokenPair === void 0 ? void 0 : falconXtokenPair.quoteToken,
                    },
                    quantity: {
                        token: falconXtokenPair === null || falconXtokenPair === void 0 ? void 0 : falconXtokenPair.baseToken,
                        value: quote === null || quote === void 0 ? void 0 : quote.quantity,
                    },
                    side: (_b = quote === null || quote === void 0 ? void 0 : quote.side) === null || _b === void 0 ? void 0 : _b.toLowerCase(),
                    limit_price: quote === null || quote === void 0 ? void 0 : quote.rawQuotePrice,
                    time_in_force: "fok",
                    slippage_bps: "5",
                };
                _c.label = 4;
            case 4: return [2, falconXPayload];
            case 5: return [3, 7];
            case 6:
                err_6 = _c.sent();
                throw new Error("Error: ".concat(err_6.message));
            case 7: return [2];
        }
    });
}); };
exports.fxOrderPayload = fxOrderPayload;
var updateQuote = function (prisma, quoteId, data) { return __awaiter(void 0, void 0, void 0, function () {
    var quote, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, prisma.institutional_quotes.update({
                        where: {
                            id: quoteId,
                        },
                        data: data,
                    })];
            case 1:
                quote = _a.sent();
                return [2, quote];
            case 2:
                err_7 = _a.sent();
                throw new Error("Error: ".concat(err_7.message));
            case 3: return [2];
        }
    });
}); };
exports.updateQuote = updateQuote;
var storeOrderRequest = function (context, orderId, sourceWalletAssetId, targetWalletAssetId, institutional_quote) { return __awaiter(void 0, void 0, void 0, function () {
    var vendor, sourceWalletAsset, targetWalletAsset, transaction, assetTrade, quote, order, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                return [4, context.yoga.prisma.institutional_vendors.findFirst({
                        select: {
                            id: true,
                        },
                        where: {
                            identifier: "FX",
                        },
                    })];
            case 1:
                vendor = _a.sent();
                return [4, (0, exports.getWalletAssetByID)(context.yoga.prisma, sourceWalletAssetId)];
            case 2:
                sourceWalletAsset = _a.sent();
                return [4, (0, exports.getWalletAssetByID)(context.yoga.prisma, targetWalletAssetId)];
            case 3:
                targetWalletAsset = _a.sent();
                return [4, (0, exports.createTransaction)(context.yoga.prisma, sourceWalletAsset.walletId, targetWalletAsset.walletId, sourceWalletAsset.balanceType, targetWalletAsset.balanceType, sourceWalletAsset.assetsId, institutional_quote === null || institutional_quote === void 0 ? void 0 : institutional_quote.quantity, null, context.currentUser.userId, context.currentUser.userId, prisma_database_1.enum_transactionType.assetTrade)];
            case 4:
                transaction = _a.sent();
                return [4, (0, exports.createAssetTrade)(context.yoga.prisma, (0, uuid_1.v4)(), transaction.transactionID)];
            case 5:
                assetTrade = _a.sent();
                return [4, (0, exports.getQuoteById)(context.yoga.prisma, institutional_quote.id)];
            case 6:
                quote = _a.sent();
                return [4, context.yoga.prisma.orders.create({
                        data: {
                            id: orderId,
                            quoteId: quote.id,
                            transactionId: assetTrade.tradeOrderId,
                            userId: context.currentUser.userId,
                            sourceWalletAssetId: sourceWalletAsset.walletAssetsID,
                            targetWalletAssetId: targetWalletAsset.walletAssetsID,
                            vendorId: vendor.id,
                            orderStatus: "processing",
                            userAcceptedPrice: institutional_quote === null || institutional_quote === void 0 ? void 0 : institutional_quote.userQuotePrice,
                            userAcceptedQuantity: institutional_quote.quantity,
                            userExpectedQuantity: institutional_quote.finalQuoteValue,
                            userAcceptedSide: institutional_quote === null || institutional_quote === void 0 ? void 0 : institutional_quote.side.toUpperCase(),
                            userAcceptedTradePair: {
                                base_token: sourceWalletAsset.assets.type === "fiat"
                                    ? sourceWalletAsset.assets.ticker
                                    : sourceWalletAsset.assets.fireblocksTicker,
                                quote_token: targetWalletAsset.assets.type === "fiat"
                                    ? targetWalletAsset.assets.ticker
                                    : targetWalletAsset.assets.fireblocksTicker,
                            },
                            userAcceptedTimestamp: new Date(Date.now()),
                            allowedSlippage: null,
                        },
                    })];
            case 7:
                order = _a.sent();
                context.yoga.pubSub.publish("orders", order.id, order);
                return [2, order];
            case 8:
                err_8 = _a.sent();
                throw new Error("Error: ".concat(err_8.message));
            case 9: return [2];
        }
    });
}); };
exports.storeOrderRequest = storeOrderRequest;
var fxOrderResponse = function (yoga, data) { return __awaiter(void 0, void 0, void 0, function () {
    var quote, order, availableBalanceType, reservedBalanceType, order, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                return [4, (0, exports.getQuoteById)(yoga.prisma, data === null || data === void 0 ? void 0 : data.client_request_id)];
            case 1:
                quote = _a.sent();
                if (!(data.message_type === "CREATE_ORDER_RESPONSE")) return [3, 9];
                if (!(data.success === false)) return [3, 7];
                return [4, (0, exports.updateQuote)(yoga.prisma, quote === null || quote === void 0 ? void 0 : quote.id, {
                        quoteStatusId: 12,
                        error: data === null || data === void 0 ? void 0 : data.error,
                    })];
            case 2:
                _a.sent();
                return [4, (0, exports.updateOrder)(yoga.prisma, data === null || data === void 0 ? void 0 : data.client_order_id, {
                        orderStatus: "failed",
                    })];
            case 3:
                order = _a.sent();
                return [4, (0, exports.getAssetBalanceType)(yoga.prisma, "Available")];
            case 4:
                availableBalanceType = _a.sent();
                return [4, (0, exports.getAssetBalanceType)(yoga.prisma, "Reserved")];
            case 5:
                reservedBalanceType = _a.sent();
                return [4, yoga.clients.TRANSACTIONS_API_SERVICE.post("/balanceAdjustment", {
                        userId: order.userId,
                        walletID: order.sourceWalletAssets.walletId,
                        assetID: order.sourceWalletAssets.assetsId,
                        quantity: order.userAcceptedQuantity,
                        sourceBalanceType: reservedBalanceType.balanceTypeId,
                        targetBalanceType: availableBalanceType.balanceTypeId,
                        parentTransactionID: order.transactionId,
                    })];
            case 6:
                _a.sent();
                yoga.pubSub.publish("orders", order.id, order);
                return [3, 9];
            case 7: return [4, (0, exports.updateOrder)(yoga.prisma, data === null || data === void 0 ? void 0 : data.client_order_id, {
                    orderStatus: data === null || data === void 0 ? void 0 : data.status,
                    orderType: data === null || data === void 0 ? void 0 : data.order_type.toUpperCase(),
                    orderTimeInForce: data === null || data === void 0 ? void 0 : data.time_in_force,
                    vendorQuoteId: data === null || data === void 0 ? void 0 : data.fx_quote_id,
                    vendorQuantityRequested: data === null || data === void 0 ? void 0 : data.quantity.value,
                    vendorPriceRequested: data === null || data === void 0 ? void 0 : data.limit_price,
                    orderVendorStatus: data === null || data === void 0 ? void 0 : data.status,
                })];
            case 8:
                order = _a.sent();
                yoga.pubSub.publish("orders", order.id, order);
                _a.label = 9;
            case 9: return [3, 11];
            case 10:
                err_9 = _a.sent();
                throw new Error("Error: ".concat(err_9.message));
            case 11: return [2];
        }
    });
}); };
exports.fxOrderResponse = fxOrderResponse;
var fxOrderNotification = function (yoga, data) { return __awaiter(void 0, void 0, void 0, function () {
    var availableBalanceType, reservedBalanceType, order, updatedOrder, availableSourceWalletAsset, reservedSourceWalletAsset, tradeFee, order, updatedOrder, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 19, , 20]);
                return [4, (0, exports.getAssetBalanceType)(yoga.prisma, "Available")];
            case 1:
                availableBalanceType = _a.sent();
                return [4, (0, exports.getAssetBalanceType)(yoga.prisma, "Reserved")];
            case 2:
                reservedBalanceType = _a.sent();
                if (!(data.message_type === "FILL_ORDER_NOTIFICATION" && data.status === "success" && data.error === null)) return [3, 13];
                return [4, (0, exports.getOrderById)(yoga.prisma, data === null || data === void 0 ? void 0 : data.client_order_id)];
            case 3:
                order = _a.sent();
                return [4, (0, exports.updateQuote)(yoga.prisma, order === null || order === void 0 ? void 0 : order.quoteId, {
                        quoteStatusId: 11,
                    })];
            case 4:
                _a.sent();
                return [4, (0, exports.updateOrder)(yoga.prisma, data === null || data === void 0 ? void 0 : data.client_order_id, {
                        orderStatus: data === null || data === void 0 ? void 0 : data.status,
                        orderQuantityExecuted: data === null || data === void 0 ? void 0 : data.quantity.value,
                        orderPriceExecuted: data === null || data === void 0 ? void 0 : data.executed_price,
                        orderTimestampExecuted: new Date(data === null || data === void 0 ? void 0 : data.t_execute),
                        orderVendorStatus: data === null || data === void 0 ? void 0 : data.status,
                    })];
            case 5:
                updatedOrder = _a.sent();
                return [4, yoga.prisma.walletAssets.findFirst({
                        where: {
                            walletAssetsID: updatedOrder.sourceWalletAssetId,
                        },
                    })];
            case 6:
                availableSourceWalletAsset = _a.sent();
                return [4, yoga.prisma.walletAssets.findFirst({
                        where: {
                            walletId: availableSourceWalletAsset.walletId,
                            assetsId: availableSourceWalletAsset.assetsId,
                            balanceType: reservedBalanceType.balanceTypeId,
                        },
                    })];
            case 7:
                reservedSourceWalletAsset = _a.sent();
                return [4, (0, exports.reservedToLPsettlement1Transfer)(yoga, reservedSourceWalletAsset.walletAssetsID, updatedOrder)];
            case 8:
                _a.sent();
                return [4, (0, exports.targetAssetLPsettlement1Transfer)(yoga, updatedOrder)];
            case 9:
                _a.sent();
                return [4, (0, exports.LPsettlement1ToUserWalletTransfer)(yoga, updatedOrder)];
            case 10:
                tradeFee = _a.sent();
                return [4, (0, exports.tradeFeeLPS1tobssRevenueTransfer)(yoga, updatedOrder, tradeFee)];
            case 11:
                _a.sent();
                return [4, (0, exports.spreadFeeLPS1toqeSpreadRevenueTransfer)(yoga, updatedOrder)];
            case 12:
                _a.sent();
                yoga.pubSub.publish("orders", updatedOrder.id, updatedOrder);
                _a.label = 13;
            case 13:
                if (!(data.message_type === "REJECT_ORDER_NOTIFICATION" && data.status === "rejected")) return [3, 18];
                return [4, (0, exports.getOrderById)(yoga.prisma, data === null || data === void 0 ? void 0 : data.client_order_id)];
            case 14:
                order = _a.sent();
                return [4, (0, exports.updateQuote)(yoga.prisma, order === null || order === void 0 ? void 0 : order.quoteId, {
                        quoteStatusId: 12,
                    })];
            case 15:
                _a.sent();
                return [4, (0, exports.updateOrder)(yoga.prisma, data === null || data === void 0 ? void 0 : data.client_order_id, {
                        orderStatus: data === null || data === void 0 ? void 0 : data.status,
                        orderQuantityExecuted: data === null || data === void 0 ? void 0 : data.quantity.value,
                        orderPriceExecuted: data === null || data === void 0 ? void 0 : data.executed_price,
                        orderVendorStatus: data === null || data === void 0 ? void 0 : data.status,
                    })];
            case 16:
                updatedOrder = _a.sent();
                return [4, yoga.clients.TRANSACTIONS_API_SERVICE.post("/balanceAdjustment", {
                        userId: updatedOrder.userId,
                        walletID: updatedOrder.sourceWalletAssets.walletId,
                        assetID: updatedOrder.sourceWalletAssets.assetsId,
                        quantity: updatedOrder.userAcceptedQuantity,
                        sourceBalanceType: reservedBalanceType.balanceTypeId,
                        targetBalanceType: availableBalanceType.balanceTypeId,
                        parentTransactionID: updatedOrder.transactionId,
                    })];
            case 17:
                _a.sent();
                yoga.pubSub.publish("orders", updatedOrder.id, updatedOrder);
                _a.label = 18;
            case 18: return [3, 20];
            case 19:
                err_10 = _a.sent();
                throw new Error("Error: ".concat(err_10.message));
            case 20: return [2];
        }
    });
}); };
exports.fxOrderNotification = fxOrderNotification;
var updateOrder = function (prisma, orderId, data) { return __awaiter(void 0, void 0, void 0, function () {
    var order, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, prisma.orders.update({
                        where: {
                            id: orderId,
                        },
                        data: data,
                        include: {
                            sourceWalletAssets: true,
                        },
                    })];
            case 1:
                order = _a.sent();
                return [2, order];
            case 2:
                err_11 = _a.sent();
                throw new Error("Error: ".concat(err_11.message));
            case 3: return [2];
        }
    });
}); };
exports.updateOrder = updateOrder;
var getOrderById = function (prisma, orderId) { return __awaiter(void 0, void 0, void 0, function () {
    var order, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, prisma.orders.findFirst({
                        where: {
                            id: orderId,
                        },
                    })];
            case 1:
                order = _a.sent();
                return [2, order];
            case 2:
                err_12 = _a.sent();
                throw new Error("Error: ".concat(err_12.message));
            case 3: return [2];
        }
    });
}); };
exports.getOrderById = getOrderById;
var getAssetBalanceType = function (prisma, type) { return __awaiter(void 0, void 0, void 0, function () {
    var err_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, prisma.assetBalanceType.findFirst({
                        select: {
                            balanceTypeId: true,
                        },
                        where: {
                            balanceTypeName: type,
                        },
                    })];
            case 1: return [2, _a.sent()];
            case 2:
                err_13 = _a.sent();
                throw new Error("Error: ".concat(err_13.message));
            case 3: return [2];
        }
    });
}); };
exports.getAssetBalanceType = getAssetBalanceType;
var getSourceWalletAssetByWallet = function (prisma, walletId, quote, balanceTypeId) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAsset, err_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, prisma.walletAssets.upsert({
                        where: {
                            walletAssetsID: (0, uuid_1.v5)(quote.sourceAssetId + "-" + balanceTypeId, walletId),
                        },
                        update: {
                            walletAssetsID: (0, uuid_1.v5)(quote.sourceAssetId + "-" + balanceTypeId, walletId),
                        },
                        create: {
                            walletAssetsID: (0, uuid_1.v5)(quote.sourceAssetId + "-" + balanceTypeId, walletId),
                            walletId: walletId,
                            assetsId: quote.sourceAssetId,
                            balance: 0,
                            balanceType: balanceTypeId,
                        },
                    })];
            case 1:
                walletAsset = _a.sent();
                return [2, walletAsset];
            case 2:
                err_14 = _a.sent();
                throw new Error("Error: ".concat(err_14.message));
            case 3: return [2];
        }
    });
}); };
exports.getSourceWalletAssetByWallet = getSourceWalletAssetByWallet;
var getTargetWalletAssetByWallet = function (prisma, walletId, quote, balanceTypeId) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAsset, err_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, prisma.walletAssets.upsert({
                        where: {
                            walletAssetsID: (0, uuid_1.v5)(quote.targetAssetId + "-" + balanceTypeId, walletId),
                        },
                        update: {
                            walletAssetsID: (0, uuid_1.v5)(quote.targetAssetId + "-" + balanceTypeId, walletId),
                        },
                        create: {
                            walletAssetsID: (0, uuid_1.v5)(quote.targetAssetId + "-" + balanceTypeId, walletId),
                            walletId: walletId,
                            assetsId: quote.targetAssetId,
                            balance: 0,
                            balanceType: balanceTypeId,
                        },
                    })];
            case 1:
                walletAsset = _a.sent();
                return [2, walletAsset];
            case 2:
                err_15 = _a.sent();
                throw new Error("Error: ".concat(err_15.message));
            case 3: return [2];
        }
    });
}); };
exports.getTargetWalletAssetByWallet = getTargetWalletAssetByWallet;
var getWalletAssetByID = function (prisma, walletAssetId) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAsset, err_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, prisma.walletAssets.findFirst({
                        where: {
                            walletAssetsID: walletAssetId,
                        },
                        include: {
                            assets: true,
                        },
                    })];
            case 1:
                walletAsset = _a.sent();
                return [2, walletAsset];
            case 2:
                err_16 = _a.sent();
                throw new Error("Error: ".concat(err_16.message));
            case 3: return [2];
        }
    });
}); };
exports.getWalletAssetByID = getWalletAssetByID;
var createTransaction = function (prisma, sourceWallet, targetWallet, sourceBalanceType, targetBalanceType, assetId, quantity, parentTransactionID, userID, updateBy, type) { return __awaiter(void 0, void 0, void 0, function () {
    var transaction, transactionStatusType, err_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4, prisma.public_transactions.create({
                        data: {
                            userID: userID,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            updateBy: updateBy,
                            error: {},
                            sourceWallet: sourceWallet,
                            targetWallet: targetWallet,
                            parentTransactionID: parentTransactionID || null,
                            assets_id: assetId,
                            assetQuantity: quantity,
                            transactionPurpose: null,
                            productID: null,
                            transactionCredits: null,
                            userMemo: null,
                            type: type,
                            transactionFees: null,
                            sourceBalanceType: sourceBalanceType,
                            targetBalanceType: targetBalanceType,
                        },
                    })];
            case 1:
                transaction = _a.sent();
                return [4, prisma.public_transactionStatusTypes.findFirst({
                        where: {
                            name: "completed",
                        },
                    })];
            case 2:
                transactionStatusType = _a.sent();
                return [4, prisma.transactionStatus.create({
                        data: {
                            transactionID: transaction.transactionID,
                            transactionStatusTypeID: transactionStatusType.transactionStatusTypeID,
                        },
                    })];
            case 3:
                _a.sent();
                return [2, transaction];
            case 4:
                err_17 = _a.sent();
                throw new Error("Error: ".concat(err_17.message));
            case 5: return [2];
        }
    });
}); };
exports.createTransaction = createTransaction;
var createAssetTrade = function (prisma, tradeOrderId, transactionID) { return __awaiter(void 0, void 0, void 0, function () {
    var assetTrade, err_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, prisma.assetTrade.create({
                        data: {
                            tradeOrderId: tradeOrderId,
                            transactionID: transactionID,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    })];
            case 1:
                assetTrade = _a.sent();
                return [2, assetTrade];
            case 2:
                err_18 = _a.sent();
                throw new Error("Error: ".concat(err_18.message));
            case 3: return [2];
        }
    });
}); };
exports.createAssetTrade = createAssetTrade;
var reservedToLPsettlement1Transfer = function (yoga, reservedWalletAssetId, order) { return __awaiter(void 0, void 0, void 0, function () {
    var reservedWalletAsset, lpSettlement1Wallet, availableBalanceType, balance, lpSettlement1WalletAsset, assetTrade, err_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                return [4, yoga.prisma.walletAssets.findFirst({
                        where: {
                            walletAssetsID: reservedWalletAssetId,
                        },
                    })];
            case 1:
                reservedWalletAsset = _a.sent();
                return [4, yoga.prisma.wallets.findFirst({
                        where: {
                            walletName: "lpSettlement1",
                        },
                    })];
            case 2:
                lpSettlement1Wallet = _a.sent();
                return [4, (0, exports.getAssetBalanceType)(yoga.prisma, "Available")];
            case 3:
                availableBalanceType = _a.sent();
                balance = (0, FixedNumberHelper_1.calNumbers)().subFixedNumber(Number(reservedWalletAsset.balance), Number(order.userAcceptedQuantity))._value;
                return [4, yoga.prisma.walletAssets.update({
                        data: {
                            balance: balance,
                        },
                        where: {
                            walletAssetsID: reservedWalletAsset.walletAssetsID,
                        },
                    })];
            case 4:
                _a.sent();
                return [4, yoga.prisma.walletAssets.upsert({
                        where: {
                            walletAssetsID: (0, uuid_1.v5)(reservedWalletAsset.assetsId +
                                "-" +
                                availableBalanceType.balanceTypeId, lpSettlement1Wallet.walletsID),
                        },
                        update: {
                            balance: Number(order.userAcceptedQuantity),
                        },
                        create: {
                            walletAssetsID: (0, uuid_1.v5)(reservedWalletAsset.assetsId +
                                "-" +
                                availableBalanceType.balanceTypeId, lpSettlement1Wallet.walletsID),
                            walletId: lpSettlement1Wallet.walletsID,
                            assetsId: reservedWalletAsset.assetsId,
                            balanceType: availableBalanceType.balanceTypeId,
                            balance: Number(order.userAcceptedQuantity),
                        },
                    })];
            case 5:
                lpSettlement1WalletAsset = _a.sent();
                return [4, yoga.prisma.assetTrade.findFirst({
                        where: {
                            tradeOrderId: order.transactionId,
                        },
                    })];
            case 6:
                assetTrade = _a.sent();
                return [4, (0, exports.createTransaction)(yoga.prisma, reservedWalletAsset.walletId, lpSettlement1WalletAsset.walletId, reservedWalletAsset.balanceType, lpSettlement1WalletAsset.balanceType, reservedWalletAsset.assetsId, order === null || order === void 0 ? void 0 : order.userAcceptedQuantity, assetTrade.transactionID, order.userId, order.userId, prisma_database_1.enum_transactionType.internalWalletTransfer)];
            case 7:
                _a.sent();
                yoga.logger.info("reservedToLPsettlement1Transfer completed");
                return [3, 9];
            case 8:
                err_19 = _a.sent();
                throw new Error("Error: ".concat(err_19.message));
            case 9: return [2];
        }
    });
}); };
exports.reservedToLPsettlement1Transfer = reservedToLPsettlement1Transfer;
var targetAssetLPsettlement1Transfer = function (yoga, order) { return __awaiter(void 0, void 0, void 0, function () {
    var availableTargetWalletAsset, lpSettlement1Wallet, availableBalanceType, balance, lpSettlement1TargetWalletAsset, assetTrade, err_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4, yoga.prisma.walletAssets.findFirst({
                        where: {
                            walletAssetsID: order.targetWalletAssetId,
                        },
                    })];
            case 1:
                availableTargetWalletAsset = _a.sent();
                return [4, yoga.prisma.wallets.findFirst({
                        where: {
                            walletName: "lpSettlement1",
                        },
                    })];
            case 2:
                lpSettlement1Wallet = _a.sent();
                return [4, (0, exports.getAssetBalanceType)(yoga.prisma, "Available")];
            case 3:
                availableBalanceType = _a.sent();
                balance = (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(order.orderQuantityExecuted, order.orderPriceExecuted)._value;
                return [4, yoga.prisma.walletAssets.upsert({
                        where: {
                            walletAssetsID: (0, uuid_1.v5)(availableTargetWalletAsset.assetsId +
                                "-" +
                                availableBalanceType.balanceTypeId, lpSettlement1Wallet.walletsID),
                        },
                        update: {
                            balance: balance,
                        },
                        create: {
                            walletAssetsID: (0, uuid_1.v5)(availableTargetWalletAsset.assetsId +
                                "-" +
                                availableBalanceType.balanceTypeId, lpSettlement1Wallet.walletsID),
                            walletId: lpSettlement1Wallet.walletsID,
                            assetsId: availableTargetWalletAsset.assetsId,
                            balanceType: availableBalanceType.balanceTypeId,
                            balance: balance,
                        },
                    })];
            case 4:
                lpSettlement1TargetWalletAsset = _a.sent();
                return [4, yoga.prisma.assetTrade.findFirst({
                        where: {
                            tradeOrderId: order.transactionId,
                        },
                    })];
            case 5:
                assetTrade = _a.sent();
                return [4, (0, exports.createTransaction)(yoga.prisma, availableTargetWalletAsset.walletId, lpSettlement1TargetWalletAsset.walletId, availableTargetWalletAsset.balanceType, lpSettlement1TargetWalletAsset.balanceType, availableTargetWalletAsset.assetsId, order === null || order === void 0 ? void 0 : order.userAcceptedQuantity, assetTrade.transactionID, order.userId, order.userId, prisma_database_1.enum_transactionType.ledgerAdjustment)];
            case 6:
                _a.sent();
                yoga.logger.info("targetAssetLPsettlement1Transfer completed");
                return [3, 8];
            case 7:
                err_20 = _a.sent();
                throw new Error("Error: ".concat(err_20.message));
            case 8: return [2];
        }
    });
}); };
exports.targetAssetLPsettlement1Transfer = targetAssetLPsettlement1Transfer;
var LPsettlement1ToUserWalletTransfer = function (yoga, order) { return __awaiter(void 0, void 0, void 0, function () {
    var availableTargetWalletAsset, lpSettlement1Wallet, availableBalanceType, lpSettlement1WalletAsset, balance, tradeFeePercentage, tradeFee, userTargetAssetBalance, lpSettlement1TargetAssetBalance, lpSettlement1TargetWalletAsset, userTargetWalletAsset, assetTrade, err_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                return [4, yoga.prisma.walletAssets.findFirst({
                        where: {
                            walletAssetsID: order.targetWalletAssetId,
                        },
                    })];
            case 1:
                availableTargetWalletAsset = _a.sent();
                return [4, yoga.prisma.wallets.findFirst({
                        where: {
                            walletName: "lpSettlement1",
                        },
                    })];
            case 2:
                lpSettlement1Wallet = _a.sent();
                return [4, (0, exports.getAssetBalanceType)(yoga.prisma, "Available")];
            case 3:
                availableBalanceType = _a.sent();
                return [4, yoga.prisma.walletAssets.findFirst({
                        where: {
                            walletAssetsID: (0, uuid_1.v5)(availableTargetWalletAsset.assetsId +
                                "-" +
                                availableBalanceType.balanceTypeId, lpSettlement1Wallet.walletsID),
                        },
                    })];
            case 4:
                lpSettlement1WalletAsset = _a.sent();
                balance = (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(order.userAcceptedPrice, order.userAcceptedQuantity)._value;
                tradeFeePercentage = 1.5;
                tradeFee = (0, FixedNumberHelper_1.calNumbers)().divFixedNumber((0, FixedNumberHelper_1.calNumbers)().mulFixedNumber((0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(order.orderPriceExecuted, order.orderQuantityExecuted)._value, tradeFeePercentage)._value, 100)._value;
                userTargetAssetBalance = void 0;
                if (order.userAcceptedSide === prisma_database_1.enum_tokenPairs_tradeSide.BUY) {
                    userTargetAssetBalance = (0, FixedNumberHelper_1.calNumbers)().subFixedNumber(order.orderQuantityExecuted, tradeFee)._value;
                }
                else {
                    userTargetAssetBalance = (0, FixedNumberHelper_1.calNumbers)().subFixedNumber(balance, tradeFee)._value;
                }
                lpSettlement1TargetAssetBalance = (0, FixedNumberHelper_1.calNumbers)().subFixedNumber(Number(lpSettlement1WalletAsset.balance), userTargetAssetBalance)._value;
                return [4, yoga.prisma.walletAssets.upsert({
                        where: {
                            walletAssetsID: (0, uuid_1.v5)(availableTargetWalletAsset.assetsId +
                                "-" +
                                availableBalanceType.balanceTypeId, lpSettlement1Wallet.walletsID),
                        },
                        update: {
                            balance: lpSettlement1TargetAssetBalance,
                        },
                        create: {
                            walletAssetsID: (0, uuid_1.v5)(availableTargetWalletAsset.assetsId +
                                "-" +
                                availableBalanceType.balanceTypeId, lpSettlement1Wallet.walletsID),
                            walletId: lpSettlement1Wallet.walletsID,
                            assetsId: availableTargetWalletAsset.assetsId,
                            balanceType: availableBalanceType.balanceTypeId,
                            balance: lpSettlement1TargetAssetBalance,
                        },
                    })];
            case 5:
                lpSettlement1TargetWalletAsset = _a.sent();
                return [4, yoga.prisma.walletAssets.update({
                        where: {
                            walletAssetsID: availableTargetWalletAsset.walletAssetsID,
                        },
                        data: {
                            balance: (0, FixedNumberHelper_1.calNumbers)().addFixedNumber(Number(availableTargetWalletAsset.balance), userTargetAssetBalance)._value,
                        },
                    })];
            case 6:
                userTargetWalletAsset = _a.sent();
                return [4, yoga.prisma.assetTrade.findFirst({
                        where: {
                            tradeOrderId: order.transactionId,
                        },
                    })];
            case 7:
                assetTrade = _a.sent();
                return [4, (0, exports.createTransaction)(yoga.prisma, lpSettlement1TargetWalletAsset.walletId, userTargetWalletAsset.walletId, lpSettlement1TargetWalletAsset.balanceType, userTargetWalletAsset.balanceType, lpSettlement1TargetWalletAsset.assetsId, order === null || order === void 0 ? void 0 : order.userAcceptedQuantity, assetTrade.transactionID, order.userId, order.userId, prisma_database_1.enum_transactionType.internalWalletTransfer)];
            case 8:
                _a.sent();
                yoga.logger.info("LPsettlement1ToUserWalletTransfer completed");
                return [2, tradeFee];
            case 9:
                err_21 = _a.sent();
                throw new Error("Error: ".concat(err_21.message));
            case 10: return [2];
        }
    });
}); };
exports.LPsettlement1ToUserWalletTransfer = LPsettlement1ToUserWalletTransfer;
var tradeFeeLPS1tobssRevenueTransfer = function (yoga, order, tradeFee) { return __awaiter(void 0, void 0, void 0, function () {
    var availableTargetWalletAsset, bssRevenueWallet, bssRevenueWalletAsset, lpSettlement1Wallet, lpSettlement1WalletAsset, updatedbssRevenueWalletAsset, assetTrade, err_22;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                return [4, yoga.prisma.walletAssets.findFirst({
                        where: {
                            walletAssetsID: order.targetWalletAssetId,
                        },
                    })];
            case 1:
                availableTargetWalletAsset = _a.sent();
                return [4, yoga.prisma.wallets.findFirst({
                        where: {
                            walletName: "bssRevenue",
                        },
                    })];
            case 2:
                bssRevenueWallet = _a.sent();
                return [4, yoga.prisma.walletAssets.findFirst({
                        where: {
                            walletAssetsID: (0, uuid_1.v5)(availableTargetWalletAsset.assetsId +
                                "-" +
                                availableTargetWalletAsset.balanceType, bssRevenueWallet.walletsID),
                        },
                    })];
            case 3:
                bssRevenueWalletAsset = _a.sent();
                return [4, yoga.prisma.wallets.findFirst({
                        where: {
                            walletName: "lpSettlement1",
                        },
                    })];
            case 4:
                lpSettlement1Wallet = _a.sent();
                return [4, yoga.prisma.walletAssets.findFirst({
                        where: {
                            walletAssetsID: (0, uuid_1.v5)(availableTargetWalletAsset.assetsId +
                                "-" +
                                availableTargetWalletAsset.balanceType, lpSettlement1Wallet.walletsID),
                        },
                    })];
            case 5:
                lpSettlement1WalletAsset = _a.sent();
                return [4, yoga.prisma.walletAssets.update({
                        where: {
                            walletAssetsID: lpSettlement1WalletAsset.walletAssetsID,
                        },
                        data: {
                            balance: (0, FixedNumberHelper_1.calNumbers)().subFixedNumber(Number(lpSettlement1WalletAsset.balance), tradeFee)._value,
                        },
                    })];
            case 6:
                _a.sent();
                return [4, yoga.prisma.walletAssets.upsert({
                        where: {
                            walletAssetsID: (0, uuid_1.v5)(availableTargetWalletAsset.assetsId +
                                "-" +
                                availableTargetWalletAsset.balanceType, bssRevenueWallet.walletsID),
                        },
                        update: {
                            balance: (0, FixedNumberHelper_1.calNumbers)().addFixedNumber(bssRevenueWalletAsset ? Number(bssRevenueWalletAsset.balance) : 0, tradeFee)._value,
                        },
                        create: {
                            walletAssetsID: (0, uuid_1.v5)(availableTargetWalletAsset.assetsId +
                                "-" +
                                availableTargetWalletAsset.balanceType, bssRevenueWallet.walletsID),
                            walletId: bssRevenueWallet.walletsID,
                            assetsId: availableTargetWalletAsset.assetsId,
                            balanceType: availableTargetWalletAsset.balanceType,
                            balance: tradeFee,
                        },
                    })];
            case 7:
                updatedbssRevenueWalletAsset = _a.sent();
                return [4, yoga.prisma.assetTrade.findFirst({
                        where: {
                            tradeOrderId: order.transactionId,
                        },
                    })];
            case 8:
                assetTrade = _a.sent();
                return [4, (0, exports.createTransaction)(yoga.prisma, lpSettlement1WalletAsset.walletId, updatedbssRevenueWalletAsset.walletId, lpSettlement1WalletAsset.balanceType, updatedbssRevenueWalletAsset.balanceType, lpSettlement1WalletAsset.assetsId, order === null || order === void 0 ? void 0 : order.userAcceptedQuantity, assetTrade.transactionID, order.userId, order.userId, prisma_database_1.enum_transactionType.internalWalletTransfer)];
            case 9:
                _a.sent();
                yoga.logger.info("tradeFeeLPS1tobssRevenueTransfer completed");
                return [3, 11];
            case 10:
                err_22 = _a.sent();
                throw new Error("Error: ".concat(err_22.message));
            case 11: return [2];
        }
    });
}); };
exports.tradeFeeLPS1tobssRevenueTransfer = tradeFeeLPS1tobssRevenueTransfer;
var spreadFeeLPS1toqeSpreadRevenueTransfer = function (yoga, order) { return __awaiter(void 0, void 0, void 0, function () {
    var availableTargetWalletAsset, lpSettlement1Wallet, lpSettlement1WalletAsset, orderExecutedPrice, userAcceptedPrice, spreadFee, qeSpreadRevenueWallet, qeSpreadRevenueWalletAsset, updatedqeSpreadRevenueWalletAsset, assetTrade, err_23;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                return [4, yoga.prisma.walletAssets.findFirst({
                        where: {
                            walletAssetsID: order.targetWalletAssetId,
                        },
                    })];
            case 1:
                availableTargetWalletAsset = _a.sent();
                return [4, yoga.prisma.wallets.findFirst({
                        where: {
                            walletName: "lpSettlement1",
                        },
                    })];
            case 2:
                lpSettlement1Wallet = _a.sent();
                return [4, yoga.prisma.walletAssets.findFirst({
                        where: {
                            walletAssetsID: (0, uuid_1.v5)(availableTargetWalletAsset.assetsId +
                                "-" +
                                availableTargetWalletAsset.balanceType, lpSettlement1Wallet.walletsID),
                        },
                    })];
            case 3:
                lpSettlement1WalletAsset = _a.sent();
                orderExecutedPrice = (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(order.orderPriceExecuted, order.orderQuantityExecuted)._value;
                userAcceptedPrice = (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(order.userAcceptedPrice, order.userAcceptedQuantity)._value;
                spreadFee = (0, FixedNumberHelper_1.calNumbers)().subFixedNumber(orderExecutedPrice, userAcceptedPrice)._value;
                return [4, yoga.prisma.wallets.findFirst({
                        where: {
                            walletName: "qeSpreadRevenue",
                        },
                    })];
            case 4:
                qeSpreadRevenueWallet = _a.sent();
                return [4, yoga.prisma.walletAssets.findFirst({
                        where: {
                            walletAssetsID: (0, uuid_1.v5)(availableTargetWalletAsset.assetsId +
                                "-" +
                                availableTargetWalletAsset.balanceType, qeSpreadRevenueWallet.walletsID),
                        },
                    })];
            case 5:
                qeSpreadRevenueWalletAsset = _a.sent();
                return [4, yoga.prisma.walletAssets.update({
                        where: {
                            walletAssetsID: lpSettlement1WalletAsset.walletAssetsID,
                        },
                        data: {
                            balance: (0, FixedNumberHelper_1.calNumbers)().subFixedNumber(Number(lpSettlement1WalletAsset.balance), spreadFee)._value,
                        },
                    })];
            case 6:
                _a.sent();
                return [4, yoga.prisma.walletAssets.upsert({
                        where: {
                            walletAssetsID: (0, uuid_1.v5)(availableTargetWalletAsset.assetsId +
                                "-" +
                                availableTargetWalletAsset.balanceType, qeSpreadRevenueWallet.walletsID),
                        },
                        update: {
                            balance: (0, FixedNumberHelper_1.calNumbers)().addFixedNumber(qeSpreadRevenueWalletAsset
                                ? Number(qeSpreadRevenueWalletAsset.balance)
                                : 0, spreadFee)._value,
                        },
                        create: {
                            walletAssetsID: (0, uuid_1.v5)(availableTargetWalletAsset.assetsId +
                                "-" +
                                availableTargetWalletAsset.balanceType, qeSpreadRevenueWallet.walletsID),
                            walletId: qeSpreadRevenueWallet.walletsID,
                            assetsId: availableTargetWalletAsset.assetsId,
                            balanceType: availableTargetWalletAsset.balanceType,
                            balance: spreadFee,
                        },
                    })];
            case 7:
                updatedqeSpreadRevenueWalletAsset = _a.sent();
                return [4, yoga.prisma.assetTrade.findFirst({
                        where: {
                            tradeOrderId: order.transactionId,
                        },
                    })];
            case 8:
                assetTrade = _a.sent();
                return [4, (0, exports.createTransaction)(yoga.prisma, lpSettlement1WalletAsset.walletId, updatedqeSpreadRevenueWalletAsset.walletId, lpSettlement1WalletAsset.balanceType, updatedqeSpreadRevenueWalletAsset.balanceType, lpSettlement1WalletAsset.assetsId, order === null || order === void 0 ? void 0 : order.userAcceptedQuantity, assetTrade.transactionID, order.userId, order.userId, prisma_database_1.enum_transactionType.internalWalletTransfer)];
            case 9:
                _a.sent();
                yoga.logger.info("spreadFeeLPS1toqeSpreadRevenueTransfer completed");
                return [3, 11];
            case 10:
                err_23 = _a.sent();
                throw new Error("Error: ".concat(err_23.message));
            case 11: return [2];
        }
    });
}); };
exports.spreadFeeLPS1toqeSpreadRevenueTransfer = spreadFeeLPS1toqeSpreadRevenueTransfer;
//# sourceMappingURL=utils.js.map