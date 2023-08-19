import IUserDepositAddressDTO from "../dtos/IUserDepositAddressDTO";
import IWalletDTO from "../dtos/IWalletDTO";
import { wallets, walletAssets, institutional_cryptoAssets } from "@connectfinancial/prisma-database";
import IFindWalletByNameAndUserIdDTO from "../dtos/IFindWalletByNameAndUserIdDTO";
import ICustodyWalletDTO from "../dtos/ICustodyWalletDTO";
import IWalletAssetDTO from "../dtos/IWalletAssetDTO";
import IFindCustodyWalletDTO from "../dtos/IFindCusdodyWalletDTO";
import ICreateDepositAddressesDTO from "../dtos/ICreateDepositAddressesDTO";
export default interface IWalletRepository {
    getDepositAddressByWalletAndAsset(depositAddress: IUserDepositAddressDTO): Promise<any>;
    createUserWallet(wallet: IWalletDTO): Promise<wallets | null>;
    findWalletByNameAndUserId(wallet: IFindWalletByNameAndUserIdDTO): Promise<wallets | null>;
    createCustodyWallet(wallet: ICustodyWalletDTO): Promise<wallets | null>;
    createWalletAsset(walletAsset: IWalletAssetDTO): Promise<walletAssets | null>;
    findCustodyWallet(walletId: string): Promise<IFindCustodyWalletDTO | null>;
    findCryptoAssetByAssetId(assetId: number): Promise<institutional_cryptoAssets | null>;
    createUserWalletAsset(depositAddress: ICreateDepositAddressesDTO): Promise<walletAssets | null>;
}
