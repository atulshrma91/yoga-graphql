import IWithdrawalRepository from "../repositories/IWithdrawalRepository";
interface IRequest {
    amount: number;
    destination: string;
    walletAssetId: string;
}
declare class EstimateWithdrawalTransferFeesService {
    private withdrawalRepository;
    constructor(withdrawalRepository: IWithdrawalRepository);
    execute({ amount, destination, walletAssetId, }: IRequest): Promise<any>;
}
export default EstimateWithdrawalTransferFeesService;
