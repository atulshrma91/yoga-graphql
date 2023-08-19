const priceFeedTypes = ` 
scalar Decimal

type PriceFeed{
  name: String
  currentPrice: Decimal
  symbol: String
  sevenDayPerChange: Decimal
  todayPerChange: Decimal
  lastUpdated: DateTime
}
`;

const priceFeedSubscriptions = `
getPriceFeed(ticker: String!): PriceFeed
`;

export { priceFeedTypes, priceFeedSubscriptions };
