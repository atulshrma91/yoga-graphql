import IWithdrawalRepository from "./IWithdrawalRepository";
import { IEstimateWithdrawalDTO } from "../dtos/IEstimateWithdrawalDTO";
declare class WithdrawalRepository implements IWithdrawalRepository {
    private prismaClient;
    constructor();
    estimateWithdrawalTransferFees({ amount, destination, walletAssetId, }: IEstimateWithdrawalDTO): Promise<any>;
    withdrawalEligibleAssets(): Promise<any>;
    withdrawalEligibleWallets(): Promise<any>;
}
export default WithdrawalRepository;
