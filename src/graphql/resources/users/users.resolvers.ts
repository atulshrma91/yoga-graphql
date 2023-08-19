import { GraphQLError } from "graphql/index";
import { v4 as uuidv4 } from "uuid";
import { authResolvers } from "../../../composable/auth.resolver";
import { compose } from "../../../composable/composable.resolver";
import { authenticateUser } from "../../../composable/verify-token.resolver";
import { User } from "../../../types";
import {
  detectSuspiciousSignIn,
  genResetPasswordLink,
  genVerificationLink,
  getOobCode,
} from "./utils";

export const userResolvers = {
  Query: {
    user: compose(...authResolvers)(async (parent, {}, context) => {
      try {
        const user = (await context.yoga.prisma.users
          .findUniqueOrThrow({
            select: {
              userId: true,
              userName: true,
              firstName: true,
              lastName: true,
              email: true,
              isEmailVerified: true,
              isWhitelistEnabled: true,
              referenceCode: true,
              mobileNumber: true,
              phoneNumber: true,
              is2faEnabled: true,
              dob: true,
              gender: true,
              receiveNewsletter: true,
              image: true,
              google2faSecret: true,
              loginHistories: {
                select: {
                  ipAddress: true,
                  accessDevice: true,
                  accessLocation: true,
                  browser: true,
                  createdAt: true,
                },
              },
              userAddress: {
                select: {
                  addressLine1: true,
                  addressLine2: true,
                  City: true,
                  State: true,
                  Zipcode: true,
                },
              },
              userRole: {
                select: {
                  userId: true,
                  userRoleTypeId: true,
                },
              },
            },
            where: {
              userId: context.currentUser?.userId,
            },
          })
          .catch(() => {
            return Promise.reject(new GraphQLError("User not found."));
          })) as User;
        return user;
      } catch (err) {
        return Promise.reject(new GraphQLError((err as Error).message));
      }
    }),
    getUserMemberships: compose(...authResolvers)(async (parent, {}, context) => {
      try {
        const { userMemberships } = context.yoga.prisma;
        const UserMemberships = await userMemberships.findMany({
          select: {
            membershipProgramId: true,
            userId: true,
            membershipStartDate: true,
            isCurrent: true,
            membershipEndedDate: true,
            membershipPrograms: {
              select: {
                programName: true,
                products: true,
              },
            },
          },
          where: { userId: context.userId },
        });
        return UserMemberships;
      } catch (err) {
        return Promise.reject(new GraphQLError((err as Error).message));
      }
    }),
  },
  Mutation: {
    authorizeUser: compose(...authResolvers)(async (parent, {}, context) => {
      try {
        let userId = null;
        if (context?.currentUser) {
          userId = context.currentUser?.userId;
        } else {
          const decodedPayload = await authenticateUser(context.authorization as string);
          if (!decodedPayload) {
            return Promise.reject(new GraphQLError("Invalid Token."));
          }

          const nameSplit = decodedPayload.name.split(" ");

          const user = await context.yoga.prisma.users.create({
            data: {
              userId: uuidv4(),
              firebaseUID: decodedPayload?.user_id,
              email: decodedPayload?.email,
              userName: decodedPayload.email.split("@")[0],
              firstName: nameSplit[0] ?? "",
              lastName: nameSplit[1] ?? "",
            },
          });
          userId = user.userId;

          const userRoleType = await context.yoga.prisma.userRoleType.findFirst({
            where: {
              name: "User",
            },
          });
          const userAgreementsTOS = await context.yoga.prisma.userAgreements.findFirst({
            where: {
              documentName: "Terms of Use",
            },
          });

          const userAgreementsPP = await context.yoga.prisma.userAgreements.findFirst({
            where: {
              documentName: "Privacy Policy",
            },
          });

          const userAgreementsCP = await context.yoga.prisma.userAgreements.findFirst({
            where: {
              documentName: "Cookie Policy",
            },
          });

          await context.yoga.prisma.signedUserAgreements.createMany({
            data: [
              {
                userID: user.userId,
                documentID: userAgreementsTOS.id,
                dateAgreed: new Date(),
              },
              {
                userID: user.userId,
                documentID: userAgreementsPP.id,
                dateAgreed: new Date(),
              },
              {
                userID: user.userId,
                documentID: userAgreementsCP.id,
                dateAgreed: new Date(),
              },
            ],
          });

          await context.yoga.prisma.userRole.create({
            data: {
              userId: user.userId,
              userRoleTypeId: userRoleType.id,
            },
          });
          const StakingWalletType = await context.yoga.prisma.walletTypes.findFirst({
            where: {
              name: "STAKING",
            },
          });

          await context.yoga.prisma.wallets.create({
            data: {
              userId: user.userId,
              walletTypeId: StakingWalletType.walletTypesID,
              walletName: `${user.firstName} STAKING wallet`,
            },
          });

          const TransactionalWalletType = await context.yoga.prisma.walletTypes.findFirst({
            where: {
              name: "TRANSACTIONAL",
            },
          });

          const TransactionalWallet = await context.yoga.prisma.wallets.create({
            data: {
              userId: user.userId,
              walletTypeId: TransactionalWalletType.walletTypesID,
              walletName: `${user.firstName} Transactional wallet`,
            },
          });

          await context.yoga.prisma.userWalletPermissions.create({
            data: {
              walletID: TransactionalWallet.walletsID,
              walletUserPermissionsID: 1,
            },
          });
        }
        /* Save login history and detect suspicious sign in*/
        await detectSuspiciousSignIn(context, userId);
        const user = (await context.yoga.prisma.users
          .findUniqueOrThrow({
            select: {
              userId: true,
              userName: true,
              firstName: true,
              lastName: true,
              email: true,
              isEmailVerified: true,
              isWhitelistEnabled: true,
              referenceCode: true,
              mobileNumber: true,
              phoneNumber: true,
              is2faEnabled: true,
              dob: true,
              gender: true,
              receiveNewsletter: true,
              image: true,
              google2faSecret: true,
              loginHistories: {
                select: {
                  ipAddress: true,
                  accessDevice: true,
                  accessLocation: true,
                  browser: true,
                  createdAt: true,
                },
              },
              userAddress: {
                select: {
                  addressLine1: true,
                  addressLine2: true,
                  City: true,
                  State: true,
                  Zipcode: true,
                },
              },
              userRole: {
                select: {
                  userId: true,
                  userRoleTypeId: true,
                },
              },
            },
            where: {
              userId,
            },
          })
          .catch(() => {
            return Promise.reject(new GraphQLError("User not found."));
          })) as User;
        return user;
      } catch (err) {
        context.yoga.logger.error(err);
        return Promise.reject(new GraphQLError((err as Error).message));
      }
    }),

    getUserMembership: compose(...authResolvers)(async (parent, {}, context) => {
      try {
        const { membershipPrograms, userMemberships } = context.yoga.prisma;

        let userMembership = await userMemberships.findFirst({
          select: {
            membershipProgramId: true,
            userId: true,
            membershipStartDate: true,
            isCurrent: true,
            membershipEndedDate: true,
            membershipPrograms: {
              select: {
                programName: true,
                products: true,
              },
            },
          },
          where: { userId: context.userId, isCurrent: true },
        });

        if (!userMembership) {
          const membershipProgram = await membershipPrograms.findFirst({
            where: {
              programName: "Basic",
            },
          });

          userMembership = await userMemberships.create({
            select: {
              membershipProgramId: true,
              userId: true,
              membershipStartDate: true,
              isCurrent: true,
              membershipEndedDate: true,
              membershipPrograms: {
                select: {
                  programName: true,
                  products: true,
                },
              },
            },
            data: {
              membershipProgramId: membershipProgram.membershipProgramID,
              userId: context.userId,
              membershipStartDate: new Date(),
              isCurrent: true,
              membershipEndedDate: null,
            },
          });
        }
        return userMembership;
      } catch (err) {
        return Promise.reject(new GraphQLError((err as Error).message));
      }
    }),
    sendResetPasswordEmail: compose(...authResolvers)(
      async (
        parent,
        args: {
          email: string;
        },
        context,
      ) => {
        try {
          const user = await context.yoga.prisma.users.findFirst({
            where: {
              email: args.email,
            },
          });
          if (!user) {
            return Promise.reject(new GraphQLError("Invalid User."));
          }
          const link = await genResetPasswordLink(context, user.email);
          const emailService = context.yoga.clients.NOTIFIER_EMAIL_SERVICE;
          const {
            data: { sent },
          } = (await emailService.post("/", {
            userData: {
              to: user?.email,
              name: user.userName,
              link,
            },
            campaign: "resetPassword",
          })) as any;
          if (!sent) {
            return Promise.reject(new GraphQLError("Could not generate reset password mail"));
          }
          return { mail: sent };
        } catch (err) {
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
    sendVerificationEmailNewUser: compose(...authResolvers)(
      async (
        parent,
        args: {
          email: string;
          referralCode: string;
        },
        context,
      ) => {
        try {
          const user = await context.yoga.prisma.users.findFirst({
            where: { userId: context.userId },
          });
          if (!user) {
            return Promise.reject(new GraphQLError("Invalid User."));
          }
          const link = await genVerificationLink(context, user.email);
          const {
            data: { sent },
          } = (await context.yoga.clients.NOTIFIER_EMAIL_SERVICE.post("/", {
            userData: {
              to: user.email,
              name: user.userName,
              link,
            },
            campaign: "verification",
          })) as any;
          if (!sent) {
            return Promise.reject(new GraphQLError("Could not generate verification mail"));
          }
          const oobCode = getOobCode(link);
          await context.yoga.cache.conn.hset("EMAIL_OOBS", oobCode, user?.userId);
          return { mail: sent };
        } catch (err) {
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
    verifyEmail: compose(...authResolvers)(
      async (
        parent,
        args: {
          oobCode: string;
        },
        context,
      ) => {
        try {
          const userId = await context.yoga.cache.conn.hget("EMAIL_OOBS", args.oobCode);
          const user = await context.yoga.prisma.users.findFirst({
            where: { userId },
          });
          if (user) {
            if (user.isEmailVerified) {
              return {
                verified: user?.isEmailVerified,
                message: "Email has been validated!",
              };
            }
            const updatedUser = await context.yoga.prisma.users.update({
              where: {
                userId: user?.userId,
              },
              data: {
                isEmailVerified: true,
              },
            });
            return {
              verified: updatedUser?.isEmailVerified,
              message: "Email has been validated!",
            };
          }
          return Promise.reject(new GraphQLError("Invalid User."));
        } catch (err) {
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
    resendVerificationEmail: compose(...authResolvers)(async (parent, {}, context) => {
      try {
        if (context.currentUser.isEmailVerified) {
          return Promise.reject(new GraphQLError("User already verified"));
        }
        const link = await genVerificationLink(context, context.currentUser.email);
        const {
          data: { sent },
        } = (await context.yoga.clients.NOTIFIER_EMAIL_SERVICE.post("/", {
          userData: {
            to: context.currentUser.email,
            name: context.currentUser.userName,
            link,
          },
          campaign: "verification",
        })) as any;
        if (!sent) {
          return Promise.reject(new GraphQLError("Could not generate verification mail"));
        }
        const oobCode = getOobCode(link);
        await context.yoga.cache.conn.hset("EMAIL_OOBS", oobCode, context.currentUser?.userId);
        return { mail: sent };
      } catch (err) {
        return Promise.reject(new GraphQLError((err as Error).message));
      }
    }),
    sendUserGoogleRegister: compose(...authResolvers)(
      async (
        parent,
        args: {
          userName: string;
          referralCode: string;
        },
        context,
      ) => {
        try {
          const user = await context.yoga.prisma.users.findFirst({
            where: { userId: context.currentUser.userId },
          });
          if (user) {
            if (user.isEmailVerified) {
              return {
                success: true,
                message: "User has been created and email validated!",
              };
            }
            const updatedUser = await context.yoga.prisma.users.update({
              where: {
                userId: user?.userId,
              },
              data: {
                isEmailVerified: true,
                userName: args?.userName || null,
              },
            });
            await context.yoga.clients.NOTIFIER_EMAIL_SERVICE.post("/", {
              campaign: "welcome",
              userData: {
                to: updatedUser.email,
                name: `${updatedUser.userName}`,
              },
            });
            return {
              success: true,
              message: "User has been created and email validated!",
            };
          }
        } catch (err) {
          context.yoga.logger.error(err);
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
  },
  Subscription: {},
};
