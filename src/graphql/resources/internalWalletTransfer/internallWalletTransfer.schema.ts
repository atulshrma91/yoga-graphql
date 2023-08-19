const internalWalletTransfer = ` 
scalar Decimal

type internalWalletTransaction {
  assets_id: Int
  transactionID: String!
  userID: String!
  sourceWallet: String!
  targetWallet: String!
  parentTransactionID: String
  type: String
  transactionFees: String
  sourceBalanceType: Int!
  targetBalanceType: Int!
  assetQuantity: Decimal
  wallets_transactions_sourceWalletTowallets: Wallet,
  wallets_transactions_targetWalletTowallets: Wallet
}
`;

const internalWalletTransferQueries = `
getInternalWalletTransfer: internalWalletTransaction!
`;

const internalWalletTransferQueriesMutations = `
internalWalletTransfer( amount: Decimal!, sourceWallet: String!, targetWallet: String!,  sourceBalanceType: Int!,
  targetBalanceType: Int!, assets_id: Int!): internalWalletTransaction!

`;

export {
  internalWalletTransfer,
  internalWalletTransferQueries,
  internalWalletTransferQueriesMutations,
};
