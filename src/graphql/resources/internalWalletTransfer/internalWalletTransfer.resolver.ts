import { GraphQLError } from 'graphql/index';
import 'reflect-metadata';
import { authResolvers } from '../../../composable/auth.resolver';
import { compose } from '../../../composable/composable.resolver';

export const internalWalletTransferResolver = {
  Query: {
    getInternalWalletTransfer: compose(...authResolvers)(async (parent, {}, context) => {
      try {
        const internalWalletTransfer =
          await context.yoga.prisma.public_transactions.findFirstOrThrow({
            include: {
              wallets_transactions_sourceWalletTowallets: true,
              wallets_transactions_targetWalletTowallets: true,
            },
            where: {
              userID: context.currentUser?.userId,
            },
          });
        return internalWalletTransfer;
      } catch (err) {
        context.yoga.logger.error(err);
        return Promise.reject(new GraphQLError((err as Error).message));
      }
    }),
  },
  Mutation: {
    internalWalletTransfer: compose(...authResolvers)(
      async (
        parent,
        args: {
          amount: number;
          sourceWallet: string;
          targetWallet: string;
          assets_id: number;
          sourceBalanceType: number;
          targetBalanceType: number;
        },
        context,
      ) => {
        try {
          const data = await context.yoga.clients.TRANSACTIONS_API_SERVICE.post(
            '/internalWalletTransfer',
            {
              userId: context.currentUser?.userId,
              sourceWalletID: args.sourceWallet,
              targetWalletID: args.targetWallet,
              assetID: args.assets_id,
              quantity: args.amount,
              sourceBalanceType: args.sourceBalanceType,
              targetBalanceType: args.targetBalanceType,
            },
          );
          return data.data;
        } catch (err: Error | any) {
          context.yoga.logger.error(err);
          if (err?.isAxiosError) {
            return Promise.reject(new GraphQLError(err.response.data.message));
          }
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
  },
};
