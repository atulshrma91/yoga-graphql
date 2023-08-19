import { container } from "tsyringe";
import IWithdrawalRepository from "../../modules/withdrawal/repositories/IWithdrawalRepository";
import WithdrawalRepository from "../../modules/withdrawal/repositories/WithdrawalRepository";
import IWalletRepository from "../../modules/wallets/repositories/IWalletRepository";
import WalletRepository from "../../modules/wallets/repositories/WalletRepository";
import FireblocksRepository from "../../modules/fireblocksApi/repositories/FireblocksRepository";
import IFireblocksRepository from "../../modules/fireblocksApi/repositories/IFireblocksRepository";

container.registerSingleton<IWithdrawalRepository>(
  "WithdrawalRepository",
  WithdrawalRepository
);
container.registerSingleton<IWalletRepository>(
  "WalletRepository",
  WalletRepository
);
container.registerSingleton<IFireblocksRepository>(
  "FireblocksRepository",
  FireblocksRepository
);
