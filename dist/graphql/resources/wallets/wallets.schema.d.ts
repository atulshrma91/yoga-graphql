declare const walletTypes: string;
declare const walletQueries = "\n  getEligibleWallets(asset: String, productID: String!): [Wallet]\n  generateWalletsSummary: GenerateWalletsSummary\n  generateWalletSummary(walletId: String!): GenerateWalletSummary\n  generateWalletAssetsSummary(walletId: String!, balanceType: String, offset: Int!, limit: Int!): GenerateWalletAssetsSummary\n  generateWalletTransactionsSummary(walletId: String!, offset: Int!, limit: Int!): GenerateWalletTransactionsSummary\n  generateStakingAssetsSummary(walletId: String!, balanceType: String!, offset: Int!, limit: Int!): GenerateStakingAssetsSummary\n";
declare const walletMutations = "\n  createUserWallet(walletTypeId: Int!, walletName: String!): Wallet\n  createWalletAsset(walletId: String!, assetId: Int!): CreateWalletAssetOutput\n  stakingBalanceUpdate(sourceWalletId: String!, targetWalletId: String!, assetId: Int!, balance: Decimal!,sourceBalanceType: String!, type: String!): walletAsset\n";
export { walletTypes, walletQueries, walletMutations };
