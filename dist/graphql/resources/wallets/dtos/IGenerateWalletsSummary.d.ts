import { GenerateWalletsSummary, WalletsSummary, TransactionalWallet, CollateralWallet, StakingWallet, MembershipWallet } from "../../../../types";
export default class IGenerateWalletsSummary implements GenerateWalletsSummary {
    currencySymbol: string;
    wallets: WalletsSummary;
    transactional: Array<TransactionalWallet>;
    collateral: Array<CollateralWallet>;
    staking: Array<StakingWallet>;
    membership: MembershipWallet;
    constructor();
}
