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
exports.priceFeedResolver = void 0;
var index_1 = require("graphql/index");
var graphql_yoga_1 = require("graphql-yoga");
var utils_1 = require("../wallets/utils");
exports.priceFeedResolver = {
    Subscription: {
        getPriceFeed: {
            subscribe: function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, getPriceFeed(args.ticker, context)];
                    case 1: return [2, _a.sent()];
                }
            }); }); },
            resolve: function (priceFeed) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, resolvePriceFeed(priceFeed)];
                    case 1: return [2, _a.sent()];
                }
            }); }); },
        },
    },
};
var getPriceFeed = function (ticker, context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (context.currentUser === null) {
            return [2, Promise.reject(new index_1.GraphQLError("Unauthorized"))];
        }
        return [2, getFeed(ticker, context)];
    });
}); };
var getFeed = function (ticker, context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, new graphql_yoga_1.Repeater(function (push, stop) { return __awaiter(void 0, void 0, void 0, function () {
                function priceFeed() {
                    return __awaiter(this, void 0, void 0, function () {
                        var marketInfo;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, (0, utils_1.getCoinMarketInfo)(context, ticker)];
                                case 1:
                                    marketInfo = _a.sent();
                                    if (marketInfo) {
                                        push(marketInfo);
                                    }
                                    else {
                                        push({
                                            name: null,
                                            currentPrice: null,
                                            symbol: null,
                                            sevenDayPerChange: null,
                                            todayPerChange: null,
                                            lastUpdated: null,
                                        });
                                    }
                                    return [2];
                            }
                        });
                    });
                }
                var interval;
                return __generator(this, function (_a) {
                    priceFeed();
                    interval = setInterval(priceFeed, 5000);
                    stop.then(function () {
                        clearInterval(interval);
                    });
                    return [2];
                });
            }); })];
    });
}); };
var resolvePriceFeed = function (priceFeed) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, {
                name: priceFeed.name,
                currentPrice: priceFeed.current_price,
                symbol: priceFeed.symbol,
                sevenDayPerChange: priceFeed.price_change_percentage_7d_in_currency,
                todayPerChange: priceFeed.price_change_percentage_24h_in_currency,
                lastUpdated: new Date(priceFeed.last_updated * 1000).toISOString(),
            }];
    });
}); };
//# sourceMappingURL=priceFeed.resolver.js.map