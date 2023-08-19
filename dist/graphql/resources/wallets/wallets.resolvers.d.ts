import 'reflect-metadata';
export declare const walletResolvers: {
    Query: {
        getEligibleWallets: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        generateWalletsSummary: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        generateWalletSummary: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        generateWalletAssetsSummary: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        generateWalletTransactionsSummary: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        generateStakingAssetsSummary: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
    };
    Mutation: {
        createUserWallet: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        createWalletAsset: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        stakingBalanceUpdate: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
    };
    WalletSummary: {
        __resolveType(obj: Record<string, any>): "CollateralWallet" | "StakingWallet" | "TransactionalWallet";
    };
};
