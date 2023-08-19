import { GraphQLFieldResolver } from "graphql";
export type ComposableResolver<TSource, TContext> = (fn: GraphQLFieldResolver<TSource, TContext>) => GraphQLFieldResolver<TSource, TContext>;
export declare function compose<TSource, TContext>(...funcs: Array<ComposableResolver<TSource, TContext>>): ComposableResolver<TSource, TContext>;
