import {
  GenerateWalletsSummary,
  WalletsSummary,
  TransactionalWallet,
  CollateralWallet,
  StakingWallet,
  MembershipWallet,
} from "../../../../types";

export default class IGenerateWalletsSummary implements GenerateWalletsSummary {
  currencySymbol: string;
  wallets: WalletsSummary;
  transactional: Array<TransactionalWallet>;
  collateral: Array<CollateralWallet>;
  staking: Array<StakingWallet>;
  membership: MembershipWallet;

  constructor() {
    this.currencySymbol = "";
    this.wallets = {
      Transactional: {
        totalBalance: "0",
        totalWallets: 0,
        assets: [],
      },
      Collateral: {
        totalBalance: "0",
        totalWallets: 0,
        assets: [],
      },
      Staking: {
        stakedBalance: "0",
        totalWallets: 0,
        assets: [],
      },
      Membership: {
        membershipType: "",
        fiatCnfiPrice: "",
        committedCnfi: "",
      },
    };
    this.transactional = [] as Array<TransactionalWallet>;
    this.collateral = [] as Array<CollateralWallet>;
    this.staking = [] as Array<StakingWallet>;
    this.membership = {
      walletId: "",
      nickname: "",
      membershipType: "",
    };
  }
}
