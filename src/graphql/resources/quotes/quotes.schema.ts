const quoteTypes = ` 
  type TokenPair{
    id: Int!
    baseToken: String!
    quoteToken: String!
  }

  type EligibleTradeAsset {
    id: Int!
    assets: Asset
  }

  type Quote {
    quoteId: String!
  }

  type QuoteQueue {
    id: String!,
    side:  String!,
    quantity:  String!,
    spreadFee: String,
    userQuotePrice:  String,
    finalQuoteValue: String,
    updatedAt:  DateTime!,
    baseToken: String!,
    quoteToken: String!
  }

  type Order {
    orderId: String!
  }

  type OrderQueue {
    id: String!,
    orderStatus: String!
    orderPriceExecuted: String
    updatedAt: DateTime!
    userAcceptedPrice: String!
  }
`;

const quoteQueries = `
  getTokenPairs: [EligibleTradeAsset]
`;

const quoteMutations = `
  createQuote(baseToken: String!, quoteToken: String!, quantity: String!, source: String!, quantityToken: String!): Quote!
  executeQuote(walletId: String!, quoteId: String!): Order!
  getOrder(orderId: String!): OrderQueue!
`;

const quoteSubscription = `
  getQuote(quoteId: String!): QuoteQueue!
`;

export { quoteTypes, quoteQueries, quoteMutations, quoteSubscription };
