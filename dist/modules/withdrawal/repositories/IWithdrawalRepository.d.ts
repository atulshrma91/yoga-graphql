import { IEstimateWithdrawalDTO } from "../dtos/IEstimateWithdrawalDTO";
export default interface IWithdrawalRepository {
    estimateWithdrawalTransferFees(estimateWithdrawal: IEstimateWithdrawalDTO): Promise<any>;
    withdrawalEligibleAssets(): Promise<any>;
    withdrawalEligibleWallets(): Promise<any>;
}
