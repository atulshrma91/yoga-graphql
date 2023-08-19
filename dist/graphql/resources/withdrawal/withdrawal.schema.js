"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawalMutations = exports.withdrawalQueries = exports.withdrawalTypes = void 0;
var withdrawalTypes = "  \ntype EstimateWithdrawalTransferFees{\n  ticker: String!\n  networkFeeUsd: String\n  networkFee: String\n}\n";
exports.withdrawalTypes = withdrawalTypes;
var withdrawalQueries = "\n  estimateWithdrawalTransferFees(amount: Float!, destination: String!, walletAssetId: String!): EstimateWithdrawalTransferFees\n";
exports.withdrawalQueries = withdrawalQueries;
var withdrawalMutations = "";
exports.withdrawalMutations = withdrawalMutations;
//# sourceMappingURL=withdrawal.schema.js.map