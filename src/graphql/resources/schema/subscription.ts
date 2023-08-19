import { quoteSubscription } from "../quotes/quotes.schema";
import { priceFeedSubscriptions } from "../priceFeed/priceFeed.schema";

const Subscription = `
    type Subscription { 
      ${quoteSubscription}
      ${priceFeedSubscriptions}
    }
`;

export { Subscription };
