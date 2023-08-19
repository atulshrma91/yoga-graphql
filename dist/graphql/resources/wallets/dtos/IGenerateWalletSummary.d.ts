import { GenerateWalletSummary, TransactionalWallet, CollateralWallet, StakingWallet } from "../../../../types";
export default class IGenerateWalletSummary implements GenerateWalletSummary {
    wallet?: TransactionalWallet | CollateralWallet | StakingWallet;
    constructor();
}
