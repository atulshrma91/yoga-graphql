import { users } from "@connectfinancial/prisma-database";
import { Yoga } from "./app";
import { YogaInitialContext } from "@graphql-yoga/node";
export type GraphQLContext = {
    currentUser: null | users;
    authorization?: string;
    userId?: null | string;
    operationName?: string;
    headers: Headers;
    yoga: Yoga;
};
export declare const createContext: (yoga: Yoga, intitalContext: YogaInitialContext) => Promise<GraphQLContext>;
