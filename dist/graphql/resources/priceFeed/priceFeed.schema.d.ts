declare const priceFeedTypes = " \nscalar Decimal\n\ntype PriceFeed{\n  name: String\n  currentPrice: Decimal\n  symbol: String\n  sevenDayPerChange: Decimal\n  todayPerChange: Decimal\n  lastUpdated: DateTime\n}\n";
declare const priceFeedSubscriptions = "\ngetPriceFeed(ticker: String!): PriceFeed\n";
export { priceFeedTypes, priceFeedSubscriptions };
