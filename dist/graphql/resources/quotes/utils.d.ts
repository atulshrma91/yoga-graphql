import { Yoga } from "../../../app";
import { GraphQLContext } from "../../../context";
import { institutional_quotes, PrismaClient, orders, enum_transactionType } from "@connectfinancial/prisma-database";
export declare const createFXheaders: (fxApiKey: string, fxApiSecret: string, fxApiPassPhrase: string) => Record<string, string | number>;
export declare const fxSubscribePriceFeed: (prisma: PrismaClient, baseToken: string, quoteToken: string, quantity: string, quoteId: string) => Promise<{
    token_pair: {
        base_token: string;
        quote_token: string;
    };
    echo_id: boolean;
    quantity: number[];
    quantity_token: string;
    client_request_id: string;
} | {
    token_pair: {
        base_token: string;
        quote_token: string;
    };
    echo_id: boolean;
    quantity: number[];
    client_request_id: string;
    quantity_token?: undefined;
}>;
export declare const fxUnsubscribePriceFeed: (prisma: PrismaClient, quote: institutional_quotes) => Promise<{
    token_pair: {
        base_token: string;
        quote_token: string;
    };
    client_request_id: string;
}>;
export declare const storePriceFeed: (yoga: Yoga, data: Array<Record<string, any>>) => Promise<void>;
export declare const storeQuoteRequest: (prisma: PrismaClient, baseToken: string, quoteToken: string, quantity: string, source: string, userId: string) => Promise<institutional_quotes>;
export declare const getQuoteById: (prisma: PrismaClient, quoteId: string) => Promise<institutional_quotes>;
export declare const fxOrderPayload: (prisma: PrismaClient, quote: institutional_quotes | null, orderId: string) => Promise<{
    message_type: string;
    client_order_id: string;
    client_request_id: string;
    token_pair: {
        base_token: string;
        quote_token: string;
    };
    quantity: {
        token: string;
        value: string;
    };
    side: string;
    limit_price: string;
    time_in_force: string;
    slippage_bps: string;
}>;
export declare const updateQuote: (prisma: PrismaClient, quoteId: string | undefined, data: Record<string, any>) => Promise<institutional_quotes>;
export declare const storeOrderRequest: (context: GraphQLContext, orderId: string, sourceWalletAssetId: string, targetWalletAssetId: string, institutional_quote: institutional_quotes) => Promise<orders>;
export declare const fxOrderResponse: (yoga: Yoga, data: any) => Promise<void>;
export declare const fxOrderNotification: (yoga: Yoga, data: any) => Promise<void>;
export declare const updateOrder: (prisma: PrismaClient, orderId: string, data: Record<string, any>) => Promise<orders & {
    sourceWalletAssets: import(".prisma/client").walletAssets;
}>;
export declare const getOrderById: (prisma: PrismaClient, orderId: string) => Promise<orders>;
export declare const getAssetBalanceType: (prisma: PrismaClient, type: string) => Promise<{
    balanceTypeId: number;
}>;
export declare const getSourceWalletAssetByWallet: (prisma: PrismaClient, walletId: string, quote: institutional_quotes, balanceTypeId: number) => Promise<import(".prisma/client").walletAssets>;
export declare const getTargetWalletAssetByWallet: (prisma: PrismaClient, walletId: string, quote: institutional_quotes, balanceTypeId: number) => Promise<import(".prisma/client").walletAssets>;
export declare const getWalletAssetByID: (prisma: PrismaClient, walletAssetId: string) => Promise<import(".prisma/client").walletAssets & {
    assets: import(".prisma/client").institutional_assets;
}>;
export declare const createTransaction: (prisma: PrismaClient, sourceWallet: string, targetWallet: string, sourceBalanceType: number, targetBalanceType: number, assetId: number, quantity: string, parentTransactionID: string | null, userID: string, updateBy: string, type: enum_transactionType) => Promise<import(".prisma/client").public_transactions>;
export declare const createAssetTrade: (prisma: PrismaClient, tradeOrderId: string, transactionID: string) => Promise<import(".prisma/client").assetTrade>;
export declare const reservedToLPsettlement1Transfer: (yoga: Yoga, reservedWalletAssetId: string, order: orders) => Promise<void>;
export declare const targetAssetLPsettlement1Transfer: (yoga: Yoga, order: orders) => Promise<void>;
export declare const LPsettlement1ToUserWalletTransfer: (yoga: Yoga, order: orders) => Promise<string>;
export declare const tradeFeeLPS1tobssRevenueTransfer: (yoga: Yoga, order: orders, tradeFee: string) => Promise<void>;
export declare const spreadFeeLPS1toqeSpreadRevenueTransfer: (yoga: Yoga, order: orders) => Promise<void>;
