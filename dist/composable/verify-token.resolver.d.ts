import { GraphQLContext } from "../context";
import { ComposableResolver } from "./composable.resolver";
export declare const verifyTokenResolver: ComposableResolver<any, GraphQLContext>;
export declare const authenticateUser: (token: string) => Promise<Record<string, string> | null>;
