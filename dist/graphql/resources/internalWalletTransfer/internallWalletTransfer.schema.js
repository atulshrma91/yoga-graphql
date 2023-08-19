"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalWalletTransferQueriesMutations = exports.internalWalletTransferQueries = exports.internalWalletTransfer = void 0;
var internalWalletTransfer = " \nscalar Decimal\n\ntype internalWalletTransaction {\n  assets_id: Int\n  transactionID: String!\n  userID: String!\n  sourceWallet: String!\n  targetWallet: String!\n  parentTransactionID: String\n  type: String\n  transactionFees: String\n  sourceBalanceType: Int!\n  targetBalanceType: Int!\n  assetQuantity: Decimal\n  wallets_transactions_sourceWalletTowallets: Wallet,\n  wallets_transactions_targetWalletTowallets: Wallet\n}\n";
exports.internalWalletTransfer = internalWalletTransfer;
var internalWalletTransferQueries = "\ngetInternalWalletTransfer: internalWalletTransaction!\n";
exports.internalWalletTransferQueries = internalWalletTransferQueries;
var internalWalletTransferQueriesMutations = "\ninternalWalletTransfer( amount: Decimal!, sourceWallet: String!, targetWallet: String!,  sourceBalanceType: Int!,\n  targetBalanceType: Int!, assets_id: Int!): internalWalletTransaction!\n\n";
exports.internalWalletTransferQueriesMutations = internalWalletTransferQueriesMutations;
//# sourceMappingURL=internallWalletTransfer.schema.js.map