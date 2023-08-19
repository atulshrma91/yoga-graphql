import { walletAssets } from "@connectfinancial/prisma-database";
import { GraphQLContext } from "../../../context";
import { Transaction, WalletAsset } from "../../../types";
export declare const getFiatAsset: (context: GraphQLContext, assetId: number) => import(".prisma/client").Prisma.Prisma__institutional_assetsClient<import(".prisma/client").institutional_assets & {
    fiatAssets: import(".prisma/client").institutional_fiatAssets;
}, never>;
export declare const getWalletTypeOnName: (context: GraphQLContext, type: string) => import(".prisma/client").Prisma.Prisma__walletTypesClient<import(".prisma/client").walletTypes, never>;
export declare const getBalanceType: (context: GraphQLContext, name: string) => import(".prisma/client").Prisma.Prisma__assetBalanceTypeClient<import(".prisma/client").assetBalanceType, never>;
export declare const getWalletsByType: (context: GraphQLContext, walletTypeId: number) => import(".prisma/client").Prisma.PrismaPromise<(import(".prisma/client").wallets & {
    walletTypes: import(".prisma/client").walletTypes;
})[]>;
export declare const getTransactionalWalletsTransactions: (context: GraphQLContext, userTransactionalWalletArr: string[], assetId: number) => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").public_transactions[]>;
export declare const getTransactionalWalletsAssets: (context: GraphQLContext, userTransactionalWalletArr: string[], balanceType: number) => import(".prisma/client").Prisma.PrismaPromise<(walletAssets & {
    assetBalanceType: import(".prisma/client").assetBalanceType;
    assets: import(".prisma/client").institutional_assets;
})[]>;
export declare const getCollateralWalletsTransactions: (context: GraphQLContext, collateralWalletArr: string[], assetId: number) => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").public_transactions[]>;
export declare const getCollateralWalletsAssets: (context: GraphQLContext, collateralWalletArr: string[], balanceType: number) => import(".prisma/client").Prisma.PrismaPromise<(walletAssets & {
    assetBalanceType: import(".prisma/client").assetBalanceType;
    assets: import(".prisma/client").institutional_assets;
})[]>;
export declare const getStakingWalletsTransactions: (context: GraphQLContext, stakingWalletArr: string[], assetId: number) => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").public_transactions[]>;
export declare const getStakingWalletsAssets: (context: GraphQLContext, stakingWalletArr: string[], balanceType: number) => import(".prisma/client").Prisma.PrismaPromise<(walletAssets & {
    assetBalanceType: import(".prisma/client").assetBalanceType;
    assets: import(".prisma/client").institutional_assets;
})[]>;
export declare const getUserMembership: (context: GraphQLContext) => import(".prisma/client").Prisma.Prisma__userMembershipsClient<import(".prisma/client").userMemberships & {
    membershipPrograms: import(".prisma/client").membershipPrograms;
}, never>;
export declare const getTransactionalWalletAssets: (context: GraphQLContext, transactionalWallet: string, balanceType: number, limit?: number, offset?: number) => Promise<Array<WalletAsset>>;
export declare const getCollateralWalletAssets: (context: GraphQLContext, collateralWallet: string, balanceType: number, limit?: number, offset?: number) => Promise<Array<WalletAsset>>;
export declare const getStakingWalletAssets: (context: GraphQLContext, stakingWallet: string, balanceType: number, limit?: number, offset?: number) => Promise<Array<WalletAsset>>;
export declare const getWalletByID: (context: GraphQLContext, walletsID: string) => import(".prisma/client").Prisma.Prisma__walletsClient<import(".prisma/client").wallets & {
    walletTypes: import(".prisma/client").walletTypes;
}, never>;
export declare const getWalletTransactions: (context: GraphQLContext, walletsID: string, limit?: number, offset?: number) => Promise<Array<Transaction>>;
export declare const stakeAssetBalance: (context: GraphQLContext, sourceWalletId: string, targetWalletId: string, assetId: number, balance: number, sourceWalletBalanceType: string) => Promise<walletAssets>;
export declare const lockAssetBalance: (context: GraphQLContext, sourceWalletId: string, targetWalletId: string, assetId: number, balance: number, sourceWalletBalanceType: string) => Promise<walletAssets>;
export declare const getCoinMarketInfo: (context: GraphQLContext, ticker: string) => Promise<any>;
export declare const parseWalletAssets: (context: GraphQLContext, walletAssets: Array<WalletAsset>) => Promise<Record<string, any>[]>;
export declare const getWalletAssetsTotalBalance: (walletAssets: Array<WalletAsset>) => Promise<string>;
export declare const getCollateralWalletLoan: (context: GraphQLContext, walletId: string) => Promise<import(".prisma/client").loanRecord & {
    lineOfCreditProduct: import(".prisma/client").lineOfCreditProduct;
    loanProductShort: import(".prisma/client").shortFixedLoanProduct;
    loanProductLong: import(".prisma/client").longFixedLoanProduct;
}>;
