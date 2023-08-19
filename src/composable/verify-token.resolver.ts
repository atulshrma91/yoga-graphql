import axios from "axios";
import { setupCache } from "axios-cache-adapter";
import { GraphQLFieldResolver , GraphQLError } from "graphql";
import jwt, { JwtPayload, Secret, TokenExpiredError } from "jsonwebtoken";
import { Yoga } from "../app";
import { GraphQLContext } from "../context";
import { ComposableResolver } from "./composable.resolver";

export const verifyTokenResolver: ComposableResolver<any, GraphQLContext> = (
  resolve: GraphQLFieldResolver<any, GraphQLContext>,
): GraphQLFieldResolver<any, GraphQLContext> => {
  return async (parent, args, context: GraphQLContext, info) => {
    try {
      const whiteList = context.yoga.configManager.get("whiteList");
      if (context?.currentUser) {
        try {
          await validateSessions(context.yoga, context.authorization);
        } catch (err: any) {
          return Promise.reject(new GraphQLError((err as Error).message));
        }
        await context.yoga.prisma.users
          .findFirstOrThrow({
            where: { firebaseUID: context?.currentUser.firebaseUID },
          })
          .catch(() => {
            return Promise.reject(new GraphQLError("Unauthorized! Token not provided!."));
          });
        if (whiteList.includes(context.operationName) && context.operationName !== "authorizeUser") {
            return Promise.reject(new GraphQLError("Unauthorized! operation"));
          }
        return resolve(parent, args, context, info);
      }
      if (whiteList.includes(context.operationName)) {
        return resolve(parent, args, context, info);
      }
      return Promise.reject(new GraphQLError("Unauthorized!"));
    } catch (err: any) {
      return null;
    }
  };
};

const cache = setupCache({
  maxAge: 7 * 60 * 60 * 1000,
});

const googleCerts = axios.create({
  adapter: cache.adapter,
  baseURL:
    "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
});

/**
 * Pulls certs from googles public endpoint
 * @param {Object} header
 * @param {Function} callback
 */
async function getKey(header: jwt.JwtPayload): Promise<string> {
  const keys = (await googleCerts.get("")).data;
  if (!Object.keys(keys).includes(header.kid)) {
    throw new Error("Invalid KID");
  }
  return keys[header.kid];
}

const options: jwt.VerifyOptions = {
  algorithms: ["RS256"],
  complete: true,
};

export const authenticateUser = async (token: string): Promise<Record<string, string> | null> => {
  try {
    const authBearer = token.split("Bearer ");
    const decodedToken = authBearer[authBearer.length > 1 ? 1 : 0];
    const header = JSON.parse(Buffer.from(decodedToken.split(".")[0], "base64").toString("ascii"));
    const key = await getKey(header);
    const decoded = jwt.verify(decodedToken, key as Secret, options);
    const decodedPayload = decoded as JwtPayload;
    const userId = decodedPayload?.payload?.user_id;
    if (userId) {
      return decodedPayload?.payload;
    }
    return null;
  } catch (err: any) {
    if (err instanceof TokenExpiredError) {
      throw new Error("jwt expired");
    }
    return null;
  }
};

const validateSessions = async (yoga: Yoga, token: string) => {
  try {
    const authBearer = token.split("Bearer ");
    const decodedToken = authBearer[authBearer.length > 1 ? 1 : 0];
    await yoga.firebase.verifyIdToken(decodedToken, true);
  } catch (error: any) {
    throw new Error(error);
  }
};
