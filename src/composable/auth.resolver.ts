import { ComposableResolver } from "./composable.resolver";
import { GraphQLFieldResolver , GraphQLError } from "graphql";
import { verifyTokenResolver } from "./verify-token.resolver";
import { GraphQLContext } from "../context";

export const authResolver: ComposableResolver<any, GraphQLContext> = (
  resolve: GraphQLFieldResolver<any, GraphQLContext>
): GraphQLFieldResolver<any, GraphQLContext> => {
  return (parent, args, context: GraphQLContext, info) => {
    const whiteList = context.yoga.configManager.get("whiteList");
    if (
      context?.currentUser ||
      whiteList.includes(context.operationName) ||
      context?.authorization
    ) {
      return resolve(parent, args, context, info);
    }
    return Promise.reject(
      new GraphQLError("Unauthorized! Token not provided!")
    );
  };
};

export const authResolvers = [authResolver, verifyTokenResolver];
