"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceFeedSubscriptions = exports.priceFeedTypes = void 0;
var priceFeedTypes = " \nscalar Decimal\n\ntype PriceFeed{\n  name: String\n  currentPrice: Decimal\n  symbol: String\n  sevenDayPerChange: Decimal\n  todayPerChange: Decimal\n  lastUpdated: DateTime\n}\n";
exports.priceFeedTypes = priceFeedTypes;
var priceFeedSubscriptions = "\ngetPriceFeed(ticker: String!): PriceFeed\n";
exports.priceFeedSubscriptions = priceFeedSubscriptions;
//# sourceMappingURL=priceFeed.schema.js.map