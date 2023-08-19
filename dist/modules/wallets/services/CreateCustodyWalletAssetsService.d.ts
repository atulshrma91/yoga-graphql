import IWalletRepository from "../repositories/IWalletRepository";
import IFireblocksRepository from "../../fireblocksApi/repositories/IFireblocksRepository";
interface IRequest {
    userId: string;
    walletId: string;
    assetId: number;
}
declare class CreateCustodyWalletAssetsService {
    private walletRepository;
    private fireblocksApi;
    constructor(walletRepository: IWalletRepository, fireblocksApi: IFireblocksRepository);
    execute({ userId, walletId, assetId }: IRequest): Promise<any>;
}
export default CreateCustodyWalletAssetsService;
