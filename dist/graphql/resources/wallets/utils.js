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
exports.getCollateralWalletLoan = exports.getWalletAssetsTotalBalance = exports.parseWalletAssets = exports.getCoinMarketInfo = exports.lockAssetBalance = exports.stakeAssetBalance = exports.getWalletTransactions = exports.getWalletByID = exports.getStakingWalletAssets = exports.getCollateralWalletAssets = exports.getTransactionalWalletAssets = exports.getUserMembership = exports.getStakingWalletsAssets = exports.getStakingWalletsTransactions = exports.getCollateralWalletsAssets = exports.getCollateralWalletsTransactions = exports.getTransactionalWalletsAssets = exports.getTransactionalWalletsTransactions = exports.getWalletsByType = exports.getBalanceType = exports.getWalletTypeOnName = exports.getFiatAsset = void 0;
var prisma_database_1 = require("@connectfinancial/prisma-database");
var utils_1 = require("@connectfinancial/utils");
var FixedNumberHelper_1 = require("@connectfinancial/utils/dist/FixedNumberHelper");
var getFiatAsset = function (context, assetId) {
    return context.yoga.prisma.institutional_assets.findFirst({
        where: { id: assetId, type: prisma_database_1.enum_assets_type.fiat },
        include: {
            fiatAssets: true,
        },
    });
};
exports.getFiatAsset = getFiatAsset;
var getWalletTypeOnName = function (context, type) {
    return context.yoga.prisma.walletTypes.findFirst({
        where: {
            name: type,
        },
    });
};
exports.getWalletTypeOnName = getWalletTypeOnName;
var getBalanceType = function (context, name) {
    return context.yoga.prisma.assetBalanceType.findFirst({
        where: {
            balanceTypeName: {
                equals: name,
                mode: "insensitive",
            },
        },
    });
};
exports.getBalanceType = getBalanceType;
var getWalletsByType = function (context, walletTypeId) {
    return context.yoga.prisma.wallets.findMany({
        where: {
            userId: context.currentUser.userId,
            walletTypeId: walletTypeId,
        },
        include: {
            walletTypes: true,
        },
    });
};
exports.getWalletsByType = getWalletsByType;
var getTransactionalWalletsTransactions = function (context, userTransactionalWalletArr, assetId) {
    return context.yoga.prisma.public_transactions.findMany({
        where: {
            sourceWallet: { in: userTransactionalWalletArr },
            userID: context.currentUser.userId,
            assets_id: assetId,
        },
    });
};
exports.getTransactionalWalletsTransactions = getTransactionalWalletsTransactions;
var getTransactionalWalletsAssets = function (context, userTransactionalWalletArr, balanceType) {
    return context.yoga.prisma.walletAssets.findMany({
        where: {
            walletId: { in: userTransactionalWalletArr },
            balanceType: balanceType,
        },
        include: {
            assets: true,
            assetBalanceType: true,
        },
    });
};
exports.getTransactionalWalletsAssets = getTransactionalWalletsAssets;
var getCollateralWalletsTransactions = function (context, collateralWalletArr, assetId) {
    return context.yoga.prisma.public_transactions.findMany({
        where: {
            sourceWallet: { in: collateralWalletArr },
            userID: context.currentUser.userId,
            assets_id: assetId,
        },
    });
};
exports.getCollateralWalletsTransactions = getCollateralWalletsTransactions;
var getCollateralWalletsAssets = function (context, collateralWalletArr, balanceType) {
    return context.yoga.prisma.walletAssets.findMany({
        where: {
            walletId: { in: collateralWalletArr },
            balanceType: balanceType,
        },
        include: {
            assets: true,
            assetBalanceType: true,
        },
    });
};
exports.getCollateralWalletsAssets = getCollateralWalletsAssets;
var getStakingWalletsTransactions = function (context, stakingWalletArr, assetId) {
    return context.yoga.prisma.public_transactions.findMany({
        where: {
            sourceWallet: { in: stakingWalletArr },
            userID: context.currentUser.userId,
            assets_id: assetId,
        },
    });
};
exports.getStakingWalletsTransactions = getStakingWalletsTransactions;
var getStakingWalletsAssets = function (context, stakingWalletArr, balanceType) {
    return context.yoga.prisma.walletAssets.findMany({
        where: {
            walletId: { in: stakingWalletArr },
            balanceType: balanceType,
        },
        include: {
            assets: true,
            assetBalanceType: true,
        },
    });
};
exports.getStakingWalletsAssets = getStakingWalletsAssets;
var getUserMembership = function (context) {
    return context.yoga.prisma.userMemberships.findFirst({
        where: {
            userId: context.currentUser.userId,
        },
        include: {
            membershipPrograms: true,
        },
    });
};
exports.getUserMembership = getUserMembership;
var getTransactionalWalletAssets = function (context, transactionalWallet, balanceType, limit, offset) { return __awaiter(void 0, void 0, void 0, function () {
    var transactionalWalletAssets, assetsArr, _i, transactionalWalletAssets_1, transactionalWalletAsset, ticker, marketInfo, walletAsset;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, context.yoga.prisma.walletAssets.findMany({
                    where: {
                        walletId: transactionalWallet,
                        balanceType: balanceType,
                    },
                    include: {
                        assets: true,
                        assetBalanceType: true,
                    },
                    skip: offset,
                    take: limit,
                })];
            case 1:
                transactionalWalletAssets = _a.sent();
                assetsArr = [];
                if (!(transactionalWalletAssets === null || transactionalWalletAssets === void 0 ? void 0 : transactionalWalletAssets.length)) return [3, 5];
                _i = 0, transactionalWalletAssets_1 = transactionalWalletAssets;
                _a.label = 2;
            case 2:
                if (!(_i < transactionalWalletAssets_1.length)) return [3, 5];
                transactionalWalletAsset = transactionalWalletAssets_1[_i];
                ticker = transactionalWalletAsset.assets.type === "crypto"
                    ? transactionalWalletAsset.assets.fireblocksTicker
                    : transactionalWalletAsset.assets.ticker;
                return [4, (0, exports.getCoinMarketInfo)(context, ticker)];
            case 3:
                marketInfo = _a.sent();
                walletAsset = {
                    walletAssetsID: transactionalWalletAsset.walletAssetsID,
                    balance: transactionalWalletAsset.balance,
                    assets: {
                        id: transactionalWalletAsset.assets.id,
                        name: transactionalWalletAsset.assets.name,
                        ticker: transactionalWalletAsset.assets.ticker,
                        fireblocksTicker: transactionalWalletAsset.assets.fireblocksTicker,
                        type: transactionalWalletAsset.assets.type,
                    },
                    assetBalanceType: {
                        balanceTypeName: transactionalWalletAsset.assetBalanceType.balanceTypeName,
                    },
                    usdPrice: marketInfo ? marketInfo.current_price : null,
                    price: marketInfo
                        ? (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(Number(marketInfo.current_price), Number(transactionalWalletAsset.balance))._value
                        : ticker === "USD"
                            ? transactionalWalletAsset.balance.toString()
                            : null,
                    sevenDayPercChange: marketInfo ? marketInfo.price_change_percentage_7d_in_currency : null,
                };
                assetsArr.push(walletAsset);
                _a.label = 4;
            case 4:
                _i++;
                return [3, 2];
            case 5: return [2, assetsArr];
        }
    });
}); };
exports.getTransactionalWalletAssets = getTransactionalWalletAssets;
var getCollateralWalletAssets = function (context, collateralWallet, balanceType, limit, offset) { return __awaiter(void 0, void 0, void 0, function () {
    var collateralWalletAssets, assetsArr, _i, collateralWalletAssets_1, collateralWalletAsset, ticker, marketInfo, walletAsset;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, context.yoga.prisma.walletAssets.findMany({
                    where: {
                        walletId: collateralWallet,
                        balanceType: balanceType,
                    },
                    include: {
                        assets: true,
                        assetBalanceType: true,
                    },
                    skip: offset,
                    take: limit,
                })];
            case 1:
                collateralWalletAssets = _a.sent();
                assetsArr = [];
                if (!(collateralWalletAssets === null || collateralWalletAssets === void 0 ? void 0 : collateralWalletAssets.length)) return [3, 5];
                _i = 0, collateralWalletAssets_1 = collateralWalletAssets;
                _a.label = 2;
            case 2:
                if (!(_i < collateralWalletAssets_1.length)) return [3, 5];
                collateralWalletAsset = collateralWalletAssets_1[_i];
                ticker = collateralWalletAsset.assets.type === "crypto"
                    ? collateralWalletAsset.assets.fireblocksTicker
                    : collateralWalletAsset.assets.ticker;
                return [4, (0, exports.getCoinMarketInfo)(context, ticker)];
            case 3:
                marketInfo = _a.sent();
                walletAsset = {
                    walletAssetsID: collateralWalletAsset.walletAssetsID,
                    balance: collateralWalletAsset.balance,
                    assets: {
                        id: collateralWalletAsset.assets.id,
                        name: collateralWalletAsset.assets.name,
                        ticker: collateralWalletAsset.assets.ticker,
                        fireblocksTicker: collateralWalletAsset.assets.fireblocksTicker,
                        type: collateralWalletAsset.assets.type,
                    },
                    assetBalanceType: {
                        balanceTypeName: collateralWalletAsset.assetBalanceType.balanceTypeName,
                    },
                    usdPrice: marketInfo ? marketInfo.current_price : null,
                    price: marketInfo
                        ? (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(Number(marketInfo.current_price), Number(collateralWalletAsset.balance))._value
                        : ticker === "USD"
                            ? collateralWalletAsset.balance.toString()
                            : null,
                    sevenDayPercChange: marketInfo ? marketInfo.price_change_percentage_7d_in_currency : null,
                };
                assetsArr.push(walletAsset);
                _a.label = 4;
            case 4:
                _i++;
                return [3, 2];
            case 5: return [2, assetsArr];
        }
    });
}); };
exports.getCollateralWalletAssets = getCollateralWalletAssets;
var getStakingWalletAssets = function (context, stakingWallet, balanceType, limit, offset) { return __awaiter(void 0, void 0, void 0, function () {
    var stakingWalletAssets, assetsArr, _i, stakingWalletAssets_1, stakingWalletAsset, ticker, marketInfo, walletAsset;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, context.yoga.prisma.walletAssets.findMany({
                    where: {
                        walletId: stakingWallet,
                        balanceType: balanceType,
                    },
                    include: {
                        assets: true,
                        assetBalanceType: true,
                    },
                    skip: offset,
                    take: limit,
                })];
            case 1:
                stakingWalletAssets = _a.sent();
                assetsArr = [];
                if (!(stakingWalletAssets === null || stakingWalletAssets === void 0 ? void 0 : stakingWalletAssets.length)) return [3, 5];
                _i = 0, stakingWalletAssets_1 = stakingWalletAssets;
                _a.label = 2;
            case 2:
                if (!(_i < stakingWalletAssets_1.length)) return [3, 5];
                stakingWalletAsset = stakingWalletAssets_1[_i];
                ticker = stakingWalletAsset.assets.type === "crypto"
                    ? stakingWalletAsset.assets.fireblocksTicker
                    : stakingWalletAsset.assets.ticker;
                return [4, (0, exports.getCoinMarketInfo)(context, ticker)];
            case 3:
                marketInfo = _a.sent();
                walletAsset = {
                    walletAssetsID: stakingWalletAsset.walletAssetsID,
                    balance: stakingWalletAsset.balance,
                    assets: {
                        id: stakingWalletAsset.assets.id,
                        name: stakingWalletAsset.assets.name,
                        ticker: stakingWalletAsset.assets.ticker,
                        fireblocksTicker: stakingWalletAsset.assets.fireblocksTicker,
                        type: stakingWalletAsset.assets.type,
                    },
                    assetBalanceType: {
                        balanceTypeName: stakingWalletAsset.assetBalanceType.balanceTypeName,
                    },
                    usdPrice: marketInfo ? marketInfo.current_price : null,
                    price: marketInfo
                        ? (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(Number(marketInfo.current_price), Number(stakingWalletAsset.balance))._value
                        : ticker === "USD"
                            ? stakingWalletAsset.balance.toString()
                            : null,
                    sevenDayPercChange: marketInfo ? marketInfo.price_change_percentage_7d_in_currency : null,
                };
                assetsArr.push(walletAsset);
                _a.label = 4;
            case 4:
                _i++;
                return [3, 2];
            case 5: return [2, assetsArr];
        }
    });
}); };
exports.getStakingWalletAssets = getStakingWalletAssets;
var getWalletByID = function (context, walletsID) {
    return context.yoga.prisma.wallets.findFirst({
        where: {
            userId: context.currentUser.userId,
            walletsID: walletsID,
        },
        include: {
            walletTypes: true,
        },
    });
};
exports.getWalletByID = getWalletByID;
var getWalletTransactions = function (context, walletsID, limit, offset) { return __awaiter(void 0, void 0, void 0, function () {
    var transactions, transactionsArr, _i, transactions_1, transaction, txn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, context.yoga.prisma.public_transactions.findMany({
                    where: {
                        sourceWallet: walletsID,
                        userID: context.currentUser.userId,
                        transactionStatus: {
                            transactionsStatus: {
                                NOT: { name: "notUserViewable" },
                            },
                        },
                    },
                    include: {
                        assets: true,
                        transactionStatus: {
                            include: {
                                transactionsStatus: true,
                            },
                        },
                    },
                    skip: offset,
                    take: limit,
                })];
            case 1:
                transactions = _a.sent();
                transactionsArr = [];
                if (transactions === null || transactions === void 0 ? void 0 : transactions.length) {
                    for (_i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
                        transaction = transactions_1[_i];
                        txn = {
                            transactionID: transaction.transactionID,
                            type: transaction.type,
                            createdAt: transaction.createdAt,
                            assetQuantity: transaction.assetQuantity,
                            transactionPurpose: transaction.transactionPurpose,
                            transactionStatus: transaction.transactionStatus.transactionsStatus.name,
                            assets: {
                                id: transaction.assets.id,
                                name: transaction.assets.name,
                                ticker: transaction.assets.ticker,
                                fireblocksTicker: transaction.assets.fireblocksTicker,
                                type: transaction.assets.type,
                            },
                        };
                        transactionsArr.push(txn);
                    }
                }
                return [2, transactionsArr];
        }
    });
}); };
exports.getWalletTransactions = getWalletTransactions;
var stakeAssetBalance = function (context, sourceWalletId, targetWalletId, assetId, balance, sourceWalletBalanceType) { return __awaiter(void 0, void 0, void 0, function () {
    var targetWallet, sourceBalanceType, targetBalanceType, sourceWallet, walletAsset, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                return [4, context.yoga.prisma.wallets.findFirst({
                        where: {
                            walletsID: targetWalletId,
                            userId: context.userId,
                        },
                        include: {
                            walletTypes: true,
                        },
                    })];
            case 1:
                targetWallet = _b.sent();
                if (!targetWallet) {
                    throw new Error("targetWallet not found!");
                }
                return [4, (0, exports.getBalanceType)(context, sourceWalletBalanceType)];
            case 2:
                sourceBalanceType = _b.sent();
                if (!sourceBalanceType) {
                    throw new Error("sourceBalanceType not found!");
                }
                return [4, (0, exports.getBalanceType)(context, "Staked")];
            case 3:
                targetBalanceType = _b.sent();
                if (!(targetWallet.walletTypes.name === "STAKING")) return [3, 5];
                return [4, context.yoga.clients.TRANSACTIONS_API_SERVICE.post("/balanceAdjustment", {
                        userId: context.currentUser.userId,
                        walletID: targetWallet.walletsID,
                        assetID: assetId,
                        quantity: balance,
                        sourceBalanceType: sourceBalanceType.balanceTypeId,
                        targetBalanceType: targetBalanceType.balanceTypeId,
                    })];
            case 4:
                _b.sent();
                return [3, 8];
            case 5: return [4, context.yoga.prisma.wallets.findFirst({
                    where: {
                        walletsID: sourceWalletId,
                        userId: context.userId,
                    },
                    include: {
                        walletTypes: true,
                    },
                })];
            case 6:
                sourceWallet = _b.sent();
                return [4, context.yoga.clients.TRANSACTIONS_API_SERVICE.post("/internalWalletTransfer", {
                        userId: (_a = context.currentUser) === null || _a === void 0 ? void 0 : _a.userId,
                        sourceWalletID: sourceWallet.walletsID,
                        targetWalletID: targetWallet.walletsID,
                        assetID: assetId,
                        quantity: balance,
                        sourceBalanceType: sourceBalanceType.balanceTypeId,
                        targetBalanceType: targetBalanceType.balanceTypeId,
                    })];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [4, context.yoga.prisma.walletAssets.findFirst({
                    where: {
                        walletId: targetWallet.walletsID,
                        assetsId: assetId,
                        balanceType: targetBalanceType.balanceTypeId,
                    },
                    include: {
                        assets: true,
                        assetBalanceType: true,
                    },
                })];
            case 9:
                walletAsset = _b.sent();
                return [2, walletAsset];
            case 10:
                err_1 = _b.sent();
                if (err_1 === null || err_1 === void 0 ? void 0 : err_1.isAxiosError) {
                    throw new Error("Error: ".concat(err_1.response.data.message));
                }
                else {
                    throw new Error("Error: ".concat(err_1.message));
                }
                return [3, 11];
            case 11: return [2];
        }
    });
}); };
exports.stakeAssetBalance = stakeAssetBalance;
var lockAssetBalance = function (context, sourceWalletId, targetWalletId, assetId, balance, sourceWalletBalanceType) { return __awaiter(void 0, void 0, void 0, function () {
    var targetWallet, sourceBalanceType, targetBalanceType, sourceWallet, walletAsset, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                return [4, context.yoga.prisma.wallets.findFirst({
                        where: {
                            walletsID: targetWalletId,
                            userId: context.userId,
                        },
                        include: {
                            walletTypes: true,
                        },
                    })];
            case 1:
                targetWallet = _b.sent();
                if (!targetWallet) {
                    throw new Error("targetWallet not found!");
                }
                return [4, (0, exports.getBalanceType)(context, sourceWalletBalanceType)];
            case 2:
                sourceBalanceType = _b.sent();
                if (!sourceBalanceType) {
                    throw new Error("sourceBalanceType not found!");
                }
                return [4, (0, exports.getBalanceType)(context, "Locked")];
            case 3:
                targetBalanceType = _b.sent();
                if (!(targetWallet.walletTypes.name === "STAKING")) return [3, 5];
                return [4, context.yoga.clients.TRANSACTIONS_API_SERVICE.post("/balanceAdjustment", {
                        userId: context.currentUser.userId,
                        walletID: targetWallet.walletsID,
                        assetID: assetId,
                        quantity: balance,
                        sourceBalanceType: sourceBalanceType.balanceTypeId,
                        targetBalanceType: targetBalanceType.balanceTypeId,
                    })];
            case 4:
                _b.sent();
                return [3, 8];
            case 5: return [4, context.yoga.prisma.wallets.findFirst({
                    where: {
                        walletsID: sourceWalletId,
                        userId: context.userId,
                    },
                    include: {
                        walletTypes: true,
                    },
                })];
            case 6:
                sourceWallet = _b.sent();
                return [4, context.yoga.clients.TRANSACTIONS_API_SERVICE.post("/internalWalletTransfer", {
                        userId: (_a = context.currentUser) === null || _a === void 0 ? void 0 : _a.userId,
                        sourceWalletID: sourceWallet.walletsID,
                        targetWalletID: targetWallet.walletsID,
                        assetID: assetId,
                        quantity: balance,
                        sourceBalanceType: sourceBalanceType.balanceTypeId,
                        targetBalanceType: targetBalanceType.balanceTypeId,
                    })];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [4, context.yoga.prisma.walletAssets.findFirst({
                    where: {
                        walletId: targetWallet.walletsID,
                        assetsId: assetId,
                        balanceType: targetBalanceType.balanceTypeId,
                    },
                    include: {
                        assets: true,
                        assetBalanceType: true,
                    },
                })];
            case 9:
                walletAsset = _b.sent();
                return [2, walletAsset];
            case 10:
                err_2 = _b.sent();
                if (err_2 === null || err_2 === void 0 ? void 0 : err_2.isAxiosError) {
                    throw new Error("Error: ".concat(err_2.response.data.message));
                }
                else {
                    throw new Error("Error: ".concat(err_2.message));
                }
                return [3, 11];
            case 11: return [2];
        }
    });
}); };
exports.lockAssetBalance = lockAssetBalance;
var getCoinMarketInfo = function (context, ticker) { return __awaiter(void 0, void 0, void 0, function () {
    var key, marketInfo, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                key = "CRYPTOCOMPARE_".concat(ticker, "-USD");
                return [4, (0, utils_1.coinMarketInfo)(context.yoga.cache, key)];
            case 1:
                marketInfo = _a.sent();
                if (marketInfo) {
                    return [2, JSON.parse(marketInfo)];
                }
                return [2, null];
            case 2:
                err_3 = _a.sent();
                throw new Error("Error: ".concat(err_3.message));
            case 3: return [2];
        }
    });
}); };
exports.getCoinMarketInfo = getCoinMarketInfo;
var parseWalletAssets = function (context, walletAssets) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAssetArr, _i, walletAssets_1, walletAsset, ticker, marketInfo, walletAssetObj, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                walletAssetArr = [];
                _i = 0, walletAssets_1 = walletAssets;
                _a.label = 1;
            case 1:
                if (!(_i < walletAssets_1.length)) return [3, 4];
                walletAsset = walletAssets_1[_i];
                ticker = walletAsset.assets.type === "crypto"
                    ? walletAsset.assets.fireblocksTicker
                    : walletAsset.assets.ticker;
                return [4, (0, exports.getCoinMarketInfo)(context, ticker)];
            case 2:
                marketInfo = _a.sent();
                walletAssetObj = new Map();
                walletAssetObj.set("walletAssetsID", walletAsset.walletAssetsID);
                walletAssetObj.set("balance", walletAsset.balance);
                walletAssetObj.set("assets", walletAsset.assets);
                walletAssetObj.set("assetBalanceType", walletAsset.assetBalanceType);
                walletAssetObj.set("price", marketInfo
                    ? (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(Number(marketInfo.current_price), Number(walletAsset.balance))._value
                    : ticker === "USD"
                        ? walletAsset.balance
                        : null);
                walletAssetObj.set("usdPrice", marketInfo ? marketInfo.current_price : null);
                walletAssetObj.set("sevenDayPercChange", marketInfo ? marketInfo.price_change_percentage_7d_in_currency : null);
                walletAssetArr.push(Object.fromEntries(walletAssetObj));
                _a.label = 3;
            case 3:
                _i++;
                return [3, 1];
            case 4: return [2, walletAssetArr];
            case 5:
                err_4 = _a.sent();
                throw new Error("Error: ".concat(err_4.message));
            case 6: return [2];
        }
    });
}); };
exports.parseWalletAssets = parseWalletAssets;
var getWalletAssetsTotalBalance = function (walletAssets) { return __awaiter(void 0, void 0, void 0, function () {
    var balance, _i, walletAssets_2, walletAsset;
    return __generator(this, function (_a) {
        try {
            balance = "0";
            for (_i = 0, walletAssets_2 = walletAssets; _i < walletAssets_2.length; _i++) {
                walletAsset = walletAssets_2[_i];
                if (walletAsset.price) {
                    balance = (0, FixedNumberHelper_1.calNumbers)().addFixedNumber(Number(balance), Number(walletAsset.price))._value;
                }
            }
            return [2, balance];
        }
        catch (err) {
            throw new Error("Error: ".concat(err.message));
        }
        return [2];
    });
}); };
exports.getWalletAssetsTotalBalance = getWalletAssetsTotalBalance;
var getCollateralWalletLoan = function (context, walletId) { return __awaiter(void 0, void 0, void 0, function () {
    var loanRecord, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, context.yoga.prisma.loanRecord.findFirst({
                        include: {
                            lineOfCreditProduct: true,
                            loanProductShort: true,
                            loanProductLong: true,
                        },
                        where: {
                            collateralWalletId: walletId,
                        },
                    })];
            case 1:
                loanRecord = _a.sent();
                return [2, loanRecord];
            case 2:
                err_5 = _a.sent();
                throw new Error("Error: ".concat(err_5.message));
            case 3: return [2];
        }
    });
}); };
exports.getCollateralWalletLoan = getCollateralWalletLoan;
//# sourceMappingURL=utils.js.map