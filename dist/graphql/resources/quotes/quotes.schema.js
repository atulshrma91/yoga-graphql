"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteSubscription = exports.quoteMutations = exports.quoteQueries = exports.quoteTypes = void 0;
var quoteTypes = " \n  type TokenPair{\n    id: Int!\n    baseToken: String!\n    quoteToken: String!\n  }\n\n  type EligibleTradeAsset {\n    id: Int!\n    assets: Asset\n  }\n\n  type Quote {\n    quoteId: String!\n  }\n\n  type QuoteQueue {\n    id: String!,\n    side:  String!,\n    quantity:  String!,\n    spreadFee: String,\n    userQuotePrice:  String,\n    finalQuoteValue: String,\n    updatedAt:  DateTime!,\n    baseToken: String!,\n    quoteToken: String!\n  }\n\n  type Order {\n    orderId: String!\n  }\n\n  type OrderQueue {\n    id: String!,\n    orderStatus: String!\n    orderPriceExecuted: String\n    updatedAt: DateTime!\n    userAcceptedPrice: String!\n  }\n";
exports.quoteTypes = quoteTypes;
var quoteQueries = "\n  getTokenPairs: [EligibleTradeAsset]\n";
exports.quoteQueries = quoteQueries;
var quoteMutations = "\n  createQuote(baseToken: String!, quoteToken: String!, quantity: String!, source: String!, quantityToken: String!): Quote!\n  executeQuote(walletId: String!, quoteId: String!): Order!\n  getOrder(orderId: String!): OrderQueue!\n";
exports.quoteMutations = quoteMutations;
var quoteSubscription = "\n  getQuote(quoteId: String!): QuoteQueue!\n";
exports.quoteSubscription = quoteSubscription;
//# sourceMappingURL=quotes.schema.js.map