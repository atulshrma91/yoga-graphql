import { Repeater } from "graphql-yoga";
import { institutional_quotes } from "@connectfinancial/prisma-database";
import { GraphQLContext } from "../../../context";
import { QuoteQueue } from "../../../types";
export declare const quotesResolvers: {
    Query: {
        getTokenPairs: import("graphql").GraphQLFieldResolver<any, GraphQLContext, any, unknown>;
    };
    Mutation: {
        createQuote: import("graphql").GraphQLFieldResolver<any, GraphQLContext, any, unknown>;
        executeQuote: import("graphql").GraphQLFieldResolver<any, GraphQLContext, any, unknown>;
        getOrder: import("graphql").GraphQLFieldResolver<any, GraphQLContext, any, unknown>;
    };
    Subscription: {
        getQuote: {
            subscribe: (parent: unknown, args: {
                quoteId: string;
            }, context: GraphQLContext) => Promise<Repeater<unknown, void, unknown>>;
            resolve: (quote: institutional_quotes) => Promise<QuoteQueue>;
        };
    };
};
