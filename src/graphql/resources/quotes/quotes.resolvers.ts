import { Repeater } from "graphql-yoga";
import { GraphQLError } from "graphql/index";
import { v4 as uuidv4 } from "uuid";
import { institutional_quotes } from "@connectfinancial/prisma-database";
import { authResolvers } from "../../../composable/auth.resolver";
import { compose } from "../../../composable/composable.resolver";
import { GraphQLContext } from "../../../context";
import { EligibleTradeAsset, Order, OrderQueue, Quote, QuoteQueue } from "../../../types";
import {
  fxOrderPayload,
  fxSubscribePriceFeed,
  getAssetBalanceType,
  getQuoteById,
  getSourceWalletAssetByWallet,
  getTargetWalletAssetByWallet,
  storeOrderRequest,
  storeQuoteRequest,
  updateQuote,
  createFXheaders,
  getOrderById,
  updateOrder,
  reservedToLPsettlement1Transfer,
  targetAssetLPsettlement1Transfer,
  LPsettlement1ToUserWalletTransfer,
  tradeFeeLPS1tobssRevenueTransfer,
  spreadFeeLPS1toqeSpreadRevenueTransfer,
} from "./utils";

export const quotesResolvers = {
  Query: {
    getTokenPairs: compose(...authResolvers)(async (parent, {}, context) => {
      try {
        const tokenPairs = (await context.yoga.prisma.eligibleTradeAssets.findMany({
          include: {
            assets: true,
          },
        })) as Array<EligibleTradeAsset>;
        return tokenPairs;
      } catch (err) {
        context.yoga.logger.error(err);
        return Promise.reject(new GraphQLError((err as Error).message));
      }
    }),
  },
  Mutation: {
    createQuote: compose(...authResolvers)(
      async (
        parent: unknown,
        args: {
          baseToken: string;
          quoteToken: string;
          quantity: string;
          source: string;
          quantityToken: string;
        },
        context: GraphQLContext,
      ) => {
        try {
          const quote = await storeQuoteRequest(
            context.yoga.prisma,
            args.baseToken,
            args.quoteToken,
            args.quantity,
            args.source,
            context.currentUser?.userId as string,
          );
          const tokenPair = await context.yoga.prisma.tokenPairs.findFirst({
            select: {
              queueTableName: true,
              vendors: {
                select: {
                  name: true,
                },
              },
            },
            where: {
              id: quote?.tokenPairId,
            },
          });
          switch (tokenPair.vendors.name) {
            case "FalconX":
              context.yoga.feedStreamingClient.io.opts.extraHeaders = createFXheaders(
                context.yoga.FXapiKey,
                context.yoga.FXapiSecret,
                context.yoga.FXapiPassPhrase
              );
              context.yoga.feedStreamingClient.connect();
              const falconXPayload = await fxSubscribePriceFeed(
                context.yoga.prisma,
                args.baseToken,
                args.quoteToken,
                args.quantity,
                quote?.id,
              );
              context.yoga.feedStreamingClient.emit("subscribe", falconXPayload);
              break;

            case "Uniswap":
              await context.yoga.clients.UNISWAP_API_SERVICE.post("/getQuote", {
                id: quote?.id,
                quantityToken: args.quantityToken,
              });
              break;
          }
          context.yoga.pubSub.publish(tokenPair?.queueTableName as string, quote?.id, {
            id: quote.id,
            quoteStatusId: quote.quoteStatusId,
            sourceAssetId: quote.sourceAssetId,
            targetAssetId: quote.targetAssetId,
            side: quote.side,
            userId: quote.userId,
            vendorId: quote.vendorId,
            createdAt: quote.createdAt,
            updatedAt: quote.updatedAt,
            buyPrice: "0",
            sellPrice: "0",
            quantity: quote.quantity,
          });
          return { quoteId: quote?.id } as Quote;
        } catch (err: Error | any) {
          context.yoga.logger.error(err);
          if (err?.isAxiosError) {
            return Promise.reject(new GraphQLError(err.response.data.message));
          }
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
    executeQuote: compose(...authResolvers)(
      async (
        parent: unknown,
        args: {
          walletId: string;
          quoteId: string;
        },
        context: GraphQLContext,
      ) => {
        try {
          const quote = await getQuoteById(context.yoga.prisma, args?.quoteId);
          const tokenPair = await context.yoga.prisma.tokenPairs.findFirst({
            select: {
              queueTableName: true,
              vendors: {
                select: {
                  name: true,
                },
              },
            },
            where: {
              id: quote?.tokenPairId,
            },
          });

          const availableBalanceType = await getAssetBalanceType(context.yoga.prisma, "Available");
          const reservedBalanceType = await getAssetBalanceType(context.yoga.prisma, "Reserved");
          const availableSourceWalletAsset = await getSourceWalletAssetByWallet(
            context.yoga.prisma,
            args?.walletId,
            quote,
            availableBalanceType.balanceTypeId,
          );
          context.yoga.logger.info(availableSourceWalletAsset, "availableSourceWalletAsset");
          const availableTargetWalletAsset = await getTargetWalletAssetByWallet(
            context.yoga.prisma,
            args?.walletId,
            quote,
            availableBalanceType.balanceTypeId,
          );
          context.yoga.logger.info(availableTargetWalletAsset, "availableTargetWalletAsset");
          const orderId = uuidv4();
          const order = await storeOrderRequest(
            context,
            orderId,
            availableSourceWalletAsset.walletAssetsID,
            availableTargetWalletAsset.walletAssetsID,
            quote,
          );
          context.yoga.logger.info(order, "order");
          await updateQuote(context.yoga.prisma, quote?.id, {
            quoteStatusId: 10,
          });
          if (availableSourceWalletAsset) {
            if (
              availableSourceWalletAsset.balance &&
              Number(availableSourceWalletAsset.balance) >= Number(quote?.quantity)
            ) {
              await context.yoga.clients.TRANSACTIONS_API_SERVICE.post("/balanceAdjustment", {
                userId: context.currentUser.userId,
                walletID: availableSourceWalletAsset.walletId,
                assetID: availableSourceWalletAsset.assetsId,
                quantity: order.userAcceptedQuantity,
                sourceBalanceType: availableBalanceType.balanceTypeId,
                targetBalanceType: reservedBalanceType.balanceTypeId,
                parentTransactionID: order.transactionId,
              });
              switch (tokenPair.vendors.name) {
                case "FalconX":
                  const orderPayload = await fxOrderPayload(context.yoga.prisma, quote, orderId);
                  context.yoga.logger.info(orderPayload, "orderPayload");
                  context.yoga.orderReqClient.io.opts.extraHeaders = createFXheaders(
                    context.yoga.FXapiKey,
                    context.yoga.FXapiSecret,
                    context.yoga.FXapiPassPhrase
                  );
                  context.yoga.orderReqClient.connect();
                  context.yoga.orderReqClient.emit("request", orderPayload);
                  break;

                case "Uniswap":
                  const uniswapOrder:any = await context.yoga.clients.UNISWAP_API_SERVICE.post("/executeQuote", {
                    id: order?.id,
                  });
                  if (uniswapOrder.data) {
                      const reservedBalanceType = await getAssetBalanceType(
                        context.yoga.prisma,
                        "Reserved"
                      );
                      const order = await getOrderById(context.yoga.prisma, uniswapOrder.data.client_order_id);
                      await updateQuote(context.yoga.prisma, order?.quoteId as string, {
                        quoteStatusId: 11,
                      });
                      const updatedOrder = await updateOrder(
                        context.yoga.prisma,
                        uniswapOrder.data.client_order_id,
                        {
                          orderStatus: '',
                          orderQuantityExecuted: '',
                          orderPriceExecuted: '',
                          orderTimestampExecuted: new Date(),
                          orderVendorStatus: '',
                        }
                      );
                      const availableSourceWalletAsset =
                        await context.yoga.prisma.walletAssets.findFirst({
                          where: {
                            walletAssetsID: updatedOrder.sourceWalletAssetId,
                          },
                        });
                      const reservedSourceWalletAsset =
                        await context.yoga.prisma.walletAssets.findFirst({
                          where: {
                            walletId: availableSourceWalletAsset.walletId,
                            assetsId: availableSourceWalletAsset.assetsId,
                            balanceType: reservedBalanceType.balanceTypeId,
                          },
                        });
                      await reservedToLPsettlement1Transfer(
                        context.yoga,
                        reservedSourceWalletAsset.walletAssetsID,
                        updatedOrder
                      );
                      await targetAssetLPsettlement1Transfer(context.yoga, updatedOrder);
                      const tradeFee = await LPsettlement1ToUserWalletTransfer(
                        context.yoga,
                        updatedOrder
                      );
                      await tradeFeeLPS1tobssRevenueTransfer(context.yoga, updatedOrder, tradeFee);
                      await spreadFeeLPS1toqeSpreadRevenueTransfer(context.yoga, updatedOrder);
                    }
                  break;
              }

              return { orderId: order?.id } as Order;
            }
            return Promise.reject(new GraphQLError("Error: Insufficient Funds"));
          }
          return Promise.reject(new GraphQLError("Error: Invalid wallet"));
        } catch (err: Error | any) {
          context.yoga.logger.error(err);
          if (err?.isAxiosError) {
            return Promise.reject(new GraphQLError(err.response.data.message));
          }
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
    getOrder: compose(...authResolvers)(
      async (
        parent: unknown,
        args: {
          orderId: string;
        },
        context: GraphQLContext,
      ) => {
        try {
          const order = await context.yoga.prisma.orders.findFirst({
            select: {
              id: true,
              orderStatus: true,
              updatedAt: true,
              orderPriceExecuted: true,
              userAcceptedPrice: true,
            },
            where: {
              id: args.orderId,
            },
          });
          return order as OrderQueue;
        } catch (err) {
          context.yoga.logger.error(err);
          return Promise.reject(new GraphQLError((err as Error).message));
        }
      },
    ),
  },
  Subscription: {
    getQuote: {
      subscribe: async (parent: unknown, args: { quoteId: string }, context: GraphQLContext) =>
        await getQuote(args.quoteId, context),
      resolve: async (quote: institutional_quotes) => await resolveGetQuote(quote),
    },
  },
};

const getQuote = async (quoteId: string, context: GraphQLContext) => {
  if (context.currentUser === null) {
    return Promise.reject(new GraphQLError("Unauthorized"));
  }
  return getdbQuote(quoteId, context);
};

const getdbQuote = async (quoteId: string, context: GraphQLContext) => {
  return new Repeater(async (push, stop) => {
    async function quote() {
      const quote = await context.yoga.prisma.institutional_quotes.findFirst({
        include: {
          tokenPairs: true,
        },
        where: {
          id: quoteId,
        },
      });
      push(quote);
    }
    quote();
    const interval = setInterval(quote, 1000);
    stop.then(() => {
      clearInterval(interval);
    });
  });
};

const resolveGetQuote = async (quote: any) => {
  return {
    id: quote?.id,
    side: quote?.side,
    quantity: quote?.quantity,
    spreadFee: quote?.spreadFee,
    userQuotePrice: quote?.userQuotePrice,
    finalQuoteValue: quote?.finalQuoteValue,
    updatedAt: quote?.updatedAt,
    baseToken: quote?.tokenPairs.baseToken,
    quoteToken: quote?.tokenPairs?.quoteToken,
  } as QuoteQueue;
};
