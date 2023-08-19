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
var FireblocksRepository = (function () {
    function FireblocksRepository() {
        Object.defineProperty(this, "fireblocksApi", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        var yoga = YogaComponentsSingleton_1.default.getInstance().yoga;
        var clients = yoga.clients, secretManager = yoga.secretManager;
        var apiKey = secretManager.get('FIREBLOCKS_INTERNAL_API_KEY');
        var client = clients.FIREBLOCKS_API_SERVICE;
        client.addHeader('FIREBLOCKS_INTERNAL_API_KEY', apiKey);
        this.fireblocksApi = client;
    }
    Object.defineProperty(FireblocksRepository.prototype, "createVault", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_a) {
            var uuid = _a.uuid, name = _a.name;
            return __awaiter(this, void 0, void 0, function () {
                var vaultAccount, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4, this.fireblocksApi.post('/createVault', {
                                    name: "".concat(uuid),
                                    hiddenOnUI: true,
                                    uuid: uuid,
                                    autoFuel: true,
                                })];
                        case 1:
                            vaultAccount = (_b.sent()).data.data;
                            return [2, vaultAccount];
                        case 2:
                            e_1 = _b.sent();
                            if (e_1 instanceof AppError_1.default) {
                                throw new AppError_1.default(e_1.message, e_1.statusCode);
                            }
                            throw new AppError_1.default('Could not create vault! Error code 400', 400);
                        case 3: return [2];
                    }
                });
            });
        }
    });
    Object.defineProperty(FireblocksRepository.prototype, "updateVault", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_a) {
            var vaultId = _a.vaultId, name = _a.name;
            return __awaiter(this, void 0, void 0, function () {
                var e_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4, this.fireblocksApi.post('/updateVault', {
                                    vaultId: vaultId,
                                    name: name,
                                })];
                        case 1:
                            _b.sent();
                            return [3, 3];
                        case 2:
                            e_2 = _b.sent();
                            if (e_2 instanceof AppError_1.default) {
                                throw new AppError_1.default(e_2.message, e_2.statusCode);
                            }
                            throw new AppError_1.default('Could not update vault!', 400);
                        case 3: return [2];
                    }
                });
            });
        }
    });
    Object.defineProperty(FireblocksRepository.prototype, "createVaultAsset", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (_a) {
            var assetId = _a.assetId, vaultAccountId = _a.vaultAccountId;
            return __awaiter(this, void 0, void 0, function () {
                var vaultAsset, e_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4, this.fireblocksApi.post('/createVaultAsset', {
                                    assetId: assetId,
                                    vaultAccountId: vaultAccountId,
                                })];
                        case 1:
                            vaultAsset = (_b.sent()).data.data;
                            return [2, vaultAsset];
                        case 2:
                            e_3 = _b.sent();
                            if (e_3 instanceof AppError_1.default) {
                                throw new AppError_1.default(e_3.message, e_3.statusCode);
                            }
                            throw new AppError_1.default('Could not create vault asset!', 400);
                        case 3: return [2];
                    }
                });
            });
        }
    });
    return FireblocksRepository;
}());
exports.default = FireblocksRepository;
//# sourceMappingURL=FireblocksRepository.js.map