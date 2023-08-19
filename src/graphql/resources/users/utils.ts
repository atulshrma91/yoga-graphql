import { GraphQLContext } from "../../../context";
import type { PrismaClient } from "@connectfinancial/prisma-database";
import crypto from "crypto";
import { kube, env, local } from "@connectfinancial/env";
export const detectSuspiciousSignIn = async (
  context: GraphQLContext,
  userId: string
) => {
  try {
    if (!userId) {
      throw new Error("Error: User id not found");
    }
    const histories = await context.yoga.prisma.loginHistories.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const loginHistory = await loginHistories(
      context.yoga.prisma,
      userId,
      context.authorization,
      context.headers
    );

    if (
      loginHistory &&
      histories &&
      loginHistory.ipAddress !== histories?.ipAddress
    ) {
      const user = await context.yoga.prisma.users.findUnique({
        where: {
          userId,
        },
      });
      if (!user) {
        throw new Error("Error: User not found");
      }
      await genResetPasswordLink(context, user.email);
    }
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

/**
 * Save Login history
 * @param{PrismaClient} prisma
 * @param{string} userId
 * @param{string} token
 * @param{Request} headers
 **/
const loginHistories = async (
  prisma: PrismaClient,
  userId: string,
  token: string,
  headers: Headers
) => {
  try {
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest()
      .toString("hex");

    const existsLogin = await prisma.loginHistories.findFirst({
      where: {
        userId,
        rawToken: tokenHash,
      },
    });
    if (!existsLogin) {
      const loginType = await prisma.loginTypes.findFirst({
        where: { name: "NORMAL" },
      });
      if (!loginType) {
        throw Error("Error: loginType not found");
      }
      const whitelist = await prisma.whitelists.create({
        data: {
          loginTypeId: loginType.id,
          isWhitelisted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const userAgent = headers.get("User-Agent");
      const cFConnectingIP =
        headers.get("CF-Connecting-IP") || headers.get("x-real-ip");
      const cfIPCountry = headers.get("CF-IPCountry");
      const acceptLanguage = headers.get("Accept-Language");
      const acceptLanguageArr = acceptLanguage.split(",");
      const uaMobile = headers.get("sec-ch-ua-mobile");
      const loginHistory = await prisma.loginHistories.create({
        data: {
          rawToken: tokenHash,
          userId,
          ipAddress: cFConnectingIP || "127.0.0.1",
          accessDevice: userAgent
            ? userAgent.match(/(?<=\().*?(?=;)/)[0]
            : "Not Found",
          accessLocation: cfIPCountry || "Not Found",
          browser: userAgent
            ? userAgent.match(/(firefox|msie|chrome|safari)[/\s]([\d.]+)/gi)[0]
            : "Not Found",
          timestamp: new Date(),
          operatingSystem: userAgent
            ? userAgent.match(/(?<=\().*?(?=;)/)[0]
            : "Not Found",
          language: acceptLanguageArr[0] ?? "en-GB",
          deviceType: uaMobile === "?0" ? "Desktop" : "Mobile" || "Not Found",
          loginTypeId: loginType.id,
          whitelistId: whitelist.id,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return loginHistory;
    }
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const genResetPasswordLink = async (
  context: GraphQLContext,
  email: string
) => {
  try {
    const actionCode = getActionCode();
    const link = await context.yoga.firebase.generatePasswordResetLink(
      email,
      actionCode
    );
    const resetLink = replaceLink(link, actionCode.url);
    return resetLink.replace("login", "reset-password");
  } catch (err: any) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const genVerificationLink = async (
  context: GraphQLContext,
  email: string
) => {
  try {
    const actionCode = getActionCode();
    const link = await context.yoga.firebase.generateEmailVerificationLink(
      email,
      actionCode
    );
    return replaceLink(link, actionCode.url);
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

const getActionCode = () => {
  let url;
  if (local) {
    url = "http://localhost:3000";
  } else if (kube) {
      switch (env) {
        case "development":
          url = "http://dev-client.connect.financial/";
          break;
        case "staging":
          url = "http://staging-client.connect.financial/";
          break;
        case "production":
          url = "http://client.connect.financial/";
          break;
        default:
          url = "http://client.connect.financial/";
          break;
      }
    } else {
      url = process.env.FRONTEND_BASE_URL ?? "http://localhost:3000";
    }
  return { url };
};

const replaceLink = (link: string, url: string) => {
  return link.replace("https://client.connect.financial", url);
};

export const getOobCode = (link: string) =>
  link.substring(link.search("oobCode") + 8, link.search("&apiKey"));
