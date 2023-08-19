import { users } from "@connectfinancial/prisma-database";
import { Yoga } from "./app";
import { GraphQLError } from "graphql/index";
import { authenticateUser } from "./composable/verify-token.resolver";
import { YogaInitialContext } from "@graphql-yoga/node";

export type GraphQLContext = {
  currentUser: null | users;
  authorization?: string;
  userId?: null | string;
  operationName?: string;
  headers: Headers;
  yoga: Yoga;
};

export const createContext = async (
  yoga: Yoga,
  intitalContext: YogaInitialContext
): Promise<GraphQLContext> => {
  const prisma = yoga.prisma;
  try {
    let userId = null;
    let user = null;
    if (
      intitalContext.request
        ? intitalContext.request.headers.get("authorization")
        : intitalContext.params.extensions?.headers?.authorization
    ) {
      const decodedPayload = await authenticateUser(
        intitalContext.request
          ? (intitalContext.request.headers.get("authorization") as string)
          : (intitalContext.params.extensions?.headers?.authorization as string)
      );
      if (decodedPayload?.user_id) {
        userId = decodedPayload?.user_id;
        user = await prisma.users.findFirst({
          where: { firebaseUID: userId },
        });
      }
    }
    return {
      currentUser: user,
      userId: user?.userId || null,
      authorization: intitalContext.request
        ? (intitalContext.request.headers.get("authorization") as string)
        : (intitalContext.params.extensions?.headers?.authorization as string),
      operationName: intitalContext.params.operationName,
      headers: intitalContext.request
        ? intitalContext.request.headers
        : intitalContext.params.extensions.headers,
      yoga,
    };
  } catch (err: any) {
    yoga.logger.error(err);
    return Promise.reject(new GraphQLError((err as Error).message));
  }
};
