"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
var users_schema_1 = require("../users/users.schema");
var wallets_schema_1 = require("../wallets/wallets.schema");
var quotes_schema_1 = require("../quotes/quotes.schema");
var withdrawal_schema_1 = require("../withdrawal/withdrawal.schema");
var internallWalletTransfer_schema_1 = require("../internalWalletTransfer/internallWalletTransfer.schema");
var Mutation = "\n    type Mutation {\n        ".concat(users_schema_1.userMutations, " \n        ").concat(wallets_schema_1.walletMutations, " \n        ").concat(quotes_schema_1.quoteMutations, "\n        ").concat(withdrawal_schema_1.withdrawalMutations, "\n        ").concat(internallWalletTransfer_schema_1.internalWalletTransferQueriesMutations, "\n    }\n");
exports.Mutation = Mutation;
//# sourceMappingURL=mutation.js.map