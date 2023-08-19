import { GraphQLContext } from "../../../context";
import { Repeater } from "graphql-yoga";
export declare const priceFeedResolver: {
    Subscription: {
        getPriceFeed: {
            subscribe: (parent: unknown, args: {
                ticker: string;
            }, context: GraphQLContext) => Promise<Repeater<unknown, void, unknown>>;
            resolve: (priceFeed: unknown) => Promise<{
                name: any;
                currentPrice: any;
                symbol: any;
                sevenDayPerChange: any;
                todayPerChange: any;
                lastUpdated: string;
            }>;
        };
    };
};
