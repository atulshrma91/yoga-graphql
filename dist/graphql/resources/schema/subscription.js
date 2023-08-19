"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
var quotes_schema_1 = require("../quotes/quotes.schema");
var priceFeed_schema_1 = require("../priceFeed/priceFeed.schema");
var Subscription = "\n    type Subscription { \n      ".concat(quotes_schema_1.quoteSubscription, "\n      ").concat(priceFeed_schema_1.priceFeedSubscriptions, "\n    }\n");
exports.Subscription = Subscription;
//# sourceMappingURL=subscription.js.map