"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefinitions = void 0;
var lodash_1 = require("lodash");
require("reflect-metadata");
var schema_1 = require("@graphql-tools/schema");
var internallWalletTransfer_schema_1 = require("../internalWalletTransfer/internallWalletTransfer.schema");
var internalWalletTransfer_resolver_1 = require("../internalWalletTransfer/internalWalletTransfer.resolver");
var membershipProduct_resolvers_1 = require("../membershipProduct/membershipProduct.resolvers");
var membershipProduct_schema_1 = require("../membershipProduct/membershipProduct.schema");
var priceFeed_resolver_1 = require("../priceFeed/priceFeed.resolver");
var priceFeed_schema_1 = require("../priceFeed/priceFeed.schema");
var quotes_resolvers_1 = require("../quotes/quotes.resolvers");
var quotes_schema_1 = require("../quotes/quotes.schema");
var users_resolvers_1 = require("../users/users.resolvers");
var users_schema_1 = require("../users/users.schema");
var wallets_resolvers_1 = require("../wallets/wallets.resolvers");
var wallets_schema_1 = require("../wallets/wallets.schema");
var withdrawal_resolvers_1 = require("../withdrawal/withdrawal.resolvers");
var withdrawal_schema_1 = require("../withdrawal/withdrawal.schema");
var mutation_1 = require("./mutation");
var query_1 = require("./query");
var subscription_1 = require("./subscription");
var resolvers = (0, lodash_1.merge)(users_resolvers_1.userResolvers, wallets_resolvers_1.walletResolvers, quotes_resolvers_1.quotesResolvers, withdrawal_resolvers_1.withdrawalResolvers, internalWalletTransfer_resolver_1.internalWalletTransferResolver, membershipProduct_resolvers_1.membershipProductResolver, priceFeed_resolver_1.priceFeedResolver);
var typeDefinitions = [
    query_1.Query,
    mutation_1.Mutation,
    subscription_1.Subscription,
    users_schema_1.userTypes,
    wallets_schema_1.walletTypes,
    quotes_schema_1.quoteTypes,
    withdrawal_schema_1.withdrawalTypes,
    internallWalletTransfer_schema_1.internalWalletTransfer,
    membershipProduct_schema_1.membershipProductTypes,
    priceFeed_schema_1.priceFeedTypes,
];
exports.typeDefinitions = typeDefinitions;
exports.default = (0, schema_1.makeExecutableSchema)({
    typeDefs: typeDefinitions,
    resolvers: resolvers,
});
//# sourceMappingURL=index.js.map