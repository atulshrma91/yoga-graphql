"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tsyringe_1 = require("tsyringe");
var WithdrawalRepository_1 = __importDefault(require("../../modules/withdrawal/repositories/WithdrawalRepository"));
var WalletRepository_1 = __importDefault(require("../../modules/wallets/repositories/WalletRepository"));
var FireblocksRepository_1 = __importDefault(require("../../modules/fireblocksApi/repositories/FireblocksRepository"));
tsyringe_1.container.registerSingleton("WithdrawalRepository", WithdrawalRepository_1.default);
tsyringe_1.container.registerSingleton("WalletRepository", WalletRepository_1.default);
tsyringe_1.container.registerSingleton("FireblocksRepository", FireblocksRepository_1.default);
//# sourceMappingURL=index.js.map