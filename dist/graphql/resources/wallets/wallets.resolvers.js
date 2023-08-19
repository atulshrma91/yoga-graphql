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
exports.walletResolvers = void 0;
var index_1 = require("graphql/index");
require("reflect-metadata");
var tsyringe_1 = require("tsyringe");
var FixedNumberHelper_1 = require("@connectfinancial/utils/dist/FixedNumberHelper");
var auth_resolver_1 = require("../../../composable/auth.resolver");
var composable_resolver_1 = require("../../../composable/composable.resolver");
var CreateCustodyWalletAssetsService_1 = __importDefault(require("../../../modules/wallets/services/CreateCustodyWalletAssetsService"));
var CreateCustodyWalletService_1 = __importDefault(require("../../../modules/wallets/services/CreateCustodyWalletService"));
var IGenerateStakingAssetsSummary_1 = __importDefault(require("./dtos/IGenerateStakingAssetsSummary"));
var IGenerateWalletAssetsSummary_1 = __importDefault(require("./dtos/IGenerateWalletAssetsSummary"));
var IGenerateWalletsSummary_1 = __importDefault(require("./dtos/IGenerateWalletsSummary"));
var IGenerateWalletSummary_1 = __importDefault(require("./dtos/IGenerateWalletSummary"));
var IGenerateWalletTransactionsSummary_1 = __importDefault(require("./dtos/IGenerateWalletTransactionsSummary"));
var utils_1 = require("./utils");
exports.walletResolvers = {
    Query: {
        getEligibleWallets: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var product, eligibleWalletTypes, walletTypes, asset, wallets_3, walletArr_1, _i, wallets_1, wallet, walletObj, walletAssets, wallets, walletArr, _a, wallets_2, wallet, walletObj, walletAssets, err_1;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 19, , 20]);
                        return [4, context.yoga.prisma.products.findFirst({
                                where: {
                                    productID: args.productID,
                                },
                            })];
                    case 1:
                        product = _d.sent();
                        if (!product) {
                            throw new Error('Error: No product found');
                        }
                        return [4, context.yoga.prisma.productEligibleWalletTypes.findMany({
                                select: {
                                    id: true,
                                    walletTypeId: true,
                                    productType: true,
                                },
                                where: {
                                    productType: product.productType,
                                },
                            })];
                    case 2:
                        eligibleWalletTypes = _d.sent();
                        walletTypes = eligibleWalletTypes.map(function (eligibleWalletType) { return eligibleWalletType === null || eligibleWalletType === void 0 ? void 0 : eligibleWalletType.walletTypeId; });
                        if (!args.asset) return [3, 11];
                        return [4, context.yoga.prisma.institutional_assets.findFirst({
                                select: {
                                    id: true,
                                },
                                where: {
                                    OR: [
                                        {
                                            ticker: args.asset,
                                        },
                                        { fireblocksTicker: args.asset },
                                    ],
                                },
                            })];
                    case 3:
                        asset = _d.sent();
                        return [4, context.yoga.prisma.wallets.findMany({
                                include: {
                                    walletAssets: {
                                        include: {
                                            assets: true,
                                            assetBalanceType: true,
                                        },
                                        where: {
                                            assetsId: asset === null || asset === void 0 ? void 0 : asset.id,
                                        },
                                    },
                                },
                                where: {
                                    userId: (_b = context.currentUser) === null || _b === void 0 ? void 0 : _b.userId,
                                    walletTypeId: { in: walletTypes },
                                },
                            })];
                    case 4:
                        wallets_3 = _d.sent();
                        walletArr_1 = [];
                        _i = 0, wallets_1 = wallets_3;
                        _d.label = 5;
                    case 5:
                        if (!(_i < wallets_1.length)) return [3, 10];
                        wallet = wallets_1[_i];
                        walletObj = new Map();
                        walletObj.set('walletsID', wallet.walletsID);
                        walletObj.set('walletName', wallet.walletName);
                        if (!wallet.walletAssets) return [3, 7];
                        return [4, (0, utils_1.parseWalletAssets)(context, wallet.walletAssets)];
                    case 6:
                        walletAssets = _d.sent();
                        walletObj.set('walletAssets', walletAssets);
                        return [3, 8];
                    case 7:
                        walletObj.set('walletAssets', []);
                        _d.label = 8;
                    case 8:
                        walletArr_1.push(Object.fromEntries(walletObj));
                        _d.label = 9;
                    case 9:
                        _i++;
                        return [3, 5];
                    case 10: return [2, walletArr_1];
                    case 11: return [4, context.yoga.prisma.wallets.findMany({
                            include: {
                                walletAssets: {
                                    include: {
                                        assets: true,
                                        assetBalanceType: true,
                                    },
                                },
                            },
                            where: {
                                userId: (_c = context.currentUser) === null || _c === void 0 ? void 0 : _c.userId,
                                walletTypeId: { in: walletTypes },
                            },
                        })];
                    case 12:
                        wallets = _d.sent();
                        walletArr = [];
                        if (!wallets) return [3, 18];
                        _a = 0, wallets_2 = wallets;
                        _d.label = 13;
                    case 13:
                        if (!(_a < wallets_2.length)) return [3, 18];
                        wallet = wallets_2[_a];
                        walletObj = new Map();
                        walletObj.set('walletsID', wallet.walletsID);
                        walletObj.set('walletName', wallet.walletName);
                        if (!wallet.walletAssets) return [3, 15];
                        return [4, (0, utils_1.parseWalletAssets)(context, wallet.walletAssets)];
                    case 14:
                        walletAssets = _d.sent();
                        walletObj.set('walletAssets', walletAssets);
                        return [3, 16];
                    case 15:
                        walletObj.set('walletAssets', []);
                        _d.label = 16;
                    case 16:
                        walletArr.push(Object.fromEntries(walletObj));
                        _d.label = 17;
                    case 17:
                        _a++;
                        return [3, 13];
                    case 18: return [2, walletArr];
                    case 19:
                        err_1 = _d.sent();
                        context.yoga.logger.error(err_1);
                        return [2, Promise.reject(new index_1.GraphQLError(err_1.message))];
                    case 20: return [2];
                }
            });
        }); }),
        generateWalletsSummary: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) { return __awaiter(void 0, void 0, void 0, function () {
            var walletsSummary, preferredFiatAsset, asset, transactionalWalletType, availableBalanceType, transactionalWallets, transactionalWalletArr, _i, transactionalWallets_1, transactionalWallet, assets, balance, wallet, transactionalWalletsAssets, _b, transactionalWalletsAssets_1, transactionalWalletsAsset, ticker, marketInfo, walletAsset, _c, collateralWalletType, collateralWallets, collateralWalletArr, _d, collateralWallets_1, collateralWallet, assets, balance, loanRecord, wallet, collateralWalletsAssets, _e, collateralWalletsAssets_1, collateralWalletsAsset, ticker, marketInfo, walletAsset, _f, stakingWalletType, stakingWallets, stakingWalletArr, _g, stakingWallets_1, stakingWallet, assets, balance, wallet, stakingWalletsAssets, _h, stakingWalletsAssets_1, stakingWalletsAsset, ticker, marketInfo, walletAsset, _j, userMembership, err_2;
            var _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        _m.trys.push([0, 47, , 48]);
                        walletsSummary = new IGenerateWalletsSummary_1.default();
                        preferredFiatAsset = 1;
                        return [4, (0, utils_1.getFiatAsset)(context, preferredFiatAsset)];
                    case 1:
                        asset = _m.sent();
                        walletsSummary.currencySymbol = asset.fiatAssets.symbol;
                        return [4, (0, utils_1.getWalletTypeOnName)(context, 'TRANSACTIONAL')];
                    case 2:
                        transactionalWalletType = _m.sent();
                        return [4, (0, utils_1.getBalanceType)(context, 'Available')];
                    case 3:
                        availableBalanceType = _m.sent();
                        return [4, (0, utils_1.getWalletsByType)(context, transactionalWalletType.walletTypesID)];
                    case 4:
                        transactionalWallets = _m.sent();
                        walletsSummary.wallets.Transactional.totalWallets = transactionalWallets.length;
                        transactionalWalletArr = [];
                        if (!(transactionalWallets === null || transactionalWallets === void 0 ? void 0 : transactionalWallets.length)) return [3, 16];
                        _i = 0, transactionalWallets_1 = transactionalWallets;
                        _m.label = 5;
                    case 5:
                        if (!(_i < transactionalWallets_1.length)) return [3, 9];
                        transactionalWallet = transactionalWallets_1[_i];
                        transactionalWalletArr.push(transactionalWallet.walletsID);
                        return [4, (0, utils_1.getTransactionalWalletAssets)(context, transactionalWallet.walletsID, availableBalanceType.balanceTypeId)];
                    case 6:
                        assets = _m.sent();
                        return [4, (0, utils_1.getWalletAssetsTotalBalance)(assets)];
                    case 7:
                        balance = _m.sent();
                        wallet = {
                            walletId: transactionalWallet.walletsID,
                            nickname: transactionalWallet.walletName,
                            type: transactionalWallet.walletTypes.name,
                            assets: assets,
                            balance: balance,
                            pendingRewards: '0',
                            totalBalance: balance,
                        };
                        walletsSummary.transactional.push(wallet);
                        _m.label = 8;
                    case 8:
                        _i++;
                        return [3, 5];
                    case 9: return [4, (0, utils_1.getTransactionalWalletsAssets)(context, transactionalWalletArr, availableBalanceType.balanceTypeId)];
                    case 10:
                        transactionalWalletsAssets = _m.sent();
                        if (!(transactionalWalletsAssets === null || transactionalWalletsAssets === void 0 ? void 0 : transactionalWalletsAssets.length)) return [3, 16];
                        _b = 0, transactionalWalletsAssets_1 = transactionalWalletsAssets;
                        _m.label = 11;
                    case 11:
                        if (!(_b < transactionalWalletsAssets_1.length)) return [3, 14];
                        transactionalWalletsAsset = transactionalWalletsAssets_1[_b];
                        ticker = transactionalWalletsAsset.assets.type === 'crypto'
                            ? transactionalWalletsAsset.assets.fireblocksTicker
                            : transactionalWalletsAsset.assets.ticker;
                        return [4, (0, utils_1.getCoinMarketInfo)(context, ticker)];
                    case 12:
                        marketInfo = _m.sent();
                        walletAsset = {
                            walletAssetsID: transactionalWalletsAsset.walletAssetsID,
                            balance: transactionalWalletsAsset.balance,
                            assets: {
                                id: transactionalWalletsAsset.assets.id,
                                name: transactionalWalletsAsset.assets.name,
                                ticker: transactionalWalletsAsset.assets.ticker,
                                fireblocksTicker: transactionalWalletsAsset.assets.fireblocksTicker,
                                type: transactionalWalletsAsset.assets.type,
                            },
                            assetBalanceType: {
                                balanceTypeName: transactionalWalletsAsset.assetBalanceType.balanceTypeName,
                            },
                            usdPrice: marketInfo ? marketInfo.current_price : null,
                            price: marketInfo
                                ? (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(Number(marketInfo.current_price), Number(transactionalWalletsAsset.balance))._value
                                : ticker === 'USD'
                                    ? transactionalWalletsAsset.balance.toString()
                                    : null,
                            sevenDayPercChange: marketInfo
                                ? marketInfo.price_change_percentage_7d_in_currency
                                : null,
                        };
                        walletsSummary.wallets.Transactional.assets.push(walletAsset);
                        _m.label = 13;
                    case 13:
                        _b++;
                        return [3, 11];
                    case 14:
                        _c = walletsSummary.wallets.Transactional;
                        return [4, (0, utils_1.getWalletAssetsTotalBalance)(walletsSummary.wallets.Transactional.assets)];
                    case 15:
                        _c.totalBalance = _m.sent();
                        _m.label = 16;
                    case 16: return [4, (0, utils_1.getWalletTypeOnName)(context, 'COLLATERAL')];
                    case 17:
                        collateralWalletType = _m.sent();
                        return [4, (0, utils_1.getWalletsByType)(context, collateralWalletType.walletTypesID)];
                    case 18:
                        collateralWallets = _m.sent();
                        walletsSummary.wallets.Collateral.totalWallets = collateralWallets.length;
                        collateralWalletArr = [];
                        if (!(collateralWallets === null || collateralWallets === void 0 ? void 0 : collateralWallets.length)) return [3, 31];
                        _d = 0, collateralWallets_1 = collateralWallets;
                        _m.label = 19;
                    case 19:
                        if (!(_d < collateralWallets_1.length)) return [3, 24];
                        collateralWallet = collateralWallets_1[_d];
                        collateralWalletArr.push(collateralWallet.walletsID);
                        return [4, (0, utils_1.getCollateralWalletAssets)(context, collateralWallet.walletsID, availableBalanceType.balanceTypeId)];
                    case 20:
                        assets = _m.sent();
                        return [4, (0, utils_1.getWalletAssetsTotalBalance)(assets)];
                    case 21:
                        balance = _m.sent();
                        return [4, (0, utils_1.getCollateralWalletLoan)(context, collateralWallet.walletsID)];
                    case 22:
                        loanRecord = _m.sent();
                        wallet = {
                            walletId: collateralWallet.walletsID,
                            nickname: collateralWallet.walletName,
                            type: collateralWallet.walletTypes.name,
                            assets: assets,
                            ltvFeePercentage: 0,
                            totalLoanAmount: loanRecord ? loanRecord.currentBalance : null,
                            paidOnLoanAmount: loanRecord ? loanRecord.currentBalance : null,
                            loanEndDate: loanRecord ? new Date(loanRecord.expiringAt) : null,
                            totalBalance: balance,
                            minimumPayment: null,
                            minimumPaymentDueDate: null,
                            outstandingPaymentBalance: null,
                        };
                        walletsSummary.collateral.push(wallet);
                        _m.label = 23;
                    case 23:
                        _d++;
                        return [3, 19];
                    case 24: return [4, (0, utils_1.getCollateralWalletsAssets)(context, collateralWalletArr, availableBalanceType.balanceTypeId)];
                    case 25:
                        collateralWalletsAssets = _m.sent();
                        if (!(collateralWalletsAssets === null || collateralWalletsAssets === void 0 ? void 0 : collateralWalletsAssets.length)) return [3, 31];
                        _e = 0, collateralWalletsAssets_1 = collateralWalletsAssets;
                        _m.label = 26;
                    case 26:
                        if (!(_e < collateralWalletsAssets_1.length)) return [3, 29];
                        collateralWalletsAsset = collateralWalletsAssets_1[_e];
                        ticker = collateralWalletsAsset.assets.type === 'crypto'
                            ? collateralWalletsAsset.assets.fireblocksTicker
                            : collateralWalletsAsset.assets.ticker;
                        return [4, (0, utils_1.getCoinMarketInfo)(context, ticker)];
                    case 27:
                        marketInfo = _m.sent();
                        walletAsset = {
                            walletAssetsID: collateralWalletsAsset.walletAssetsID,
                            balance: collateralWalletsAsset.balance,
                            assets: {
                                id: collateralWalletsAsset.assets.id,
                                name: collateralWalletsAsset.assets.name,
                                ticker: collateralWalletsAsset.assets.ticker,
                                fireblocksTicker: collateralWalletsAsset.assets.fireblocksTicker,
                                type: collateralWalletsAsset.assets.type,
                            },
                            assetBalanceType: {
                                balanceTypeName: collateralWalletsAsset.assetBalanceType.balanceTypeName,
                            },
                            usdPrice: marketInfo ? marketInfo.current_price : null,
                            price: marketInfo
                                ? (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(Number(marketInfo.current_price), Number(collateralWalletsAsset.balance))._value
                                : ticker === 'USD'
                                    ? collateralWalletsAsset.balance.toString()
                                    : null,
                            sevenDayPercChange: marketInfo
                                ? marketInfo.price_change_percentage_7d_in_currency
                                : null,
                        };
                        walletsSummary.wallets.Collateral.assets.push(walletAsset);
                        _m.label = 28;
                    case 28:
                        _e++;
                        return [3, 26];
                    case 29:
                        _f = walletsSummary.wallets.Collateral;
                        return [4, (0, utils_1.getWalletAssetsTotalBalance)(walletsSummary.wallets.Collateral.assets)];
                    case 30:
                        _f.totalBalance = _m.sent();
                        _m.label = 31;
                    case 31: return [4, (0, utils_1.getWalletTypeOnName)(context, 'STAKING')];
                    case 32:
                        stakingWalletType = _m.sent();
                        return [4, (0, utils_1.getWalletsByType)(context, stakingWalletType.walletTypesID)];
                    case 33:
                        stakingWallets = _m.sent();
                        walletsSummary.wallets.Staking.totalWallets = stakingWallets.length;
                        stakingWalletArr = [];
                        if (!(stakingWallets === null || stakingWallets === void 0 ? void 0 : stakingWallets.length)) return [3, 45];
                        _g = 0, stakingWallets_1 = stakingWallets;
                        _m.label = 34;
                    case 34:
                        if (!(_g < stakingWallets_1.length)) return [3, 38];
                        stakingWallet = stakingWallets_1[_g];
                        stakingWalletArr.push(stakingWallet.walletsID);
                        return [4, (0, utils_1.getStakingWalletAssets)(context, stakingWallet.walletsID, availableBalanceType.balanceTypeId)];
                    case 35:
                        assets = _m.sent();
                        return [4, (0, utils_1.getWalletAssetsTotalBalance)(assets)];
                    case 36:
                        balance = _m.sent();
                        wallet = {
                            walletId: stakingWallet.walletsID,
                            nickname: stakingWallet.walletName,
                            type: stakingWallet.walletTypes.name,
                            assets: assets,
                            balance: balance,
                            pendingRewards: '0',
                            totalBalance: balance,
                        };
                        walletsSummary.staking.push(wallet);
                        _m.label = 37;
                    case 37:
                        _g++;
                        return [3, 34];
                    case 38: return [4, (0, utils_1.getStakingWalletsAssets)(context, stakingWalletArr, availableBalanceType.balanceTypeId)];
                    case 39:
                        stakingWalletsAssets = _m.sent();
                        if (!(stakingWalletsAssets === null || stakingWalletsAssets === void 0 ? void 0 : stakingWalletsAssets.length)) return [3, 45];
                        _h = 0, stakingWalletsAssets_1 = stakingWalletsAssets;
                        _m.label = 40;
                    case 40:
                        if (!(_h < stakingWalletsAssets_1.length)) return [3, 43];
                        stakingWalletsAsset = stakingWalletsAssets_1[_h];
                        ticker = stakingWalletsAsset.assets.type === 'crypto'
                            ? stakingWalletsAsset.assets.fireblocksTicker
                            : stakingWalletsAsset.assets.ticker;
                        return [4, (0, utils_1.getCoinMarketInfo)(context, ticker)];
                    case 41:
                        marketInfo = _m.sent();
                        walletAsset = {
                            walletAssetsID: stakingWalletsAsset.walletAssetsID,
                            balance: stakingWalletsAsset.balance,
                            assets: {
                                id: stakingWalletsAsset.assets.id,
                                name: stakingWalletsAsset.assets.name,
                                ticker: stakingWalletsAsset.assets.ticker,
                                fireblocksTicker: stakingWalletsAsset.assets.fireblocksTicker,
                                type: stakingWalletsAsset.assets.type,
                            },
                            assetBalanceType: {
                                balanceTypeName: stakingWalletsAsset.assetBalanceType.balanceTypeName,
                            },
                            usdPrice: marketInfo ? marketInfo.current_price : null,
                            price: marketInfo
                                ? (0, FixedNumberHelper_1.calNumbers)().mulFixedNumber(Number(marketInfo.current_price), Number(stakingWalletsAsset.balance))._value
                                : ticker === 'USD'
                                    ? stakingWalletsAsset.balance.toString()
                                    : null,
                            sevenDayPercChange: marketInfo
                                ? marketInfo.price_change_percentage_7d_in_currency
                                : null,
                        };
                        walletsSummary.wallets.Staking.assets.push(walletAsset);
                        _m.label = 42;
                    case 42:
                        _h++;
                        return [3, 40];
                    case 43:
                        _j = walletsSummary.wallets.Staking;
                        return [4, (0, utils_1.getWalletAssetsTotalBalance)(walletsSummary.wallets.Staking.assets)];
                    case 44:
                        _j.stakedBalance = _m.sent();
                        _m.label = 45;
                    case 45: return [4, (0, utils_1.getUserMembership)(context)];
                    case 46:
                        userMembership = _m.sent();
                        walletsSummary.wallets.Membership.membershipType =
                            ((_k = userMembership === null || userMembership === void 0 ? void 0 : userMembership.membershipPrograms) === null || _k === void 0 ? void 0 : _k.programName) || '';
                        if (userMembership) {
                            walletsSummary.membership.walletId = '';
                            walletsSummary.membership.nickname = '';
                            walletsSummary.membership.membershipType =
                                ((_l = userMembership === null || userMembership === void 0 ? void 0 : userMembership.membershipPrograms) === null || _l === void 0 ? void 0 : _l.programName) || '';
                        }
                        return [2, walletsSummary];
                    case 47:
                        err_2 = _m.sent();
                        context.yoga.logger.error(err_2);
                        return [2, Promise.reject(new index_1.GraphQLError(err_2.message))];
                    case 48: return [2];
                }
            });
        }); }),
        generateWalletSummary: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) {
            var walletId = _a.walletId;
            return __awaiter(void 0, void 0, void 0, function () {
                var walletSummary, wallet, availableBalanceType, _b, _c, transactionalbalance, _d, loanRecord, collateralBalance, _e, stakingBalance, err_3;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _f.trys.push([0, 14, , 15]);
                            walletSummary = new IGenerateWalletSummary_1.default();
                            return [4, (0, utils_1.getWalletByID)(context, walletId)];
                        case 1:
                            wallet = _f.sent();
                            return [4, (0, utils_1.getBalanceType)(context, 'Available')];
                        case 2:
                            availableBalanceType = _f.sent();
                            if (!wallet) return [3, 13];
                            _b = wallet.walletTypes.name;
                            switch (_b) {
                                case 'TRANSACTIONAL': return [3, 3];
                                case 'COLLATERAL': return [3, 6];
                                case 'STAKING': return [3, 10];
                            }
                            return [3, 13];
                        case 3:
                            walletSummary.wallet.walletId = wallet.walletsID;
                            walletSummary.wallet.nickname = wallet.walletName;
                            walletSummary.wallet.type = wallet.walletTypes.name;
                            _c = walletSummary.wallet;
                            return [4, (0, utils_1.getTransactionalWalletAssets)(context, wallet.walletsID, availableBalanceType.balanceTypeId)];
                        case 4:
                            _c.assets = _f.sent();
                            return [4, (0, utils_1.getWalletAssetsTotalBalance)(walletSummary.wallet.assets)];
                        case 5:
                            transactionalbalance = _f.sent();
                            walletSummary.wallet.balance = transactionalbalance;
                            walletSummary.wallet.pendingRewards = '0';
                            walletSummary.wallet.totalBalance = transactionalbalance;
                            return [3, 13];
                        case 6:
                            walletSummary.wallet.walletId = wallet.walletsID;
                            walletSummary.wallet.nickname = wallet.walletName;
                            walletSummary.wallet.type = wallet.walletTypes.name;
                            _d = walletSummary.wallet;
                            return [4, (0, utils_1.getCollateralWalletAssets)(context, wallet.walletsID, availableBalanceType.balanceTypeId)];
                        case 7:
                            _d.assets = _f.sent();
                            return [4, (0, utils_1.getCollateralWalletLoan)(context, wallet.walletsID)];
                        case 8:
                            loanRecord = _f.sent();
                            walletSummary.wallet.ltvFeePercentage = 0;
                            walletSummary.wallet.totalLoanAmount = loanRecord
                                ? loanRecord.currentBalance
                                : null;
                            walletSummary.wallet.paidOnLoanAmount = loanRecord
                                ? loanRecord.currentBalance
                                : null;
                            walletSummary.wallet.loanEndDate = loanRecord
                                ? new Date(loanRecord.expiringAt)
                                : null;
                            return [4, (0, utils_1.getWalletAssetsTotalBalance)(walletSummary.wallet.assets)];
                        case 9:
                            collateralBalance = _f.sent();
                            walletSummary.wallet.totalBalance = collateralBalance;
                            walletSummary.wallet.minimumPayment = null;
                            walletSummary.wallet.minimumPaymentDueDate = null;
                            walletSummary.wallet.outstandingPaymentBalance = null;
                            return [3, 13];
                        case 10:
                            walletSummary.wallet.walletId = wallet.walletsID;
                            walletSummary.wallet.nickname = wallet.walletName;
                            walletSummary.wallet.type = wallet.walletTypes.name;
                            _e = walletSummary.wallet;
                            return [4, (0, utils_1.getStakingWalletAssets)(context, wallet.walletsID, availableBalanceType.balanceTypeId)];
                        case 11:
                            _e.assets = _f.sent();
                            return [4, (0, utils_1.getWalletAssetsTotalBalance)(walletSummary.wallet.assets)];
                        case 12:
                            stakingBalance = _f.sent();
                            walletSummary.wallet.balance = stakingBalance;
                            walletSummary.wallet.pendingRewards = '0';
                            walletSummary.wallet.stakedBalance = 0;
                            walletSummary.wallet.availableRewards = 0;
                            walletSummary.wallet.paidRewards = 0;
                            walletSummary.wallet.totalBalance = stakingBalance;
                            return [3, 13];
                        case 13: return [2, walletSummary];
                        case 14:
                            err_3 = _f.sent();
                            context.yoga.logger.error(err_3);
                            return [2, Promise.reject(new index_1.GraphQLError(err_3.message))];
                        case 15: return [2];
                    }
                });
            });
        }),
        generateWalletAssetsSummary: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) {
            var walletId = _a.walletId, balanceType = _a.balanceType, limit = _a.limit, offset = _a.offset;
            return __awaiter(void 0, void 0, void 0, function () {
                var walletAssetsSummary, wallet, availableBalanceType, assets, _b, err_4;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 10, , 11]);
                            walletAssetsSummary = new IGenerateWalletAssetsSummary_1.default();
                            return [4, (0, utils_1.getWalletByID)(context, walletId)];
                        case 1:
                            wallet = _c.sent();
                            return [4, (0, utils_1.getBalanceType)(context, balanceType || 'Available')];
                        case 2:
                            availableBalanceType = _c.sent();
                            if (!wallet) return [3, 9];
                            assets = void 0;
                            _b = wallet.walletTypes.name;
                            switch (_b) {
                                case 'TRANSACTIONAL': return [3, 3];
                                case 'COLLATERAL': return [3, 5];
                                case 'STAKING': return [3, 7];
                            }
                            return [3, 9];
                        case 3: return [4, (0, utils_1.getTransactionalWalletAssets)(context, wallet.walletsID, availableBalanceType.balanceTypeId, limit, offset)];
                        case 4:
                            assets = _c.sent();
                            walletAssetsSummary.totalRecords = assets.length || 0;
                            walletAssetsSummary.assets = assets;
                            return [3, 9];
                        case 5: return [4, (0, utils_1.getCollateralWalletAssets)(context, wallet.walletsID, availableBalanceType.balanceTypeId, limit, offset)];
                        case 6:
                            assets = _c.sent();
                            walletAssetsSummary.totalRecords = assets.length || 0;
                            walletAssetsSummary.assets = assets;
                            return [3, 9];
                        case 7: return [4, (0, utils_1.getStakingWalletAssets)(context, wallet.walletsID, availableBalanceType.balanceTypeId, limit, offset)];
                        case 8:
                            assets = _c.sent();
                            walletAssetsSummary.totalRecords = assets.length || 0;
                            walletAssetsSummary.assets = assets;
                            return [3, 9];
                        case 9: return [2, walletAssetsSummary];
                        case 10:
                            err_4 = _c.sent();
                            context.yoga.logger.error(err_4);
                            return [2, Promise.reject(new index_1.GraphQLError(err_4.message))];
                        case 11: return [2];
                    }
                });
            });
        }),
        generateWalletTransactionsSummary: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) {
            var walletId = _a.walletId, limit = _a.limit, offset = _a.offset;
            return __awaiter(void 0, void 0, void 0, function () {
                var walletTransactionsSummary, wallet, transactions, err_5;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            walletTransactionsSummary = new IGenerateWalletTransactionsSummary_1.default();
                            return [4, (0, utils_1.getWalletByID)(context, walletId)];
                        case 1:
                            wallet = _b.sent();
                            if (!wallet) return [3, 3];
                            return [4, (0, utils_1.getWalletTransactions)(context, walletId, limit, offset)];
                        case 2:
                            transactions = _b.sent();
                            if (transactions) {
                                walletTransactionsSummary.totalRecords = transactions.length || 0;
                                walletTransactionsSummary.transactions = transactions;
                            }
                            _b.label = 3;
                        case 3: return [2, walletTransactionsSummary];
                        case 4:
                            err_5 = _b.sent();
                            context.yoga.logger.error(err_5);
                            return [2, Promise.reject(new index_1.GraphQLError(err_5.message))];
                        case 5: return [2];
                    }
                });
            });
        }),
        generateStakingAssetsSummary: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) {
            var walletId = _a.walletId, balanceType = _a.balanceType, limit = _a.limit, offset = _a.offset;
            return __awaiter(void 0, void 0, void 0, function () {
                var wallet, walletAssetsSummary, assetBalanceType, assets, err_6;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 5, , 6]);
                            return [4, (0, utils_1.getWalletByID)(context, walletId)];
                        case 1:
                            wallet = _b.sent();
                            if (!(wallet && wallet.walletTypes.name === 'STAKING')) return [3, 4];
                            walletAssetsSummary = new IGenerateStakingAssetsSummary_1.default();
                            return [4, (0, utils_1.getBalanceType)(context, balanceType)];
                        case 2:
                            assetBalanceType = _b.sent();
                            return [4, (0, utils_1.getStakingWalletAssets)(context, wallet.walletsID, assetBalanceType.balanceTypeId, limit, offset)];
                        case 3:
                            assets = _b.sent();
                            walletAssetsSummary.totalRecords = assets.length || 0;
                            walletAssetsSummary.assets = assets;
                            return [2, walletAssetsSummary];
                        case 4: return [2, Promise.reject(new index_1.GraphQLError('Invalid wallet'))];
                        case 5:
                            err_6 = _b.sent();
                            context.yoga.logger.error(err_6);
                            return [2, Promise.reject(new index_1.GraphQLError(err_6.message))];
                        case 6: return [2];
                    }
                });
            });
        }),
    },
    Mutation: {
        createUserWallet: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) {
            var walletTypeId = _a.walletTypeId, walletName = _a.walletName;
            return __awaiter(void 0, void 0, void 0, function () {
                var service, userWallet, err_7;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            service = tsyringe_1.container.resolve(CreateCustodyWalletService_1.default);
                            return [4, service.execute({
                                    userId: context.userId,
                                    walletTypeId: walletTypeId,
                                    walletName: walletName,
                                })];
                        case 1:
                            userWallet = _b.sent();
                            return [2, userWallet];
                        case 2:
                            err_7 = _b.sent();
                            context.yoga.logger.error(err_7);
                            return [2, Promise.reject(new index_1.GraphQLError(err_7.message))];
                        case 3: return [2];
                    }
                });
            });
        }),
        createWalletAsset: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) {
            var walletId = _a.walletId, assetId = _a.assetId;
            return __awaiter(void 0, void 0, void 0, function () {
                var service, userWallet, err_8;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            service = tsyringe_1.container.resolve(CreateCustodyWalletAssetsService_1.default);
                            return [4, service.execute({
                                    userId: context.userId,
                                    walletId: walletId,
                                    assetId: assetId,
                                })];
                        case 1:
                            userWallet = _b.sent();
                            return [2, userWallet];
                        case 2:
                            err_8 = _b.sent();
                            context.yoga.logger.error(err_8);
                            return [2, Promise.reject(new index_1.GraphQLError(err_8.message))];
                        case 3: return [2];
                    }
                });
            });
        }),
        stakingBalanceUpdate: composable_resolver_1.compose.apply(void 0, auth_resolver_1.authResolvers)(function (parent, _a, context) {
            var sourceWalletId = _a.sourceWalletId, targetWalletId = _a.targetWalletId, assetId = _a.assetId, balance = _a.balance, sourceBalanceType = _a.sourceBalanceType, type = _a.type;
            return __awaiter(void 0, void 0, void 0, function () {
                var walletAsset, _b, err_9;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 6, , 7]);
                            walletAsset = void 0;
                            _b = type;
                            switch (_b) {
                                case 'stake': return [3, 1];
                                case 'unstake': return [3, 3];
                            }
                            return [3, 5];
                        case 1: return [4, (0, utils_1.stakeAssetBalance)(context, sourceWalletId, targetWalletId, assetId, balance, sourceBalanceType)];
                        case 2:
                            walletAsset = _c.sent();
                            return [3, 5];
                        case 3: return [4, (0, utils_1.lockAssetBalance)(context, sourceWalletId, targetWalletId, assetId, balance, sourceBalanceType)];
                        case 4:
                            walletAsset = _c.sent();
                            return [3, 5];
                        case 5: return [2, walletAsset];
                        case 6:
                            err_9 = _c.sent();
                            context.yoga.logger.error(err_9);
                            return [2, Promise.reject(new index_1.GraphQLError(err_9.message))];
                        case 7: return [2];
                    }
                });
            });
        }),
    },
    WalletSummary: {
        __resolveType: function (obj) {
            if (obj.type === 'TRANSACTIONAL') {
                return 'TransactionalWallet';
            }
            if (obj.type === 'COLLATERAL') {
                return 'CollateralWallet';
            }
            if (obj.type === 'STAKING') {
                return 'StakingWallet';
            }
            return null;
        },
    },
};
//# sourceMappingURL=wallets.resolvers.js.map