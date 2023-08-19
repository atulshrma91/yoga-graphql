import { enum_assets_type, walletAssets } from "@connectfinancial/prisma-database";
import { coinMarketInfo } from "@connectfinancial/utils";
import { calNumbers } from "@connectfinancial/utils/dist/FixedNumberHelper";
import { GraphQLContext } from "../../../context";
import { Transaction, WalletAsset } from "../../../types";

export const getFiatAsset = (context: GraphQLContext, assetId: number) =>
  context.yoga.prisma.institutional_assets.findFirst({
    where: { id: assetId, type: enum_assets_type.fiat },
    include: {
      fiatAssets: true,
    },
  });

export const getWalletTypeOnName = (context: GraphQLContext, type: string) =>
  context.yoga.prisma.walletTypes.findFirst({
    where: {
      name: type,
    },
  });

export const getBalanceType = (context: GraphQLContext, name: string) =>
  context.yoga.prisma.assetBalanceType.findFirst({
    where: {
      balanceTypeName: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

export const getWalletsByType = (context: GraphQLContext, walletTypeId: number) =>
  context.yoga.prisma.wallets.findMany({
    where: {
      userId: context.currentUser.userId,
      walletTypeId,
    },
    include: {
      walletTypes: true,
    },
  });

export const getTransactionalWalletsTransactions = (
  context: GraphQLContext,
  userTransactionalWalletArr: string[],
  assetId: number,
) =>
  context.yoga.prisma.public_transactions.findMany({
    where: {
      sourceWallet: { in: userTransactionalWalletArr },
      userID: context.currentUser.userId,
      assets_id: assetId,
    },
  });

export const getTransactionalWalletsAssets = (
  context: GraphQLContext,
  userTransactionalWalletArr: string[],
  balanceType: number,
) =>
  context.yoga.prisma.walletAssets.findMany({
    where: {
      walletId: { in: userTransactionalWalletArr },
      balanceType,
    },
    include: {
      assets: true,
      assetBalanceType: true,
    },
  });

export const getCollateralWalletsTransactions = (
  context: GraphQLContext,
  collateralWalletArr: string[],
  assetId: number,
) =>
  context.yoga.prisma.public_transactions.findMany({
    where: {
      sourceWallet: { in: collateralWalletArr },
      userID: context.currentUser.userId,
      assets_id: assetId,
    },
  });

export const getCollateralWalletsAssets = (
  context: GraphQLContext,
  collateralWalletArr: string[],
  balanceType: number,
) =>
  context.yoga.prisma.walletAssets.findMany({
    where: {
      walletId: { in: collateralWalletArr },
      balanceType,
    },
    include: {
      assets: true,
      assetBalanceType: true,
    },
  });

export const getStakingWalletsTransactions = (
  context: GraphQLContext,
  stakingWalletArr: string[],
  assetId: number,
) =>
  context.yoga.prisma.public_transactions.findMany({
    where: {
      sourceWallet: { in: stakingWalletArr },
      userID: context.currentUser.userId,
      assets_id: assetId,
    },
  });

export const getStakingWalletsAssets = (
  context: GraphQLContext,
  stakingWalletArr: string[],
  balanceType: number,
) =>
  context.yoga.prisma.walletAssets.findMany({
    where: {
      walletId: { in: stakingWalletArr },
      balanceType,
    },
    include: {
      assets: true,
      assetBalanceType: true,
    },
  });

export const getUserMembership = (context: GraphQLContext) =>
  context.yoga.prisma.userMemberships.findFirst({
    where: {
      userId: context.currentUser.userId,
    },
    include: {
      membershipPrograms: true,
    },
  });

export const getTransactionalWalletAssets = async (
  context: GraphQLContext,
  transactionalWallet: string,
  balanceType: number,
  limit?: number,
  offset?: number,
): Promise<Array<WalletAsset>> => {
  const transactionalWalletAssets = await context.yoga.prisma.walletAssets.findMany({
    where: {
      walletId: transactionalWallet,
      balanceType,
    },
    include: {
      assets: true,
      assetBalanceType: true,
    },
    skip: offset,
    take: limit,
  });
  const assetsArr = [];
  if (transactionalWalletAssets?.length) {
    for (const transactionalWalletAsset of transactionalWalletAssets) {
      const ticker =
        transactionalWalletAsset.assets.type === "crypto"
          ? transactionalWalletAsset.assets.fireblocksTicker
          : transactionalWalletAsset.assets.ticker;
      const marketInfo = await getCoinMarketInfo(context, ticker);
      const walletAsset: WalletAsset = {
        walletAssetsID: transactionalWalletAsset.walletAssetsID,
        balance: transactionalWalletAsset.balance,
        assets: {
          id: transactionalWalletAsset.assets.id,
          name: transactionalWalletAsset.assets.name,
          ticker: transactionalWalletAsset.assets.ticker,
          fireblocksTicker: transactionalWalletAsset.assets.fireblocksTicker,
          type: transactionalWalletAsset.assets.type,
        },
        assetBalanceType: {
          balanceTypeName: transactionalWalletAsset.assetBalanceType.balanceTypeName,
        },
        usdPrice: marketInfo ? marketInfo.current_price : null,
        price: marketInfo
          ? calNumbers().mulFixedNumber(
              Number(marketInfo.current_price),
              Number(transactionalWalletAsset.balance),
            )._value
          : ticker === "USD"
          ? transactionalWalletAsset.balance.toString()
          : null,
        sevenDayPercChange: marketInfo ? marketInfo.price_change_percentage_7d_in_currency : null,
      };
      assetsArr.push(walletAsset);
    }
  }
  return assetsArr;
};

export const getCollateralWalletAssets = async (
  context: GraphQLContext,
  collateralWallet: string,
  balanceType: number,
  limit?: number,
  offset?: number,
): Promise<Array<WalletAsset>> => {
  const collateralWalletAssets = await context.yoga.prisma.walletAssets.findMany({
    where: {
      walletId: collateralWallet,
      balanceType,
    },
    include: {
      assets: true,
      assetBalanceType: true,
    },
    skip: offset,
    take: limit,
  });

  const assetsArr = [];
  if (collateralWalletAssets?.length) {
    for (const collateralWalletAsset of collateralWalletAssets) {
      const ticker =
        collateralWalletAsset.assets.type === "crypto"
          ? collateralWalletAsset.assets.fireblocksTicker
          : collateralWalletAsset.assets.ticker;
      const marketInfo = await getCoinMarketInfo(context, ticker);
      const walletAsset: WalletAsset = {
        walletAssetsID: collateralWalletAsset.walletAssetsID,
        balance: collateralWalletAsset.balance,
        assets: {
          id: collateralWalletAsset.assets.id,
          name: collateralWalletAsset.assets.name,
          ticker: collateralWalletAsset.assets.ticker,
          fireblocksTicker: collateralWalletAsset.assets.fireblocksTicker,
          type: collateralWalletAsset.assets.type,
        },
        assetBalanceType: {
          balanceTypeName: collateralWalletAsset.assetBalanceType.balanceTypeName,
        },
        usdPrice: marketInfo ? marketInfo.current_price : null,
        price: marketInfo
          ? calNumbers().mulFixedNumber(
              Number(marketInfo.current_price),
              Number(collateralWalletAsset.balance),
            )._value
          : ticker === "USD"
          ? collateralWalletAsset.balance.toString()
          : null,
        sevenDayPercChange: marketInfo ? marketInfo.price_change_percentage_7d_in_currency : null,
      };
      assetsArr.push(walletAsset);
    }
  }
  return assetsArr;
};

export const getStakingWalletAssets = async (
  context: GraphQLContext,
  stakingWallet: string,
  balanceType: number,
  limit?: number,
  offset?: number,
): Promise<Array<WalletAsset>> => {
  const stakingWalletAssets = await context.yoga.prisma.walletAssets.findMany({
    where: {
      walletId: stakingWallet,
      balanceType,
    },
    include: {
      assets: true,
      assetBalanceType: true,
    },
    skip: offset,
    take: limit,
  });

  const assetsArr = [];
  if (stakingWalletAssets?.length) {
    for (const stakingWalletAsset of stakingWalletAssets) {
      const ticker =
        stakingWalletAsset.assets.type === "crypto"
          ? stakingWalletAsset.assets.fireblocksTicker
          : stakingWalletAsset.assets.ticker;
      const marketInfo = await getCoinMarketInfo(context, ticker);
      const walletAsset: WalletAsset = {
        walletAssetsID: stakingWalletAsset.walletAssetsID,
        balance: stakingWalletAsset.balance,
        assets: {
          id: stakingWalletAsset.assets.id,
          name: stakingWalletAsset.assets.name,
          ticker: stakingWalletAsset.assets.ticker,
          fireblocksTicker: stakingWalletAsset.assets.fireblocksTicker,
          type: stakingWalletAsset.assets.type,
        },
        assetBalanceType: {
          balanceTypeName: stakingWalletAsset.assetBalanceType.balanceTypeName,
        },
        usdPrice: marketInfo ? marketInfo.current_price : null,
        price: marketInfo
          ? calNumbers().mulFixedNumber(
              Number(marketInfo.current_price),
              Number(stakingWalletAsset.balance),
            )._value
          : ticker === "USD"
          ? stakingWalletAsset.balance.toString()
          : null,
        sevenDayPercChange: marketInfo ? marketInfo.price_change_percentage_7d_in_currency : null,
      };
      assetsArr.push(walletAsset);
    }
  }
  return assetsArr;
};

export const getWalletByID = (context: GraphQLContext, walletsID: string) =>
  context.yoga.prisma.wallets.findFirst({
    where: {
      userId: context.currentUser.userId,
      walletsID,
    },
    include: {
      walletTypes: true,
    },
  });

export const getWalletTransactions = async (
  context: GraphQLContext,
  walletsID: string,
  limit?: number,
  offset?: number,
): Promise<Array<Transaction>> => {
  const transactions = await context.yoga.prisma.public_transactions.findMany({
    where: {
      sourceWallet: walletsID,
      userID: context.currentUser.userId,
      transactionStatus: {
        transactionsStatus: {
          NOT: { name: "notUserViewable" },
        },
      },
    },
    include: {
      assets: true,
      transactionStatus: {
        include: {
          transactionsStatus: true,
        },
      },
    },
    skip: offset,
    take: limit,
  });
  const transactionsArr = [];
  if (transactions?.length) {
    for (const transaction of transactions) {
      const txn: Transaction = {
        transactionID: transaction.transactionID,
        type: transaction.type,
        createdAt: transaction.createdAt,
        assetQuantity: transaction.assetQuantity,
        transactionPurpose: transaction.transactionPurpose,
        transactionStatus: transaction.transactionStatus.transactionsStatus.name,
        assets: {
          id: transaction.assets.id,
          name: transaction.assets.name,
          ticker: transaction.assets.ticker,
          fireblocksTicker: transaction.assets.fireblocksTicker,
          type: transaction.assets.type,
        },
      };
      transactionsArr.push(txn);
    }
  }
  return transactionsArr;
};

export const stakeAssetBalance = async (
  context: GraphQLContext,
  sourceWalletId: string,
  targetWalletId: string,
  assetId: number,
  balance: number,
  sourceWalletBalanceType: string,
): Promise<walletAssets> => {
  try {
    const targetWallet = await context.yoga.prisma.wallets.findFirst({
      where: {
        walletsID: targetWalletId,
        userId: context.userId,
      },
      include: {
        walletTypes: true,
      },
    });
    if (!targetWallet) {
      throw new Error("targetWallet not found!");
    }
    const sourceBalanceType = await getBalanceType(context, sourceWalletBalanceType);
    if (!sourceBalanceType) {
      throw new Error("sourceBalanceType not found!");
    }
    const targetBalanceType = await getBalanceType(context, "Staked");
    if (targetWallet.walletTypes.name === "STAKING") {
      await context.yoga.clients.TRANSACTIONS_API_SERVICE.post("/balanceAdjustment", {
        userId: context.currentUser.userId,
        walletID: targetWallet.walletsID,
        assetID: assetId,
        quantity: balance,
        sourceBalanceType: sourceBalanceType.balanceTypeId,
        targetBalanceType: targetBalanceType.balanceTypeId,
      });
    } else {
      const sourceWallet = await context.yoga.prisma.wallets.findFirst({
        where: {
          walletsID: sourceWalletId,
          userId: context.userId,
        },
        include: {
          walletTypes: true,
        },
      });
      await context.yoga.clients.TRANSACTIONS_API_SERVICE.post("/internalWalletTransfer", {
        userId: context.currentUser?.userId,
        sourceWalletID: sourceWallet.walletsID,
        targetWalletID: targetWallet.walletsID,
        assetID: assetId,
        quantity: balance,
        sourceBalanceType: sourceBalanceType.balanceTypeId,
        targetBalanceType: targetBalanceType.balanceTypeId,
      });
    }
    const walletAsset = await context.yoga.prisma.walletAssets.findFirst({
      where: {
        walletId: targetWallet.walletsID,
        assetsId: assetId,
        balanceType: targetBalanceType.balanceTypeId,
      },
      include: {
        assets: true,
        assetBalanceType: true,
      },
    });
    return walletAsset;
  } catch (err: Error | any) {
    if (err?.isAxiosError) {
      throw new Error(`Error: ${err.response.data.message}`);
    } else {
      throw new Error(`Error: ${(err as Error).message}`);
    }
  }
};

export const lockAssetBalance = async (
  context: GraphQLContext,
  sourceWalletId: string,
  targetWalletId: string,
  assetId: number,
  balance: number,
  sourceWalletBalanceType: string,
): Promise<walletAssets> => {
  try {
    const targetWallet = await context.yoga.prisma.wallets.findFirst({
      where: {
        walletsID: targetWalletId,
        userId: context.userId,
      },
      include: {
        walletTypes: true,
      },
    });
    if (!targetWallet) {
      throw new Error("targetWallet not found!");
    }
    const sourceBalanceType = await getBalanceType(context, sourceWalletBalanceType);
    if (!sourceBalanceType) {
      throw new Error("sourceBalanceType not found!");
    }
    const targetBalanceType = await getBalanceType(context, "Locked");
    if (targetWallet.walletTypes.name === "STAKING") {
      await context.yoga.clients.TRANSACTIONS_API_SERVICE.post("/balanceAdjustment", {
        userId: context.currentUser.userId,
        walletID: targetWallet.walletsID,
        assetID: assetId,
        quantity: balance,
        sourceBalanceType: sourceBalanceType.balanceTypeId,
        targetBalanceType: targetBalanceType.balanceTypeId,
      });
    } else {
      const sourceWallet = await context.yoga.prisma.wallets.findFirst({
        where: {
          walletsID: sourceWalletId,
          userId: context.userId,
        },
        include: {
          walletTypes: true,
        },
      });
      await context.yoga.clients.TRANSACTIONS_API_SERVICE.post("/internalWalletTransfer", {
        userId: context.currentUser?.userId,
        sourceWalletID: sourceWallet.walletsID,
        targetWalletID: targetWallet.walletsID,
        assetID: assetId,
        quantity: balance,
        sourceBalanceType: sourceBalanceType.balanceTypeId,
        targetBalanceType: targetBalanceType.balanceTypeId,
      });
    }
    const walletAsset = await context.yoga.prisma.walletAssets.findFirst({
      where: {
        walletId: targetWallet.walletsID,
        assetsId: assetId,
        balanceType: targetBalanceType.balanceTypeId,
      },
      include: {
        assets: true,
        assetBalanceType: true,
      },
    });
    return walletAsset;
  } catch (err: Error | any) {
    if (err?.isAxiosError) {
      throw new Error(`Error: ${err.response.data.message}`);
    } else {
      throw new Error(`Error: ${(err as Error).message}`);
    }
  }
};

export const getCoinMarketInfo = async (context: GraphQLContext, ticker: string) => {
  try {
    const key = `CRYPTOCOMPARE_${ticker}-USD`;
    const marketInfo = await coinMarketInfo(context.yoga.cache, key);
    if (marketInfo) {
      return JSON.parse(marketInfo);
    }
    return null;
  } catch (err: Error | any) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const parseWalletAssets = async (
  context: GraphQLContext,
  walletAssets: Array<WalletAsset>,
) => {
  try {
    const walletAssetArr: Array<Record<string, any>> = [];
    for (const walletAsset of walletAssets) {
      const ticker =
        walletAsset.assets.type === "crypto"
          ? walletAsset.assets.fireblocksTicker
          : walletAsset.assets.ticker;
      const marketInfo = await getCoinMarketInfo(context, ticker);
      const walletAssetObj = new Map();
      walletAssetObj.set("walletAssetsID", walletAsset.walletAssetsID);
      walletAssetObj.set("balance", walletAsset.balance);
      walletAssetObj.set("assets", walletAsset.assets);
      walletAssetObj.set("assetBalanceType", walletAsset.assetBalanceType);
      walletAssetObj.set(
        "price",
        marketInfo
          ? calNumbers().mulFixedNumber(
              Number(marketInfo.current_price),
              Number(walletAsset.balance),
            )._value
          : ticker === "USD"
          ? walletAsset.balance
          : null,
      );
      walletAssetObj.set("usdPrice", marketInfo ? marketInfo.current_price : null);
      walletAssetObj.set(
        "sevenDayPercChange",
        marketInfo ? marketInfo.price_change_percentage_7d_in_currency : null,
      );
      walletAssetArr.push(Object.fromEntries(walletAssetObj));
    }
    return walletAssetArr;
  } catch (err: Error | any) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const getWalletAssetsTotalBalance = async (walletAssets: Array<WalletAsset>) => {
  try {
    let balance = "0";
    for (const walletAsset of walletAssets) {
      if (walletAsset.price) {
        balance = calNumbers().addFixedNumber(Number(balance), Number(walletAsset.price))._value;
      }
    }
    return balance;
  } catch (err: Error | any) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const getCollateralWalletLoan = async (context: GraphQLContext, walletId: string) => {
  try {
    const loanRecord = await context.yoga.prisma.loanRecord.findFirst({
      include: {
        lineOfCreditProduct: true,
        loanProductShort: true,
        loanProductLong: true,
      },
      where: {
        collateralWalletId: walletId,
      },
    });
    return loanRecord;
  } catch (err: Error | any) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};
