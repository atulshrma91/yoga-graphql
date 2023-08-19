import IWalletRepository from "./IWalletRepository";
import { wallets, walletAssets, institutional_cryptoAssets } from "@connectfinancial/prisma-database";
import IUserDepositAddressDTO from "../dtos/IUserDepositAddressDTO";
import IWalletDTO from "../dtos/IWalletDTO";
import IFindWalletByNameAndUserIdDTO from "../dtos/IFindWalletByNameAndUserIdDTO";
import ICustodyWalletDTO from "../dtos/ICustodyWalletDTO";
import IWalletAssetDTO from "../dtos/IWalletAssetDTO";
import IFindCustodyWalletDTO from "../dtos/IFindCusdodyWalletDTO";
import ICreateDepositAddressesDTO from "../dtos/ICreateDepositAddressesDTO";
declare class WalletRepository implements IWalletRepository {
    private prismaClient;
    private logger;
    constructor();
    getDepositAddressByWalletAndAsset(depositAddress: IUserDepositAddressDTO): Promise<any>;
    createUserWallet({ userId, walletTypeId, walletName, }: IWalletDTO): Promise<wallets | null>;
    findWalletByNameAndUserId({ userId, walletName, }: IFindWalletByNameAndUserIdDTO): Promise<wallets | null>;
    createCustodyWallet({ userId, walletTypeId, walletName, customerRefId, vaultId, }: ICustodyWalletDTO): Promise<wallets | null>;
    createWalletAsset({ walletId, assetId, }: IWalletAssetDTO): Promise<walletAssets | null>;
    findCustodyWallet(walletId: string): Promise<IFindCustodyWalletDTO | null>;
    findCryptoAssetByAssetId(assetId: number): Promise<institutional_cryptoAssets | null>;
    createUserWalletAsset({ userId, walletId, assetId, custodyVaultID, address, tag, }: ICreateDepositAddressesDTO): Promise<walletAssets | null>;
}
export default WalletRepository;
