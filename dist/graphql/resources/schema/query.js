"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
var users_schema_1 = require("../users/users.schema");
var wallets_schema_1 = require("../wallets/wallets.schema");
var quotes_schema_1 = require("../quotes/quotes.schema");
var withdrawal_schema_1 = require("../withdrawal/withdrawal.schema");
var internallWalletTransfer_schema_1 = require("../internalWalletTransfer/internallWalletTransfer.schema");
var membershipProduct_schema_1 = require("../membershipProduct/membershipProduct.schema");
var Query = "\n    type Query {\n        ".concat(users_schema_1.userQueries, "\n        ").concat(wallets_schema_1.walletQueries, "\n        ").concat(quotes_schema_1.quoteQueries, "\n        ").concat(withdrawal_schema_1.withdrawalQueries, "\n        ").concat(internallWalletTransfer_schema_1.internalWalletTransferQueries, "\n        ").concat(membershipProduct_schema_1.membershipProductQueries, "\n    }\n");
exports.Query = Query;
//# sourceMappingURL=query.js.map