import { GraphQLError } from 'graphql/index';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { productEligibleWalletTypes, walletAssets } from '@connectfinancial/prisma-database';
import { calNumbers } from '@connectfinancial/utils/dist/FixedNumberHelper';
import { authResolvers } from '../../../composable/auth.resolver';
import { compose } from '../../../composable/composable.resolver';
import CreateCustodyWalletAssetsService from '../../../modules/wallets/services/CreateCustodyWalletAssetsService';
import CreateCustodyWalletService from '../../../modules/wallets/services/CreateCustodyWalletService';
import { CollateralWallet, StakingWallet, TransactionalWallet, WalletAsset } from '../../../types';
import IGenerateStakingAssetsSummary from './dtos/IGenerateStakingAssetsSummary';
import IGenerateWalletAssetsSummary from './dtos/IGenerateWalletAssetsSummary';
import IGenerateWalletsSummary from './dtos/IGenerateWalletsSummary';
import IGenerateWalletSummary from './dtos/IGenerateWalletSummary';
import IGenerateWalletTransactionsSummary from './dtos/IGenerateWalletTransactionsSummary';
import {
  getBalanceType,
  getCoinMarketInfo,
  getCollateralWalletAssets,
  getCollateralWalletLoan,
  getCollateralWalletsAssets,
  getFiatAsset,
  getStakingWalletAssets,
  getStakingWalletsAssets,
  getTransactionalWalletAssets,
  getTransactionalWalletsAssets,
  getUserMembership,
  getWalletAssetsTotalBalance,
  getWalletByID,
  getWalletsByType,
  getWalletTransactions,
  getWalletTypeOnName,
  lockAssetBalance,
  parseWalletAssets,
  stakeAssetBalance,
} from './utils';

export const walletResolvers = {
  Query: {
    getEligibleWallets: compose(...authResolvers)(
      async (parent, args: { asset: string; productID: string }, context) => {
        try {
          const product = await context.yoga.prisma.products.findFirst({
            where: {
              productID: args.productID,
            },
          });
          if (!product) {
            throw new Error('Error: No product found');
          }
          const eligibleWalletTypes = await context.yoga.prisma.productEligibleWalletTypes.findMany(
            {
              select: {
                id: true,
                walletTypeId: true,
                productType: true,
              },
              where: {
                productType: product.productType,
              },
            },
          );
          const walletTypes = eligibleWalletTypes.map(
            (eligibleWalletType: productEligibleWalletTypes) => eligibleWalletType?.walletTypeId,
          );
          if (args.asset) {
            const asset = await context.yoga.prisma.institutional_assets.findFirst({
              select: {
                id: true,
              },
              where: {
                OR: [
                  {
                    ticker: args.asset,
                  },
                  { fireblocksTicker: args.asset },
                ],
              },
            });
            const wallets = await context.yoga.prisma.wallets.findMany({
              include: {
                walletAssets: {
                  include: {
                    assets: true,
                    assetBalanceType: true,
                  },
                  where: {
                    assetsId: asset?.id,
                  },
                },
              },
              where: {
                userId: context.currentUser?.userId,
                walletTypeId: { in: walletTypes },
              },
            });
            const walletArr = [];
            for (const wallet of wallets) {
              const walletObj = new Map();
              walletObj.set('walletsID', wallet.walletsID);
              walletObj.set('walletName', wallet.walletName);
              if (wallet.walletAssets) {
                const walletAssets = await parseWalletAssets(context, wallet.walletAssets);
                walletObj.set('walletAssets', walletAssets);
              } else {
                walletObj.set('walletAssets', []);
              }
              walletArr.push(Object.fromEntries(walletObj));
            }
            return walletArr;
          }
          const wallets = await context.yoga.prisma.wallets.findMany({
            include: {
              walletAssets: {
                include: {
                  assets: true,
                  assetBalanceType: true,
                },
              },
            },
            where: {
              userId: context.currentUser?.userId,
              walletTypeId: { in: walletTypes },
            },
          });
          const walletArr = [];
          if (wallets) {
            for (const wallet of wallets) {
              const walletObj = new Map();
              walletObj.set('walletsID', wallet.walletsID);
              walletObj.set('walletName', wallet.walletName);
              if (wallet.walletAssets) {
                const walletAssets = await parseWalletAssets(context, wallet.walletAssets);
                walletObj.set('walletAssets', walletAssets);
              } else {
                walletObj.set('walletAssets', []);
              }
              walletArr.push(Object.fromEntries(walletObj));
            }
          }
          return walletArr;
        } catch (err) {
          context.yoga.logger.error(err);
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
    generateWalletsSummary: compose(...authResolvers)(async (parent, {}, context) => {
      try {
        const walletsSummary: IGenerateWalletsSummary = new IGenerateWalletsSummary();
        const preferredFiatAsset = 1;
        const asset = await getFiatAsset(context, preferredFiatAsset);
        walletsSummary.currencySymbol = asset.fiatAssets.symbol;
        const transactionalWalletType = await getWalletTypeOnName(context, 'TRANSACTIONAL');
        const availableBalanceType = await getBalanceType(context, 'Available');
        const transactionalWallets = await getWalletsByType(
          context,
          transactionalWalletType.walletTypesID,
        );
        walletsSummary.wallets.Transactional.totalWallets = transactionalWallets.length;
        const transactionalWalletArr: string[] = [];
        if (transactionalWallets?.length) {
          for (const transactionalWallet of transactionalWallets) {
            transactionalWalletArr.push(transactionalWallet.walletsID);
            const assets = await getTransactionalWalletAssets(
              context,
              transactionalWallet.walletsID,
              availableBalanceType.balanceTypeId,
            );
            const balance = await getWalletAssetsTotalBalance(assets);
            const wallet: TransactionalWallet = {
              walletId: transactionalWallet.walletsID,
              nickname: transactionalWallet.walletName,
              type: transactionalWallet.walletTypes.name,
              assets,
              balance,
              pendingRewards: '0',
              totalBalance: balance,
            };
            walletsSummary.transactional.push(wallet);
          }
          const transactionalWalletsAssets = await getTransactionalWalletsAssets(
            context,
            transactionalWalletArr,
            availableBalanceType.balanceTypeId,
          );
          if (transactionalWalletsAssets?.length) {
            for (const transactionalWalletsAsset of transactionalWalletsAssets) {
              const ticker =
                transactionalWalletsAsset.assets.type === 'crypto'
                  ? transactionalWalletsAsset.assets.fireblocksTicker
                  : transactionalWalletsAsset.assets.ticker;
              const marketInfo = await getCoinMarketInfo(context, ticker);
              const walletAsset: WalletAsset = {
                walletAssetsID: transactionalWalletsAsset.walletAssetsID,
                balance: transactionalWalletsAsset.balance,
                assets: {
                  id: transactionalWalletsAsset.assets.id,
                  name: transactionalWalletsAsset.assets.name,
                  ticker: transactionalWalletsAsset.assets.ticker,
                  fireblocksTicker: transactionalWalletsAsset.assets.fireblocksTicker,
                  type: transactionalWalletsAsset.assets.type,
                },
                assetBalanceType: {
                  balanceTypeName: transactionalWalletsAsset.assetBalanceType.balanceTypeName,
                },
                usdPrice: marketInfo ? marketInfo.current_price : null,
                price: marketInfo
                  ? calNumbers().mulFixedNumber(
                      Number(marketInfo.current_price),
                      Number(transactionalWalletsAsset.balance),
                    )._value
                  : ticker === 'USD'
                  ? transactionalWalletsAsset.balance.toString()
                  : null,
                sevenDayPercChange: marketInfo
                  ? marketInfo.price_change_percentage_7d_in_currency
                  : null,
              };
              walletsSummary.wallets.Transactional.assets.push(walletAsset);
            }
            walletsSummary.wallets.Transactional.totalBalance = await getWalletAssetsTotalBalance(
              walletsSummary.wallets.Transactional.assets,
            );
          }
        }
        const collateralWalletType = await getWalletTypeOnName(context, 'COLLATERAL');
        const collateralWallets = await getWalletsByType(
          context,
          collateralWalletType.walletTypesID,
        );
        walletsSummary.wallets.Collateral.totalWallets = collateralWallets.length;
        const collateralWalletArr: string[] = [];
        if (collateralWallets?.length) {
          for (const collateralWallet of collateralWallets) {
            collateralWalletArr.push(collateralWallet.walletsID);
            const assets = await getCollateralWalletAssets(
              context,
              collateralWallet.walletsID,
              availableBalanceType.balanceTypeId,
            );
            const balance = await getWalletAssetsTotalBalance(assets);
            const loanRecord = await getCollateralWalletLoan(context, collateralWallet.walletsID);
            const wallet: CollateralWallet = {
              walletId: collateralWallet.walletsID,
              nickname: collateralWallet.walletName,
              type: collateralWallet.walletTypes.name,
              assets,
              ltvFeePercentage: 0,
              totalLoanAmount: loanRecord ? loanRecord.currentBalance : null,
              paidOnLoanAmount: loanRecord ? loanRecord.currentBalance : null,
              loanEndDate: loanRecord ? new Date(loanRecord.expiringAt) : null,
              totalBalance: balance,
              minimumPayment: null,
              minimumPaymentDueDate: null,
              outstandingPaymentBalance: null,
            };
            walletsSummary.collateral.push(wallet);
          }
          const collateralWalletsAssets = await getCollateralWalletsAssets(
            context,
            collateralWalletArr,
            availableBalanceType.balanceTypeId,
          );
          if (collateralWalletsAssets?.length) {
            for (const collateralWalletsAsset of collateralWalletsAssets) {
              const ticker =
                collateralWalletsAsset.assets.type === 'crypto'
                  ? collateralWalletsAsset.assets.fireblocksTicker
                  : collateralWalletsAsset.assets.ticker;
              const marketInfo = await getCoinMarketInfo(context, ticker);
              const walletAsset: WalletAsset = {
                walletAssetsID: collateralWalletsAsset.walletAssetsID,
                balance: collateralWalletsAsset.balance,
                assets: {
                  id: collateralWalletsAsset.assets.id,
                  name: collateralWalletsAsset.assets.name,
                  ticker: collateralWalletsAsset.assets.ticker,
                  fireblocksTicker: collateralWalletsAsset.assets.fireblocksTicker,
                  type: collateralWalletsAsset.assets.type,
                },
                assetBalanceType: {
                  balanceTypeName: collateralWalletsAsset.assetBalanceType.balanceTypeName,
                },
                usdPrice: marketInfo ? marketInfo.current_price : null,
                price: marketInfo
                  ? calNumbers().mulFixedNumber(
                      Number(marketInfo.current_price),
                      Number(collateralWalletsAsset.balance),
                    )._value
                  : ticker === 'USD'
                  ? collateralWalletsAsset.balance.toString()
                  : null,
                sevenDayPercChange: marketInfo
                  ? marketInfo.price_change_percentage_7d_in_currency
                  : null,
              };
              walletsSummary.wallets.Collateral.assets.push(walletAsset);
            }
            walletsSummary.wallets.Collateral.totalBalance = await getWalletAssetsTotalBalance(
              walletsSummary.wallets.Collateral.assets,
            );
          }
        }
        const stakingWalletType = await getWalletTypeOnName(context, 'STAKING');
        const stakingWallets = await getWalletsByType(context, stakingWalletType.walletTypesID);
        walletsSummary.wallets.Staking.totalWallets = stakingWallets.length;
        const stakingWalletArr: string[] = [];
        if (stakingWallets?.length) {
          for (const stakingWallet of stakingWallets) {
            stakingWalletArr.push(stakingWallet.walletsID);
            const assets = await getStakingWalletAssets(
              context,
              stakingWallet.walletsID,
              availableBalanceType.balanceTypeId,
            );
            const balance = await getWalletAssetsTotalBalance(assets);
            const wallet: StakingWallet = {
              walletId: stakingWallet.walletsID,
              nickname: stakingWallet.walletName,
              type: stakingWallet.walletTypes.name,
              assets,
              balance,
              pendingRewards: '0',
              totalBalance: balance,
            };
            walletsSummary.staking.push(wallet);
          }
          const stakingWalletsAssets = await getStakingWalletsAssets(
            context,
            stakingWalletArr,
            availableBalanceType.balanceTypeId,
          );
          if (stakingWalletsAssets?.length) {
            for (const stakingWalletsAsset of stakingWalletsAssets) {
              const ticker =
                stakingWalletsAsset.assets.type === 'crypto'
                  ? stakingWalletsAsset.assets.fireblocksTicker
                  : stakingWalletsAsset.assets.ticker;
              const marketInfo = await getCoinMarketInfo(context, ticker);
              const walletAsset: WalletAsset = {
                walletAssetsID: stakingWalletsAsset.walletAssetsID,
                balance: stakingWalletsAsset.balance,
                assets: {
                  id: stakingWalletsAsset.assets.id,
                  name: stakingWalletsAsset.assets.name,
                  ticker: stakingWalletsAsset.assets.ticker,
                  fireblocksTicker: stakingWalletsAsset.assets.fireblocksTicker,
                  type: stakingWalletsAsset.assets.type,
                },
                assetBalanceType: {
                  balanceTypeName: stakingWalletsAsset.assetBalanceType.balanceTypeName,
                },
                usdPrice: marketInfo ? marketInfo.current_price : null,
                price: marketInfo
                  ? calNumbers().mulFixedNumber(
                      Number(marketInfo.current_price),
                      Number(stakingWalletsAsset.balance),
                    )._value
                  : ticker === 'USD'
                  ? stakingWalletsAsset.balance.toString()
                  : null,
                sevenDayPercChange: marketInfo
                  ? marketInfo.price_change_percentage_7d_in_currency
                  : null,
              };
              walletsSummary.wallets.Staking.assets.push(walletAsset);
            }
            walletsSummary.wallets.Staking.stakedBalance = await getWalletAssetsTotalBalance(
              walletsSummary.wallets.Staking.assets,
            );
          }
        }
        const userMembership = await getUserMembership(context);
        walletsSummary.wallets.Membership.membershipType =
          userMembership?.membershipPrograms?.programName || '';
        if (userMembership) {
          walletsSummary.membership.walletId = '';
          walletsSummary.membership.nickname = '';
          walletsSummary.membership.membershipType =
            userMembership?.membershipPrograms?.programName || '';
        }
        return walletsSummary;
      } catch (err) {
        context.yoga.logger.error(err);
        return Promise.reject(new GraphQLError((err as Error).message));
      }
    }),
    generateWalletSummary: compose(...authResolvers)(async (parent, { walletId }, context) => {
      try {
        const walletSummary: IGenerateWalletSummary = new IGenerateWalletSummary();
        const wallet = await getWalletByID(context, walletId);
        const availableBalanceType = await getBalanceType(context, 'Available');
        if (wallet) {
          switch (wallet.walletTypes.name) {
            case 'TRANSACTIONAL':
              walletSummary.wallet.walletId = wallet.walletsID;
              walletSummary.wallet.nickname = wallet.walletName;
              walletSummary.wallet.type = wallet.walletTypes.name;
              walletSummary.wallet.assets = await getTransactionalWalletAssets(
                context,
                wallet.walletsID,
                availableBalanceType.balanceTypeId,
              );
              const transactionalbalance = await getWalletAssetsTotalBalance(
                walletSummary.wallet.assets,
              );
              (walletSummary.wallet as TransactionalWallet).balance = transactionalbalance;
              (walletSummary.wallet as TransactionalWallet).pendingRewards = '0';
              walletSummary.wallet.totalBalance = transactionalbalance;
              break;
            case 'COLLATERAL':
              walletSummary.wallet.walletId = wallet.walletsID;
              walletSummary.wallet.nickname = wallet.walletName;
              walletSummary.wallet.type = wallet.walletTypes.name;
              walletSummary.wallet.assets = await getCollateralWalletAssets(
                context,
                wallet.walletsID,
                availableBalanceType.balanceTypeId,
              );
              const loanRecord = await getCollateralWalletLoan(context, wallet.walletsID);
              (walletSummary.wallet as CollateralWallet).ltvFeePercentage = 0;
              (walletSummary.wallet as CollateralWallet).totalLoanAmount = loanRecord
                ? loanRecord.currentBalance
                : null;
              (walletSummary.wallet as CollateralWallet).paidOnLoanAmount = loanRecord
                ? loanRecord.currentBalance
                : null;
              (walletSummary.wallet as CollateralWallet).loanEndDate = loanRecord
                ? new Date(loanRecord.expiringAt)
                : null;
              const collateralBalance = await getWalletAssetsTotalBalance(
                walletSummary.wallet.assets,
              );
              walletSummary.wallet.totalBalance = collateralBalance;
              (walletSummary.wallet as CollateralWallet).minimumPayment = null;
              (walletSummary.wallet as CollateralWallet).minimumPaymentDueDate = null;
              (walletSummary.wallet as CollateralWallet).outstandingPaymentBalance = null;
              break;
            case 'STAKING':
              walletSummary.wallet.walletId = wallet.walletsID;
              walletSummary.wallet.nickname = wallet.walletName;
              walletSummary.wallet.type = wallet.walletTypes.name;
              walletSummary.wallet.assets = await getStakingWalletAssets(
                context,
                wallet.walletsID,
                availableBalanceType.balanceTypeId,
              );
              const stakingBalance = await getWalletAssetsTotalBalance(walletSummary.wallet.assets);
              (walletSummary.wallet as StakingWallet).balance = stakingBalance;
              (walletSummary.wallet as StakingWallet).pendingRewards = '0';
              (walletSummary.wallet as StakingWallet).stakedBalance = 0;
              (walletSummary.wallet as StakingWallet).availableRewards = 0;
              (walletSummary.wallet as StakingWallet).paidRewards = 0;
              walletSummary.wallet.totalBalance = stakingBalance;
              break;
          }
        }
        return walletSummary;
      } catch (err) {
        context.yoga.logger.error(err);
        return Promise.reject(new GraphQLError((err as Error).message));
      }
    }),
    generateWalletAssetsSummary: compose(...authResolvers)(
      async (parent, { walletId, balanceType, limit, offset }, context) => {
        try {
          const walletAssetsSummary: IGenerateWalletAssetsSummary =
            new IGenerateWalletAssetsSummary();
          const wallet = await getWalletByID(context, walletId);
          const availableBalanceType = await getBalanceType(context, balanceType || 'Available');
          if (wallet) {
            let assets: Array<WalletAsset>;
            switch (wallet.walletTypes.name) {
              case 'TRANSACTIONAL':
                assets = await getTransactionalWalletAssets(
                  context,
                  wallet.walletsID,
                  availableBalanceType.balanceTypeId,
                  limit,
                  offset,
                );
                walletAssetsSummary.totalRecords = assets.length || 0;
                walletAssetsSummary.assets = assets;
                break;
              case 'COLLATERAL':
                assets = await getCollateralWalletAssets(
                  context,
                  wallet.walletsID,
                  availableBalanceType.balanceTypeId,
                  limit,
                  offset,
                );
                walletAssetsSummary.totalRecords = assets.length || 0;
                walletAssetsSummary.assets = assets;
                break;
              case 'STAKING':
                assets = await getStakingWalletAssets(
                  context,
                  wallet.walletsID,
                  availableBalanceType.balanceTypeId,
                  limit,
                  offset,
                );
                walletAssetsSummary.totalRecords = assets.length || 0;
                walletAssetsSummary.assets = assets;
                break;
            }
          }
          return walletAssetsSummary;
        } catch (err) {
          context.yoga.logger.error(err);
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
    generateWalletTransactionsSummary: compose(...authResolvers)(
      async (parent, { walletId, limit, offset }, context) => {
        try {
          const walletTransactionsSummary: IGenerateWalletTransactionsSummary =
            new IGenerateWalletTransactionsSummary();
          const wallet = await getWalletByID(context, walletId);
          if (wallet) {
            const transactions = await getWalletTransactions(context, walletId, limit, offset);
            if (transactions) {
              walletTransactionsSummary.totalRecords = transactions.length || 0;
              walletTransactionsSummary.transactions = transactions;
            }
          }
          return walletTransactionsSummary;
        } catch (err) {
          context.yoga.logger.error(err);
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
    generateStakingAssetsSummary: compose(...authResolvers)(
      async (parent, { walletId, balanceType, limit, offset }, context) => {
        try {
          const wallet = await getWalletByID(context, walletId);
          if (wallet && wallet.walletTypes.name === 'STAKING') {
            const walletAssetsSummary: IGenerateStakingAssetsSummary =
              new IGenerateStakingAssetsSummary();
            const assetBalanceType = await getBalanceType(context, balanceType);
            const assets = await getStakingWalletAssets(
              context,
              wallet.walletsID,
              assetBalanceType.balanceTypeId,
              limit,
              offset,
            );
            walletAssetsSummary.totalRecords = assets.length || 0;
            walletAssetsSummary.assets = assets;
            return walletAssetsSummary;
          }
          return Promise.reject(new GraphQLError('Invalid wallet'));
        } catch (err) {
          context.yoga.logger.error(err);
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
  },
  Mutation: {
    createUserWallet: compose(...authResolvers)(
      async (parent, { walletTypeId, walletName }, context) => {
        try {
          const service = container.resolve(CreateCustodyWalletService);
          const userWallet = await service.execute({
            userId: context.userId,
            walletTypeId,
            walletName,
          });
          return userWallet;
        } catch (err) {
          context.yoga.logger.error(err);
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
    createWalletAsset: compose(...authResolvers)(async (parent, { walletId, assetId }, context) => {
      try {
        const service = container.resolve(CreateCustodyWalletAssetsService);
        const userWallet = await service.execute({
          userId: context.userId,
          walletId,
          assetId,
        });
        return userWallet;
      } catch (err) {
        context.yoga.logger.error(err);
        return Promise.reject(new GraphQLError((err as Error).message));
      }
    }),
    stakingBalanceUpdate: compose(...authResolvers)(
      async (
        parent,
        { sourceWalletId, targetWalletId, assetId, balance, sourceBalanceType, type },
        context,
      ) => {
        try {
          let walletAsset: walletAssets;
          switch (type) {
            case 'stake':
              walletAsset = await stakeAssetBalance(
                context,
                sourceWalletId,
                targetWalletId,
                assetId,
                balance,
                sourceBalanceType,
              );
              break;

            case 'unstake':
              walletAsset = await lockAssetBalance(
                context,
                sourceWalletId,
                targetWalletId,
                assetId,
                balance,
                sourceBalanceType,
              );
              break;
          }
          return walletAsset;
        } catch (err) {
          context.yoga.logger.error(err);
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
  },
  WalletSummary: {
    __resolveType(obj: Record<string, any>) {
      if (obj.type === 'TRANSACTIONAL') {
        return 'TransactionalWallet';
      }
      if (obj.type === 'COLLATERAL') {
        return 'CollateralWallet';
      }
      if (obj.type === 'STAKING') {
        return 'StakingWallet';
      }
      return null;
    },
  },
};
