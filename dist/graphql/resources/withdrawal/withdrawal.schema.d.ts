declare const withdrawalTypes = "  \ntype EstimateWithdrawalTransferFees{\n  ticker: String!\n  networkFeeUsd: String\n  networkFee: String\n}\n";
declare const withdrawalQueries = "\n  estimateWithdrawalTransferFees(amount: Float!, destination: String!, walletAssetId: String!): EstimateWithdrawalTransferFees\n";
declare const withdrawalMutations = "";
export { withdrawalTypes, withdrawalQueries, withdrawalMutations };
