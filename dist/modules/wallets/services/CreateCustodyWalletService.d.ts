import IWalletRepository from "../repositories/IWalletRepository";
import IFireblocksRepository from "../../fireblocksApi/repositories/IFireblocksRepository";
interface IRequest {
    userId: string;
    walletTypeId: number;
    walletName: string;
}
declare class CreateCustodyWalletService {
    private walletRepository;
    private fireblocksApi;
    constructor(walletRepository: IWalletRepository, fireblocksApi: IFireblocksRepository);
    execute({ userId, walletTypeId, walletName, }: IRequest): Promise<any>;
}
export default CreateCustodyWalletService;
