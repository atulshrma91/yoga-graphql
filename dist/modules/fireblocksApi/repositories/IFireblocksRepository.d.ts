import IUpdateVault from "../dtos/IUpdateVault";
import ICreateVault from "../dtos/ICreateVault";
import ICreateVaultAsset from "../dtos/ICreateVaultAsset";
import ICreateVaultAssetResponse from "../dtos/ICreateVaultAssetResponse";
export default interface IFireblocksRepository {
    createVault(vault: ICreateVault): Promise<any>;
    updateVault(vault: IUpdateVault): Promise<void>;
    createVaultAsset(vaultAsset: ICreateVaultAsset): Promise<ICreateVaultAssetResponse>;
}
