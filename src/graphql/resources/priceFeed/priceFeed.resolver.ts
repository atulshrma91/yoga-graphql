import { GraphQLContext } from "../../../context";
import { GraphQLError } from "graphql/index";
import { Repeater } from "graphql-yoga";
import { getCoinMarketInfo } from "../wallets/utils";

export const priceFeedResolver = {
  Subscription: {
    getPriceFeed: {
      subscribe: async (
        parent: unknown,
        args: { ticker: string },
        context: GraphQLContext
      ) => await getPriceFeed(args.ticker, context),
      resolve: async (priceFeed: unknown) => await resolvePriceFeed(priceFeed),
    },
  },
};

const getPriceFeed = async (ticker: string, context: GraphQLContext) => {
  if (context.currentUser === null) {
    return Promise.reject(new GraphQLError("Unauthorized"));
  }
  return getFeed(ticker, context);
};

const getFeed = async (ticker: string, context: GraphQLContext) => {
  return new Repeater(async (push, stop) => {
    async function priceFeed() {
      const marketInfo = await getCoinMarketInfo(context, ticker);
      if (marketInfo) {
        push(marketInfo);
      } else {
        push({
          name: null,
          currentPrice: null,
          symbol: null,
          sevenDayPerChange: null,
          todayPerChange: null,
          lastUpdated: null,
        });
      }
    }
    priceFeed();
    const interval = setInterval(priceFeed, 5000);
    stop.then(() => {
      clearInterval(interval);
    });
  });
};

const resolvePriceFeed = async (priceFeed: any) => {
  return {
    name: priceFeed.name,
    currentPrice: priceFeed.current_price,
    symbol: priceFeed.symbol,
    sevenDayPerChange: priceFeed.price_change_percentage_7d_in_currency,
    todayPerChange: priceFeed.price_change_percentage_24h_in_currency,
    lastUpdated: new Date(priceFeed.last_updated * 1000).toISOString(),
  };
};
