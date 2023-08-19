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
var AppError_1 = __importDefault(require("../../../shared/errors/AppError"));
var YogaComponentsSingleton_1 = __importDefault(require("../../../shared/utils/YogaComponentsSingleton"));
var Uuid_1 = require("../../../shared/utils/Uuid");
var uuid_1 = require("uuid");
var WalletRepository = (function () {
    function WalletRepository() {
        Object.defineProperty(this, "prismaClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "logger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        var _a = YogaComponentsSingleton_1.default.getInstance().yoga, prisma = _a.prisma, logger = _a.logger;
        this.prismaClient = prisma;
        this.logger = logger;
    }
    Object.defineProperty(WalletRepository.prototype, "getDepositAddressByWalletAndAsset", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (depositAddress) {
            return __awaiter(this, void 0, void 0, function () {
                var walletAssets, walletId, assetId, userId, assets, depositAddresses, _i, assets_1, asset, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            walletAssets = this.prismaClient.walletAssets;
                            walletId = depositAddress.walletId, assetId = depositAddress.assetId, userId = depositAddress.userId;
                            return [4, walletAssets.findMany({
                                    select: {
                                        assetsId: true,
                                        wallets: {
                                            select: {
                                                walletsID: true,
                                                users: {
                                                    select: {
                                                        userId: true,
                                                        firebaseUID: true,
                                                    },
                                                },
                                            },
                                        },
                                        assets: {
                                            select: {
                                                depositAddress: {
                                                    select: {
                                                        depositAddress: true,
                                                        tag: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    where: {
                                        walletId: walletId,
                                        assetsId: assetId,
                                        wallets: { userId: userId },
                                    },
                                })];
                        case 1:
                            assets = _a.sent();
                            depositAddresses = [];
                            for (_i = 0, assets_1 = assets; _i < assets_1.length; _i++) {
                                asset = assets_1[_i];
                                console.log(asset);
                            }
                            return [2, depositAddresses];
                        case 2:
                            e_1 = _a.sent();
                            throw new Error("Could not fetch deposit addresses");
                        case 3: return [2];
                    }
                });
            });
        }
    });
    Object.defineProperty(WalletRepository.prototype, "createUserWallet", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_a) {
            var userId = _a.userId, walletTypeId = _a.walletTypeId, walletName = _a.walletName;
            return __awaiter(this, void 0, void 0, function () {
                var _b, wallets, walletTypes, walletType, e_2;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 3, , 4]);
                            _b = this.prismaClient, wallets = _b.wallets, walletTypes = _b.walletTypes;
                            return [4, walletTypes.findFirst({
                                    where: {
                                        walletTypesID: walletTypeId,
                                    },
                                })];
                        case 1:
                            walletType = _c.sent();
                            if (!walletType) {
                                throw new AppError_1.default("Could not create wallet type");
                            }
                            return [4, wallets.create({
                                    data: {
                                        userId: userId,
                                        walletTypeId: walletTypeId,
                                        walletName: walletName,
                                    },
                                })];
                        case 2: return [2, _c.sent()];
                        case 3:
                            e_2 = _c.sent();
                            throw new AppError_1.default("Could not create wallet");
                        case 4: return [2];
                    }
                });
            });
        }
    });
    Object.defineProperty(WalletRepository.prototype, "findWalletByNameAndUserId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_a) {
            var userId = _a.userId, walletName = _a.walletName;
            return __awaiter(this, void 0, void 0, function () {
                var e_3, message;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4, this.prismaClient.wallets.findFirst({
                                    where: {
                                        userId: userId,
                                        walletName: walletName,
                                    },
                                })];
                        case 1: return [2, _b.sent()];
                        case 2:
                            e_3 = _b.sent();
                            message = "Could not find wallet by name and userId.";
                            this.logger.error(e_3, message);
                            throw new AppError_1.default(message);
                        case 3: return [2];
                    }
                });
            });
        }
    });
    Object.defineProperty(WalletRepository.prototype, "createCustodyWallet", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_a) {
            var userId = _a.userId, walletTypeId = _a.walletTypeId, walletName = _a.walletName, customerRefId = _a.customerRefId, vaultId = _a.vaultId;
            return __awaiter(this, void 0, void 0, function () {
                var message;
                var _this = this;
                return __generator(this, function (_b) {
                    try {
                        return [2, this.prismaClient.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var wallets, walletTypes, walletCustodyVault, custodyVault, walletType, wallet, custodyVaultID;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            wallets = tx.wallets, walletTypes = tx.walletTypes, walletCustodyVault = tx.walletCustodyVault, custodyVault = tx.custodyVault;
                                            return [4, walletTypes.findFirst({
                                                    where: {
                                                        walletTypesID: walletTypeId,
                                                    },
                                                })];
                                        case 1:
                                            walletType = _a.sent();
                                            if (!walletType) {
                                                throw new AppError_1.default("Could not create wallet type");
                                            }
                                            return [4, wallets.create({
                                                    data: {
                                                        userId: userId,
                                                        walletTypeId: walletTypeId,
                                                        walletName: walletName,
                                                    },
                                                })];
                                        case 2:
                                            wallet = _a.sent();
                                            custodyVaultID = (0, Uuid_1.uuidv4)();
                                            return [4, walletCustodyVault.create({
                                                    data: {
                                                        custodyVaultID: custodyVaultID,
                                                        walletID: wallet.walletsID,
                                                    },
                                                })];
                                        case 3:
                                            _a.sent();
                                            return [4, custodyVault.create({
                                                    data: {
                                                        custodyVaultID: custodyVaultID,
                                                        custodyVaultReference: customerRefId,
                                                        custodyVaultFireblocksID: vaultId,
                                                    },
                                                })];
                                        case 4:
                                            _a.sent();
                                            return [2, wallet];
                                    }
                                });
                            }); })];
                    }
                    catch (e) {
                        message = "Could not create wallet!";
                        this.logger.error(e, message);
                        if (e instanceof AppError_1.default) {
                            throw new AppError_1.default(e.message, e.statusCode);
                        }
                        throw new AppError_1.default(message, 400);
                    }
                    return [2];
                });
            });
        }
    });
    Object.defineProperty(WalletRepository.prototype, "createWalletAsset", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_a) {
            var walletId = _a.walletId, assetId = _a.assetId;
            return __awaiter(this, void 0, void 0, function () {
                var balanceType, e_4, message;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4, this.prismaClient.assetBalanceType.findFirst({
                                    where: {
                                        balanceTypeName: "Available",
                                    },
                                })];
                        case 1:
                            balanceType = _b.sent();
                            return [2, this.prismaClient.walletAssets.create({
                                    data: {
                                        walletAssetsID: (0, uuid_1.v5)(assetId + "-" + balanceType.balanceTypeId, walletId),
                                        walletId: walletId,
                                        assetsId: assetId,
                                        balance: 0,
                                        balanceType: balanceType.balanceTypeId,
                                    },
                                })];
                        case 2:
                            e_4 = _b.sent();
                            message = "Could not create wallet assets!";
                            this.logger.error(e_4, message);
                            if (e_4 instanceof AppError_1.default) {
                                throw new AppError_1.default(e_4.message, e_4.statusCode);
                            }
                            throw new AppError_1.default(message, 400);
                        case 3: return [2];
                    }
                });
            });
        }
    });
    Object.defineProperty(WalletRepository.prototype, "findCustodyWallet", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (walletId) {
            return __awaiter(this, void 0, void 0, function () {
                var message;
                return __generator(this, function (_a) {
                    try {
                        return [2, this.prismaClient.wallets.findFirst({
                                where: {
                                    walletsID: walletId,
                                },
                                select: {
                                    walletsID: true,
                                    userId: true,
                                    walletTypeId: true,
                                    walletAssets: true,
                                    walletCustodyVault: {
                                        select: {
                                            custodyVault: true,
                                        },
                                    },
                                },
                            })];
                    }
                    catch (e) {
                        message = "Could not find wallet!";
                        this.logger.error(e, message);
                        if (e instanceof AppError_1.default) {
                            throw new AppError_1.default(e.message, e.statusCode);
                        }
                        throw new AppError_1.default(message, 400);
                    }
                    return [2];
                });
            });
        }
    });
    Object.defineProperty(WalletRepository.prototype, "findCryptoAssetByAssetId", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (assetId) {
            return __awaiter(this, void 0, void 0, function () {
                var message;
                return __generator(this, function (_a) {
                    try {
                        return [2, this.prismaClient.institutional_cryptoAssets.findFirst({
                                where: {
                                    id: assetId,
                                },
                                select: {
                                    id: true,
                                    name: true,
                                    theirId: true,
                                    contractAddress: true,
                                    decimals: true,
                                    assetId: true,
                                    createdAt: true,
                                    updatedAt: true,
                                    custodyAssets: true,
                                },
                            })];
                    }
                    catch (e) {
                        message = "Could not find crypto assets!";
                        this.logger.error(e, message);
                        if (e instanceof AppError_1.default) {
                            throw new AppError_1.default(e.message, e.statusCode);
                        }
                        throw new AppError_1.default(message, 400);
                    }
                    return [2];
                });
            });
        }
    });
    Object.defineProperty(WalletRepository.prototype, "createUserWalletAsset", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_a) {
            var userId = _a.userId, walletId = _a.walletId, assetId = _a.assetId, custodyVaultID = _a.custodyVaultID, address = _a.address, tag = _a.tag;
            return __awaiter(this, void 0, void 0, function () {
                var message;
                var _this = this;
                return __generator(this, function (_b) {
                    try {
                        return [2, this.prismaClient.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var wallets, walletAssets, assets, vaultDepositAddresses, depositAddress, assetBalanceType, asset, wallet, walletAsset, balanceType, createdWalletAsset, createdDepositAddress;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            wallets = tx.wallets, walletAssets = tx.walletAssets, assets = tx.institutional_assets, vaultDepositAddresses = tx.vaultDepositAddresses, depositAddress = tx.depositAddress, assetBalanceType = tx.assetBalanceType;
                                            return [4, assets.findFirst({
                                                    where: {
                                                        id: assetId,
                                                    },
                                                })];
                                        case 1:
                                            asset = _a.sent();
                                            if (!asset) {
                                                throw new AppError_1.default("Could not find asset!");
                                            }
                                            return [4, wallets.findFirst({
                                                    where: {
                                                        userId: userId,
                                                        walletsID: walletId,
                                                    },
                                                })];
                                        case 2:
                                            wallet = _a.sent();
                                            if (!wallet) {
                                                throw new AppError_1.default("Could not find wallet!");
                                            }
                                            return [4, walletAssets.findFirst({
                                                    where: {
                                                        walletId: walletId,
                                                        assetsId: assetId,
                                                    },
                                                })];
                                        case 3:
                                            walletAsset = _a.sent();
                                            if (walletAsset) {
                                                throw new AppError_1.default("You can't add same asset multiple times");
                                            }
                                            return [4, assetBalanceType.findFirst({
                                                    where: {
                                                        balanceTypeName: "Available",
                                                    },
                                                })];
                                        case 4:
                                            balanceType = _a.sent();
                                            return [4, walletAssets.create({
                                                    data: {
                                                        walletAssetsID: (0, uuid_1.v5)(assetId + "-" + balanceType.balanceTypeId, walletId),
                                                        walletId: walletId,
                                                        assetsId: assetId,
                                                        balance: 0,
                                                        balanceType: balanceType === null || balanceType === void 0 ? void 0 : balanceType.balanceTypeId,
                                                    },
                                                })];
                                        case 5:
                                            createdWalletAsset = _a.sent();
                                            return [4, depositAddress.create({
                                                    data: {
                                                        depositAddress: address,
                                                        assets_id: assetId,
                                                        tag: tag,
                                                    },
                                                })];
                                        case 6:
                                            createdDepositAddress = _a.sent();
                                            return [4, vaultDepositAddresses.create({
                                                    data: {
                                                        custodyVaultID: custodyVaultID,
                                                        depositAddressID: createdDepositAddress.depositAddressID,
                                                    },
                                                })];
                                        case 7:
                                            _a.sent();
                                            return [2, createdWalletAsset];
                                    }
                                });
                            }); }, {
                                maxWait: 15000,
                                timeout: 20000,
                            })];
                    }
                    catch (e) {
                        message = "Could not create wallet assets!";
                        this.logger.error(e, message);
                        if (e instanceof AppError_1.default) {
                            throw new AppError_1.default(e.message, e.statusCode);
                        }
                        throw new AppError_1.default(message, 400);
                    }
                    return [2];
                });
            });
        }
    });
    return WalletRepository;
}());
exports.default = WalletRepository;
//# sourceMappingURL=WalletRepository.js.map