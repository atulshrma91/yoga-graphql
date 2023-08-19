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
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotesResolvers = void 0;
var graphql_yoga_1 = require("graphql-yoga");
var index_1 = require("graphql/index");
var uuid_1 = require("uuid");
var auth_resolver_1 = require("../../../composable/auth.resolver");
var composable_resolver_1 = require("../../../composable/composable.resolver");
var utils_1 = require("./utils");
exports.quotesResolvers = {
    Query: {
        getTokenPairs: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) { return __awaiter(void 0, void 0, void 0, function () {
            var tokenPairs, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4, context.yoga.prisma.eligibleTradeAssets.findMany({
                                include: {
                                    assets: true,
                                },
                            })];
                    case 1:
                        tokenPairs = (_b.sent());
                        return [2, tokenPairs];
                    case 2:
                        err_1 = _b.sent();
                        context.yoga.logger.error(err_1);
                        return [2, Promise.reject(new index_1.GraphQLError(err_1.message))];
                    case 3: return [2];
                }
            });
        }); }),
    },
    Mutation: {
        createQuote: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var quote, tokenPair, _a, falconXPayload, err_2;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 8, , 9]);
                        return [4, (0, utils_1.storeQuoteRequest)(context.yoga.prisma, args.baseToken, args.quoteToken, args.quantity, args.source, (_b = context.currentUser) === null || _b === void 0 ? void 0 : _b.userId)];
                    case 1:
                        quote = _c.sent();
                        return [4, context.yoga.prisma.tokenPairs.findFirst({
                                select: {
                                    queueTableName: true,
                                    vendors: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                                where: {
                                    id: quote === null || quote === void 0 ? void 0 : quote.tokenPairId,
                                },
                            })];
                    case 2:
                        tokenPair = _c.sent();
                        _a = tokenPair.vendors.name;
                        switch (_a) {
                            case "FalconX": return [3, 3];
                            case "Uniswap": return [3, 5];
                        }
                        return [3, 7];
                    case 3:
                        context.yoga.feedStreamingClient.io.opts.extraHeaders = (0, utils_1.createFXheaders)(context.yoga.FXapiKey, context.yoga.FXapiSecret, context.yoga.FXapiPassPhrase);
                        context.yoga.feedStreamingClient.connect();
                        return [4, (0, utils_1.fxSubscribePriceFeed)(context.yoga.prisma, args.baseToken, args.quoteToken, args.quantity, quote === null || quote === void 0 ? void 0 : quote.id)];
                    case 4:
                        falconXPayload = _c.sent();
                        context.yoga.feedStreamingClient.emit("subscribe", falconXPayload);
                        return [3, 7];
                    case 5: return [4, context.yoga.clients.UNISWAP_API_SERVICE.post("/getQuote", {
                            id: quote === null || quote === void 0 ? void 0 : quote.id,
                            quantityToken: args.quantityToken,
                        })];
                    case 6:
                        _c.sent();
                        return [3, 7];
                    case 7:
                        context.yoga.pubSub.publish(tokenPair === null || tokenPair === void 0 ? void 0 : tokenPair.queueTableName, quote === null || quote === void 0 ? void 0 : quote.id, {
                            id: quote.id,
                            quoteStatusId: quote.quoteStatusId,
                            sourceAssetId: quote.sourceAssetId,
                            targetAssetId: quote.targetAssetId,
                            side: quote.side,
                            userId: quote.userId,
                            vendorId: quote.vendorId,
                            createdAt: quote.createdAt,
                            updatedAt: quote.updatedAt,
                            buyPrice: "0",
                            sellPrice: "0",
                            quantity: quote.quantity,
                        });
                        return [2, { quoteId: quote === null || quote === void 0 ? void 0 : quote.id }];
                    case 8:
                        err_2 = _c.sent();
                        context.yoga.logger.error(err_2);
                        if (err_2 === null || err_2 === void 0 ? void 0 : err_2.isAxiosError) {
                            return [2, Promise.reject(new index_1.GraphQLError(err_2.response.data.message))];
                        }
                        return [2, Promise.reject(new index_1.GraphQLError(err_2.message))];
                    case 9: return [2];
                }
            });
        }); }),
        executeQuote: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var quote, tokenPair, availableBalanceType, reservedBalanceType, availableSourceWalletAsset, availableTargetWalletAsset, orderId, order, _a, orderPayload, uniswapOrder, reservedBalanceType_1, order_1, updatedOrder, availableSourceWalletAsset_1, reservedSourceWalletAsset, tradeFee, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 29, , 30]);
                        return [4, (0, utils_1.getQuoteById)(context.yoga.prisma, args === null || args === void 0 ? void 0 : args.quoteId)];
                    case 1:
                        quote = _b.sent();
                        return [4, context.yoga.prisma.tokenPairs.findFirst({
                                select: {
                                    queueTableName: true,
                                    vendors: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                                where: {
                                    id: quote === null || quote === void 0 ? void 0 : quote.tokenPairId,
                                },
                            })];
                    case 2:
                        tokenPair = _b.sent();
                        return [4, (0, utils_1.getAssetBalanceType)(context.yoga.prisma, "Available")];
                    case 3:
                        availableBalanceType = _b.sent();
                        return [4, (0, utils_1.getAssetBalanceType)(context.yoga.prisma, "Reserved")];
                    case 4:
                        reservedBalanceType = _b.sent();
                        return [4, (0, utils_1.getSourceWalletAssetByWallet)(context.yoga.prisma, args === null || args === void 0 ? void 0 : args.walletId, quote, availableBalanceType.balanceTypeId)];
                    case 5:
                        availableSourceWalletAsset = _b.sent();
                        context.yoga.logger.info(availableSourceWalletAsset, "availableSourceWalletAsset");
                        return [4, (0, utils_1.getTargetWalletAssetByWallet)(context.yoga.prisma, args === null || args === void 0 ? void 0 : args.walletId, quote, availableBalanceType.balanceTypeId)];
                    case 6:
                        availableTargetWalletAsset = _b.sent();
                        context.yoga.logger.info(availableTargetWalletAsset, "availableTargetWalletAsset");
                        orderId = (0, uuid_1.v4)();
                        return [4, (0, utils_1.storeOrderRequest)(context, orderId, availableSourceWalletAsset.walletAssetsID, availableTargetWalletAsset.walletAssetsID, quote)];
                    case 7:
                        order = _b.sent();
                        context.yoga.logger.info(order, "order");
                        return [4, (0, utils_1.updateQuote)(context.yoga.prisma, quote === null || quote === void 0 ? void 0 : quote.id, {
                                quoteStatusId: 10,
                            })];
                    case 8:
                        _b.sent();
                        if (!availableSourceWalletAsset) return [3, 28];
                        if (!(availableSourceWalletAsset.balance &&
                            Number(availableSourceWalletAsset.balance) >= Number(quote === null || quote === void 0 ? void 0 : quote.quantity))) return [3, 27];
                        return [4, context.yoga.clients.TRANSACTIONS_API_SERVICE.post("/balanceAdjustment", {
                                userId: context.currentUser.userId,
                                walletID: availableSourceWalletAsset.walletId,
                                assetID: availableSourceWalletAsset.assetsId,
                                quantity: order.userAcceptedQuantity,
                                sourceBalanceType: availableBalanceType.balanceTypeId,
                                targetBalanceType: reservedBalanceType.balanceTypeId,
                                parentTransactionID: order.transactionId,
                            })];
                    case 9:
                        _b.sent();
                        _a = tokenPair.vendors.name;
                        switch (_a) {
                            case "FalconX": return [3, 10];
                            case "Uniswap": return [3, 12];
                        }
                        return [3, 26];
                    case 10: return [4, (0, utils_1.fxOrderPayload)(context.yoga.prisma, quote, orderId)];
                    case 11:
                        orderPayload = _b.sent();
                        context.yoga.logger.info(orderPayload, "orderPayload");
                        context.yoga.orderReqClient.io.opts.extraHeaders = (0, utils_1.createFXheaders)(context.yoga.FXapiKey, context.yoga.FXapiSecret, context.yoga.FXapiPassPhrase);
                        context.yoga.orderReqClient.connect();
                        context.yoga.orderReqClient.emit("request", orderPayload);
                        return [3, 26];
                    case 12: return [4, context.yoga.clients.UNISWAP_API_SERVICE.post("/executeQuote", {
                            id: order === null || order === void 0 ? void 0 : order.id,
                        })];
                    case 13:
                        uniswapOrder = _b.sent();
                        if (!uniswapOrder.data) return [3, 25];
                        return [4, (0, utils_1.getAssetBalanceType)(context.yoga.prisma, "Reserved")];
                    case 14:
                        reservedBalanceType_1 = _b.sent();
                        return [4, (0, utils_1.getOrderById)(context.yoga.prisma, uniswapOrder.data.client_order_id)];
                    case 15:
                        order_1 = _b.sent();
                        return [4, (0, utils_1.updateQuote)(context.yoga.prisma, order_1 === null || order_1 === void 0 ? void 0 : order_1.quoteId, {
                                quoteStatusId: 11,
                            })];
                    case 16:
                        _b.sent();
                        return [4, (0, utils_1.updateOrder)(context.yoga.prisma, uniswapOrder.data.client_order_id, {
                                orderStatus: '',
                                orderQuantityExecuted: '',
                                orderPriceExecuted: '',
                                orderTimestampExecuted: new Date(),
                                orderVendorStatus: '',
                            })];
                    case 17:
                        updatedOrder = _b.sent();
                        return [4, context.yoga.prisma.walletAssets.findFirst({
                                where: {
                                    walletAssetsID: updatedOrder.sourceWalletAssetId,
                                },
                            })];
                    case 18:
                        availableSourceWalletAsset_1 = _b.sent();
                        return [4, context.yoga.prisma.walletAssets.findFirst({
                                where: {
                                    walletId: availableSourceWalletAsset_1.walletId,
                                    assetsId: availableSourceWalletAsset_1.assetsId,
                                    balanceType: reservedBalanceType_1.balanceTypeId,
                                },
                            })];
                    case 19:
                        reservedSourceWalletAsset = _b.sent();
                        return [4, (0, utils_1.reservedToLPsettlement1Transfer)(context.yoga, reservedSourceWalletAsset.walletAssetsID, updatedOrder)];
                    case 20:
                        _b.sent();
                        return [4, (0, utils_1.targetAssetLPsettlement1Transfer)(context.yoga, updatedOrder)];
                    case 21:
                        _b.sent();
                        return [4, (0, utils_1.LPsettlement1ToUserWalletTransfer)(context.yoga, updatedOrder)];
                    case 22:
                        tradeFee = _b.sent();
                        return [4, (0, utils_1.tradeFeeLPS1tobssRevenueTransfer)(context.yoga, updatedOrder, tradeFee)];
                    case 23:
                        _b.sent();
                        return [4, (0, utils_1.spreadFeeLPS1toqeSpreadRevenueTransfer)(context.yoga, updatedOrder)];
                    case 24:
                        _b.sent();
                        _b.label = 25;
                    case 25: return [3, 26];
                    case 26: return [2, { orderId: order === null || order === void 0 ? void 0 : order.id }];
                    case 27: return [2, Promise.reject(new index_1.GraphQLError("Error: Insufficient Funds"))];
                    case 28: return [2, Promise.reject(new index_1.GraphQLError("Error: Invalid wallet"))];
                    case 29:
                        err_3 = _b.sent();
                        console.log('asdasd11');
                        context.yoga.logger.error(err_3);
                        if (err_3 === null || err_3 === void 0 ? void 0 : err_3.isAxiosError) {
                            return [2, Promise.reject(new index_1.GraphQLError(err_3.response.data.message))];
                        }
                        return [2, Promise.reject(new index_1.GraphQLError(err_3.message))];
                    case 30: return [2];
                }
            });
        }); }),
        getOrder: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var order, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, context.yoga.prisma.orders.findFirst({
                                select: {
                                    id: true,
                                    orderStatus: true,
                                    updatedAt: true,
                                    orderPriceExecuted: true,
                                    userAcceptedPrice: true,
                                },
                                where: {
                                    id: args.orderId,
                                },
                            })];
                    case 1:
                        order = _a.sent();
                        return [2, order];
                    case 2:
                        err_4 = _a.sent();
                        context.yoga.logger.error(err_4);
                        return [2, Promise.reject(new index_1.GraphQLError(err_4.message))];
                    case 3: return [2];
                }
            });
        }); }),
    },
    Subscription: {
        getQuote: {
            subscribe: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, getQuote(args.quoteId, context)];
                    case 1: return [2, _a.sent()];
                }
            }); }); },
            resolve: function (quote) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, resolveGetQuote(quote)];
                    case 1: return [2, _a.sent()];
                }
            }); }); },
        },
    },
};
var getQuote = function (quoteId, context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (context.currentUser === null) {
            return [2, Promise.reject(new index_1.GraphQLError("Unauthorized"))];
        }
        return [2, getdbQuote(quoteId, context)];
    });
}); };
var getdbQuote = function (quoteId, context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, new graphql_yoga_1.Repeater(function (push, stop) { return __awaiter(void 0, void 0, void 0, function () {
                function quote() {
                    return __awaiter(this, void 0, void 0, function () {
                        var quote;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, context.yoga.prisma.institutional_quotes.findFirst({
                                        include: {
                                            tokenPairs: true,
                                        },
                                        where: {
                                            id: quoteId,
                                        },
                                    })];
                                case 1:
                                    quote = _a.sent();
                                    push(quote);
                                    return [2];
                            }
                        });
                    });
                }
                var interval;
                return __generator(this, function (_a) {
                    quote();
                    interval = setInterval(quote, 1000);
                    stop.then(function () {
                        clearInterval(interval);
                    });
                    return [2];
                });
            }); })];
    });
}); };
var resolveGetQuote = function (quote) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        return [2, {
                id: quote === null || quote === void 0 ? void 0 : quote.id,
                side: quote === null || quote === void 0 ? void 0 : quote.side,
                quantity: quote === null || quote === void 0 ? void 0 : quote.quantity,
                spreadFee: quote === null || quote === void 0 ? void 0 : quote.spreadFee,
                userQuotePrice: quote === null || quote === void 0 ? void 0 : quote.userQuotePrice,
                finalQuoteValue: quote === null || quote === void 0 ? void 0 : quote.finalQuoteValue,
                updatedAt: quote === null || quote === void 0 ? void 0 : quote.updatedAt,
                baseToken: quote === null || quote === void 0 ? void 0 : quote.tokenPairs.baseToken,
                quoteToken: (_a = quote === null || quote === void 0 ? void 0 : quote.tokenPairs) === null || _a === void 0 ? void 0 : _a.quoteToken,
            }];
    });
}); };
//# sourceMappingURL=quotes.resolvers.js.map