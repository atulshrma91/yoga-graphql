import ICreateVault from '../dtos/ICreateVault';
import ICreateVaultAsset from '../dtos/ICreateVaultAsset';
import ICreateVaultAssetResponse from '../dtos/ICreateVaultAssetResponse';
import IUpdateVault from '../dtos/IUpdateVault';
import IFireblocksRepository from './IFireblocksRepository';
declare class FireblocksRepository implements IFireblocksRepository {
    private fireblocksApi;
    constructor();
    createVault({ uuid, name }: ICreateVault): Promise<any>;
    updateVault({ vaultId, name }: IUpdateVault): Promise<void>;
    createVaultAsset({ assetId, vaultAccountId, }: ICreateVaultAsset): Promise<ICreateVaultAssetResponse>;
}
export default FireblocksRepository;
