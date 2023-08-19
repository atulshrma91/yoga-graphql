"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var tsyringe_1 = require("tsyringe");
var AppError_1 = __importDefault(require("../../../shared/errors/AppError"));
var CreateCustodyWalletAssetsService = (function () {
    function CreateCustodyWalletAssetsService(walletRepository, fireblocksApi) {
        Object.defineProperty(this, "walletRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: walletRepository
        });
        Object.defineProperty(this, "fireblocksApi", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: fireblocksApi
        });
    }
    Object.defineProperty(CreateCustodyWalletAssetsService.prototype, "execute", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j, _k;
            var userId = _a.userId, walletId = _a.walletId, assetId = _a.assetId;
            return __awaiter(this, void 0, void 0, function () {
                var custodyWallet, cryptoAsset, createVaultAsset, depositAddress, e_1;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            _l.trys.push([0, 5, , 6]);
                            if (!userId) {
                                throw new AppError_1.default("Missing parameter user id!");
                            }
                            if (!walletId) {
                                throw new AppError_1.default("Missing parameter wallet id!");
                            }
                            if (!assetId) {
                                throw new AppError_1.default("Missing parameter asset id!");
                            }
                            return [4, this.walletRepository.findCustodyWallet(walletId)];
                        case 1:
                            custodyWallet = _l.sent();
                            if (!((_c = (_b = custodyWallet === null || custodyWallet === void 0 ? void 0 : custodyWallet.walletCustodyVault) === null || _b === void 0 ? void 0 : _b.custodyVault) === null || _c === void 0 ? void 0 : _c.custodyVaultFireblocksID)) {
                                throw new AppError_1.default("Vault not found!");
                            }
                            if (((_d = custodyWallet === null || custodyWallet === void 0 ? void 0 : custodyWallet.walletAssets) === null || _d === void 0 ? void 0 : _d.length) > 0) {
                                throw new AppError_1.default("You can't add same asset multiple times");
                            }
                            return [4, this.walletRepository.findCryptoAssetByAssetId(assetId)];
                        case 2:
                            cryptoAsset = _l.sent();
                            if (!((_e = cryptoAsset === null || cryptoAsset === void 0 ? void 0 : cryptoAsset.custodyAssets) === null || _e === void 0 ? void 0 : _e.theirId)) {
                                throw new AppError_1.default("Asset not found!");
                            }
                            return [4, this.fireblocksApi.createVaultAsset({
                                    vaultAccountId: (_g = (_f = custodyWallet === null || custodyWallet === void 0 ? void 0 : custodyWallet.walletCustodyVault) === null || _f === void 0 ? void 0 : _f.custodyVault) === null || _g === void 0 ? void 0 : _g.custodyVaultFireblocksID,
                                    assetId: cryptoAsset.custodyAssets.theirId,
                                })];
                        case 3:
                            createVaultAsset = _l.sent();
                            if (!createVaultAsset) {
                                throw new AppError_1.default("Could not create wallet vault asset!");
                            }
                            return [4, this.walletRepository.createUserWalletAsset({
                                    userId: userId,
                                    walletId: walletId,
                                    assetId: assetId,
                                    custodyVaultID: (_j = (_h = custodyWallet === null || custodyWallet === void 0 ? void 0 : custodyWallet.walletCustodyVault) === null || _h === void 0 ? void 0 : _h.custodyVault) === null || _j === void 0 ? void 0 : _j.custodyVaultID,
                                    address: createVaultAsset.address,
                                    tag: (_k = createVaultAsset === null || createVaultAsset === void 0 ? void 0 : createVaultAsset.tag) !== null && _k !== void 0 ? _k : "",
                                })];
                        case 4:
                            depositAddress = _l.sent();
                            if (!depositAddress) {
                                throw new AppError_1.default("Could not create wallet assets!");
                            }
                            return [2, {
                                    id: depositAddress.walletAssetsID,
                                    walletId: walletId,
                                    assetId: assetId,
                                    availableBalance: depositAddress.balance,
                                    depositAddress: createVaultAsset.address,
                                    tag: createVaultAsset.tag,
                                }];
                        case 5:
                            e_1 = _l.sent();
                            if (e_1 instanceof AppError_1.default) {
                                throw new AppError_1.default(e_1.message, e_1.statusCode);
                            }
                            throw new AppError_1.default("Could not create wallet assets!", 400);
                        case 6: return [2];
                    }
                });
            });
        }
    });
    CreateCustodyWalletAssetsService = __decorate([
        (0, tsyringe_1.injectable)(),
        __param(0, (0, tsyringe_1.inject)("WalletRepository")),
        __param(1, (0, tsyringe_1.inject)("FireblocksRepository")),
        __metadata("design:paramtypes", [Object, Object])
    ], CreateCustodyWalletAssetsService);
    return CreateCustodyWalletAssetsService;
}());
exports.default = CreateCustodyWalletAssetsService;
//# sourceMappingURL=CreateCustodyWalletAssetsService.js.map