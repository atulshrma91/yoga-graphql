import { Yoga } from "../../../app";
import { GraphQLContext } from "../../../context";
import {
  institutional_quotes,
  institutional_enum_quotes_side,
  PrismaClient,
  orders,
  enum_tokenPairs_tradeSide,
  enum_orders_userAcceptedSide,
 enum_transactionType } from "@connectfinancial/prisma-database";
import hmacSHA256 from "crypto-js/hmac-sha256";
import Base64 from "crypto-js/enc-base64";
import { v4 as uuidv4, v5 as uuidv5 } from "uuid";
import { calNumbers } from "@connectfinancial/utils/dist/FixedNumberHelper";

export const createFXheaders = (
  fxApiKey: string,
  fxApiSecret: string,
  fxApiPassPhrase: string
): Record<string, string | number> => {
  const timestamp = new Date().getTime() / 1000;
  const message = timestamp + "GET" + "/socket.io/";
  const hmacKey = Base64.parse(fxApiSecret);
  const signature = hmacSHA256(message, hmacKey);
  const signatureB64 = signature.toString(Base64);
  return {
    "FX-ACCESS-SIGN": signatureB64,
    "FX-ACCESS-TIMESTAMP": timestamp,
    "FX-ACCESS-KEY": fxApiKey,
    "FX-ACCESS-PASSPHRASE": fxApiPassPhrase,
    "Content-Type": "application/json",
    "Sec-Webscoket-Key": "application/json",
  };
};

/**
 * Get falconx payload
 * @param {PrismaClient} prisma
 * @param {String} baseToken
 * @param {String} quoteToken
 * @param {String} quantity
 * @param {String} quoteId
 */
export const fxSubscribePriceFeed = async (
  prisma: PrismaClient,
  baseToken: string,
  quoteToken: string,
  quantity: string,
  quoteId: string
) => {
  try {
    const vendor = await prisma.institutional_vendors.findFirst({
      select: {
        id: true,
        identifier: true,
      },
      where: {
        identifier: "FX",
      },
    });
    const falconXtokenPair = await prisma.tokenPairs.findFirst({
      select: {
        id: true,
        baseToken: true,
        quoteToken: true,
        baseTokenPair: true,
      },
      where: {
        baseToken,
        quoteToken,
        vendorId: vendor?.id,
      },
    });
    if (falconXtokenPair) {
      let falconXPayload;
      if (falconXtokenPair.baseTokenPair) {
        const falconXBasetokenPair = await prisma.tokenPairs.findFirst({
          select: {
            id: true,
            baseToken: true,
            quoteToken: true,
          },
          where: {
            id: falconXtokenPair.baseTokenPair,
          },
        });
        falconXPayload = {
          token_pair: {
            base_token: falconXBasetokenPair?.baseToken,
            quote_token: falconXBasetokenPair?.quoteToken,
          },
          echo_id: true,
          quantity: [Number(quantity)],
          quantity_token: falconXBasetokenPair?.quoteToken,
          client_request_id: quoteId,
        };
      } else {
        falconXPayload = {
          token_pair: {
            base_token: falconXtokenPair.baseToken,
            quote_token: falconXtokenPair.quoteToken,
          },
          echo_id: true,
          quantity: [Number(quantity)],
          client_request_id: quoteId,
        };
      }
      return falconXPayload;
    }
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const fxUnsubscribePriceFeed = async (
  prisma: PrismaClient,
  quote: institutional_quotes
) => {
  try {
    const vendor = await prisma.institutional_vendors.findFirst({
      select: {
        id: true,
        identifier: true,
      },
      where: {
        identifier: "FX",
      },
    });
    const sourceAsset = await prisma.institutional_assets.findFirst({
      where: {
        id: quote.sourceAssetId,
      },
    });
    const targetAsset = await prisma.institutional_assets.findFirst({
      where: {
        id: quote.targetAssetId,
      },
    });
    const falconXtokenPair = await prisma.tokenPairs.findFirst({
      select: {
        id: true,
        baseToken: true,
        quoteToken: true,
        baseTokenPair: true,
      },
      where: {
        baseToken: sourceAsset.ticker,
        quoteToken: targetAsset.ticker,
        vendorId: vendor?.id,
      },
    });
    if (falconXtokenPair) {
      let falconXPayload;
      if (falconXtokenPair.baseTokenPair) {
        const falconXBasetokenPair = await prisma.tokenPairs.findFirst({
          select: {
            id: true,
            baseToken: true,
            quoteToken: true,
          },
          where: {
            id: falconXtokenPair.baseTokenPair,
          },
        });
        falconXPayload = {
          token_pair: {
            base_token: falconXBasetokenPair?.baseToken,
            quote_token: falconXBasetokenPair?.quoteToken,
          },
          client_request_id: quote.id,
        };
      } else {
        falconXPayload = {
          token_pair: {
            base_token: falconXtokenPair.baseToken,
            quote_token: falconXtokenPair.quoteToken,
          },
          client_request_id: quote.id,
        };
      }
      return falconXPayload;
    }
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

/**
 * Streams falconx feed into redis
 * @param {Yoga} yoga
 * @param {Object} data
 * @return {Promise<string>}
 */
export const storePriceFeed = async (
  yoga: Yoga,
  data: Array<Record<string, any>>
): Promise<void> => {
  try {
    for (const feed of data) {
      const quote = await yoga.prisma.institutional_quotes.findFirst({
        include: {
          assets_quotes_sourceAssetIdToassets: true,
          tokenPairs: true,
          organizations: {
            include: {
              pricingPlans: true,
            },
          },
        },
        where: {
          id: feed.client_request_id,
        },
      });
      if (quote && quote.quantity === feed.quantity.value) {
        const diffInSec = calNumbers().divFixedNumber(
          calNumbers().subFixedNumber(
            new Date(feed.t_create).getTime(),
            new Date(quote.createdAt).getTime()
          )._value,
          1000
        )._value;
        if (Number(diffInSec) > 40) {
          const falconXPayload = await fxUnsubscribePriceFeed(
            yoga.prisma,
            quote
          );
          yoga.logger.info(falconXPayload);
          yoga.feedStreamingClient.emit("unsubscribe", falconXPayload);
          yoga.feedStreamingClient.disconnect();
        }
        let updateQuote: institutional_quotes;
        let userQuotePrice: string;
        if (quote.side === "BUY") {
          const spreadFee = calNumbers().mulFixedNumber(
            feed.buy_price.value,
            calNumbers().divFixedNumber(
              quote?.organizations.pricingPlans.price,
              10000
            )._value
          )._value;
          userQuotePrice = calNumbers().addFixedNumber(
            feed.buy_price.value,
            spreadFee
          )._value;
          updateQuote = await yoga.prisma.institutional_quotes.update({
            where: {
              id: quote.id,
            },
            data: {
              rawQuotePrice: feed.buy_price.value,
              spreadFee,
              userQuotePrice,
              finalQuoteValue: calNumbers().divFixedNumber(
                quote.quantity,
                userQuotePrice
              )._value,
              updatedAt: new Date(feed.t_create).toISOString(),
              quoteStatusId: 8,
            },
          });
        } else {
          const spreadFee = calNumbers().mulFixedNumber(
            feed.sell_price.value,
            calNumbers().divFixedNumber(
              quote?.organizations.pricingPlans.price,
              10000
            )._value
          )._value;
          userQuotePrice = calNumbers().subFixedNumber(
            feed.sell_price.value,
            spreadFee
          )._value;
          updateQuote = await yoga.prisma.institutional_quotes.update({
            where: {
              id: quote.id,
            },
            data: {
              rawQuotePrice: feed.sell_price.value,
              spreadFee,
              userQuotePrice,
              finalQuoteValue: calNumbers().mulFixedNumber(
                userQuotePrice,
                quote.quantity
              )._value,
              updatedAt: new Date(feed.t_create).toISOString(),
              quoteStatusId: 8,
            },
          });
        }
        yoga.pubSub.publish(
          quote?.tokenPairs?.queueTableName as string,
          quote.id,
          {
            id: updateQuote.id,
            quoteStatusId: updateQuote.quoteStatusId,
            sourceAssetId: updateQuote.sourceAssetId,
            targetAssetId: updateQuote.targetAssetId,
            side: updateQuote.side,
            userId: updateQuote.userId,
            vendorId: updateQuote.vendorId,
            createdAt: updateQuote.createdAt,
            updatedAt: updateQuote.updatedAt,
            buyPrice: feed.buy_price.value,
            sellPrice: feed.sell_price.value,
            quantity: updateQuote.quantity,
          }
        );
      }
    }
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

/**
 * Store user quote request
 * @param {PrismaClient} prisma
 * @param {String} baseToken
 * @param {String} quoteToken
 * @param {String} quantity
 * @param {String} userId
 */
export const storeQuoteRequest = async (
  prisma: PrismaClient,
  baseToken: string,
  quoteToken: string,
  quantity: string,
  source: string,
  userId: string
) => {
  try {
    const sourceAsset = await prisma.institutional_assets.findFirst({
      where: {
        ticker: baseToken,
      },
    });
    const targetAsset = await prisma.institutional_assets.findFirst({
      where: {
        ticker: quoteToken,
      },
    });
    const tokenPair = await prisma.tokenPairs.findFirst({
      include: {
        vendors: true,
      },
      where: {
        baseToken,
        quoteToken,
      },
    });
    const organization = await prisma.organizations.findFirst({
      where: {
        name: {
          contains: source,
          mode: "insensitive",
        },
      },
    });
    const quote = (await prisma.institutional_quotes.create({
      data: {
        id: uuidv4(),
        quoteStatusId: 1,
        sourceAssetId: sourceAsset?.id as number,
        targetAssetId: targetAsset?.id as number,
        side: tokenPair?.tradeSide as institutional_enum_quotes_side,
        userId,
        vendorId: tokenPair.vendors.id,
        extraData: {},
        error: {},
        rawQuotePrice: "0",
        spreadFee: "0",
        userQuotePrice: "0",
        finalQuoteValue: "0",
        quantity,
        tokenPairId: tokenPair?.id as number,
        organizationId: organization?.id as number,
      },
    })) as institutional_quotes;
    return quote;
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

/**
 * Get user quote request by id
 * @param {PrismaClient} prisma
 * @param {String} quoteId
 */
export const getQuoteById = async (prisma: PrismaClient, quoteId: string) => {
  try {
    const quote = await prisma.institutional_quotes.findFirst({
      where: {
        id: quoteId,
      },
    });
    return quote;
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

/**
 * Create to falconx order payload
 * @param {PrismaClient} prisma
 * @param {Object} quote
 */
export const fxOrderPayload = async (
  prisma: PrismaClient,
  quote: institutional_quotes | null,
  orderId: string
) => {
  try {
    const falconXtokenPair = await prisma.tokenPairs.findFirst({
      where: {
        id: quote?.tokenPairId,
      },
    });
    if (falconXtokenPair) {
      let falconXPayload;
      if (falconXtokenPair.baseTokenPair) {
        const falconXBasetokenPair = await prisma.tokenPairs.findFirst({
          select: {
            id: true,
            baseToken: true,
            quoteToken: true,
          },
          where: {
            id: falconXtokenPair.baseTokenPair,
          },
        });
        falconXPayload = {
          message_type: "CREATE_ORDER_REQUEST",
          client_order_id: orderId,
          client_request_id: quote?.id,
          token_pair: {
            base_token: falconXBasetokenPair?.baseToken,
            quote_token: falconXBasetokenPair?.quoteToken,
          },
          quantity: {
            token: falconXBasetokenPair?.baseToken,
            value: Number(quote?.finalQuoteValue).toFixed(8),
          },
          side: quote?.side?.toLowerCase(),
          limit_price: quote?.rawQuotePrice,
          time_in_force: "fok",
          //todo - slippage_bps
          slippage_bps: "5",
        };
      } else {
        falconXPayload = {
          message_type: "CREATE_ORDER_REQUEST",
          client_order_id: orderId,
          client_request_id: quote?.id,
          token_pair: {
            base_token: falconXtokenPair?.baseToken,
            quote_token: falconXtokenPair?.quoteToken,
          },
          quantity: {
            token: falconXtokenPair?.baseToken,
            value: quote?.quantity as string,
          },
          side: quote?.side?.toLowerCase(),
          limit_price: quote?.rawQuotePrice,
          time_in_force: "fok",
          //todo - slippage_bps
          slippage_bps: "5",
        };
      }
      return falconXPayload;
    }
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

/**
 * Update user quote status
 * @param {PrismaClient} prisma
 * @param {string} quoteId
 * @param {Object} data
 */
export const updateQuote = async (
  prisma: PrismaClient,
  quoteId: string | undefined,
  data: Record<string, any>
) => {
  try {
    const quote = await prisma.institutional_quotes.update({
      where: {
        id: quoteId,
      },
      data,
    });
    return quote;
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};
/**
 * Store user order request
 * @param {GraphQLContext} context
 * @param {Object} data
 */
export const storeOrderRequest = async (
  context: GraphQLContext,
  orderId: string,
  sourceWalletAssetId: string,
  targetWalletAssetId: string,
  institutional_quote: institutional_quotes
) => {
  try {
    const vendor = await context.yoga.prisma.institutional_vendors.findFirst({
      select: {
        id: true,
      },
      where: {
        identifier: "FX",
      },
    });

    const sourceWalletAsset = await getWalletAssetByID(
      context.yoga.prisma,
      sourceWalletAssetId
    );
    const targetWalletAsset = await getWalletAssetByID(
      context.yoga.prisma,
      targetWalletAssetId
    );
    const transaction = await createTransaction(
      context.yoga.prisma,
      sourceWalletAsset.walletId,
      targetWalletAsset.walletId,
      sourceWalletAsset.balanceType,
      targetWalletAsset.balanceType,
      sourceWalletAsset.assetsId,
      institutional_quote?.quantity,
      null,
      context.currentUser.userId,
      context.currentUser.userId,
      enum_transactionType.assetTrade
    );
    const assetTrade = await createAssetTrade(
      context.yoga.prisma,
      uuidv4(),
      transaction.transactionID
    );
    const quote = await getQuoteById(
      context.yoga.prisma,
      institutional_quote.id
    );
    const order = await context.yoga.prisma.orders.create({
      data: {
        id: orderId,
        quoteId: quote.id,
        transactionId: assetTrade.tradeOrderId,
        userId: context.currentUser.userId,
        sourceWalletAssetId: sourceWalletAsset.walletAssetsID,
        targetWalletAssetId: targetWalletAsset.walletAssetsID,
        vendorId: vendor.id,
        orderStatus: "processing",
        userAcceptedPrice: institutional_quote?.userQuotePrice,
        userAcceptedQuantity: institutional_quote.quantity,
        userExpectedQuantity: institutional_quote.finalQuoteValue,
        userAcceptedSide:
          institutional_quote?.side.toUpperCase() as enum_orders_userAcceptedSide,
        userAcceptedTradePair: {
          base_token:
            sourceWalletAsset.assets.type === "fiat"
              ? sourceWalletAsset.assets.ticker
              : sourceWalletAsset.assets.fireblocksTicker,
          quote_token:
            targetWalletAsset.assets.type === "fiat"
              ? targetWalletAsset.assets.ticker
              : targetWalletAsset.assets.fireblocksTicker,
        },
        userAcceptedTimestamp: new Date(Date.now()),
        allowedSlippage: null,
      },
    });
    context.yoga.pubSub.publish("orders", order.id, order);
    return order;
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

/**
 * Store FalconX order Response
 * @param {Yoga} yoga
 * @param {Object} data
 */
export const fxOrderResponse = async (yoga: Yoga, data: any) => {
  try {
    const quote = await getQuoteById(yoga.prisma, data?.client_request_id);
    if (data.message_type === "CREATE_ORDER_RESPONSE") {
      if (data.success === false) {
        await updateQuote(yoga.prisma, quote?.id, {
          quoteStatusId: 12,
          error: data?.error,
        });
        const order = await updateOrder(yoga.prisma, data?.client_order_id, {
          orderStatus: "failed",
        });
        const availableBalanceType = await getAssetBalanceType(
          yoga.prisma,
          "Available"
        );
        const reservedBalanceType = await getAssetBalanceType(
          yoga.prisma,
          "Reserved"
        );
        await yoga.clients.TRANSACTIONS_API_SERVICE.post("/balanceAdjustment", {
          userId: order.userId,
          walletID: order.sourceWalletAssets.walletId,
          assetID: order.sourceWalletAssets.assetsId,
          quantity: order.userAcceptedQuantity,
          sourceBalanceType: reservedBalanceType.balanceTypeId,
          targetBalanceType: availableBalanceType.balanceTypeId,
          parentTransactionID: order.transactionId,
        });
        yoga.pubSub.publish("orders", order.id, order);
      } else {
        const order = await updateOrder(yoga.prisma, data?.client_order_id, {
          orderStatus: data?.status,
          orderType: data?.order_type.toUpperCase(),
          orderTimeInForce: data?.time_in_force,
          vendorQuoteId: data?.fx_quote_id,
          vendorQuantityRequested: data?.quantity.value,
          vendorPriceRequested: data?.limit_price,
          orderVendorStatus: data?.status,
        });
        yoga.pubSub.publish("orders", order.id, order);
      }
    }
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

/**
 * Store FalconX order Response
 * @param {Yoga} yoga
 * @param {Object} data
 */
export const fxOrderNotification = async (yoga: Yoga, data: any) => {
  try {
    const availableBalanceType = await getAssetBalanceType(
      yoga.prisma,
      "Available"
    );
    const reservedBalanceType = await getAssetBalanceType(
      yoga.prisma,
      "Reserved"
    );
    if (data.message_type === "FILL_ORDER_NOTIFICATION" && data.status === "success" && data.error === null) {
        const order = await getOrderById(yoga.prisma, data?.client_order_id);
        await updateQuote(yoga.prisma, order?.quoteId as string, {
          quoteStatusId: 11,
        });
        const updatedOrder = await updateOrder(
          yoga.prisma,
          data?.client_order_id,
          {
            orderStatus: data?.status,
            orderQuantityExecuted: data?.quantity.value,
            orderPriceExecuted: data?.executed_price,
            orderTimestampExecuted: new Date(data?.t_execute),
            orderVendorStatus: data?.status,
          }
        );
        const availableSourceWalletAsset =
          await yoga.prisma.walletAssets.findFirst({
            where: {
              walletAssetsID: updatedOrder.sourceWalletAssetId,
            },
          });
        const reservedSourceWalletAsset =
          await yoga.prisma.walletAssets.findFirst({
            where: {
              walletId: availableSourceWalletAsset.walletId,
              assetsId: availableSourceWalletAsset.assetsId,
              balanceType: reservedBalanceType.balanceTypeId,
            },
          });
        await reservedToLPsettlement1Transfer(
          yoga,
          reservedSourceWalletAsset.walletAssetsID,
          updatedOrder
        );
        await targetAssetLPsettlement1Transfer(yoga, updatedOrder);
        const tradeFee = await LPsettlement1ToUserWalletTransfer(
          yoga,
          updatedOrder
        );
        await tradeFeeLPS1tobssRevenueTransfer(yoga, updatedOrder, tradeFee);
        await spreadFeeLPS1toqeSpreadRevenueTransfer(yoga, updatedOrder);
        yoga.pubSub.publish("orders", updatedOrder.id, updatedOrder);
      }
    if (data.message_type === "REJECT_ORDER_NOTIFICATION" && data.status === "rejected") {
        const order = await getOrderById(yoga.prisma, data?.client_order_id);
        await updateQuote(yoga.prisma, order?.quoteId as string, {
          quoteStatusId: 12,
        });
        const updatedOrder = await updateOrder(
          yoga.prisma,
          data?.client_order_id,
          {
            orderStatus: data?.status,
            orderQuantityExecuted: data?.quantity.value,
            orderPriceExecuted: data?.executed_price,
            orderVendorStatus: data?.status,
          }
        );
        await yoga.clients.TRANSACTIONS_API_SERVICE.post("/balanceAdjustment", {
          userId: updatedOrder.userId,
          walletID: updatedOrder.sourceWalletAssets.walletId,
          assetID: updatedOrder.sourceWalletAssets.assetsId,
          quantity: updatedOrder.userAcceptedQuantity,
          sourceBalanceType: reservedBalanceType.balanceTypeId,
          targetBalanceType: availableBalanceType.balanceTypeId,
          parentTransactionID: updatedOrder.transactionId,
        });
        yoga.pubSub.publish("orders", updatedOrder.id, updatedOrder);
      }
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

/**
 * Update user quote request
 * @param {PrismaClient} prisma
 * @param {String} orderId
 * @param {Object} data
 */
export const updateOrder = async (
  prisma: PrismaClient,
  orderId: string,
  data: Record<string, any>
) => {
  try {
    const order = await prisma.orders.update({
      where: {
        id: orderId,
      },
      data,
      include: {
        sourceWalletAssets: true,
      },
    });
    return order;
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

/**
 * Get user order by id
 * @param {PrismaClient} prisma
 * @param {String} orderId
 */
export const getOrderById = async (prisma: PrismaClient, orderId: string) => {
  try {
    const order = await prisma.orders.findFirst({
      where: {
        id: orderId,
      },
    });
    return order;
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const getAssetBalanceType = async (
  prisma: PrismaClient,
  type: string
) => {
  try {
    return await prisma.assetBalanceType.findFirst({
      select: {
        balanceTypeId: true,
      },
      where: {
        balanceTypeName: type,
      },
    });
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const getSourceWalletAssetByWallet = async (
  prisma: PrismaClient,
  walletId: string,
  quote: institutional_quotes,
  balanceTypeId: number
) => {
  try {
    const walletAsset = await prisma.walletAssets.upsert({
      where: {
        walletAssetsID: uuidv5(
          quote.sourceAssetId + "-" + balanceTypeId,
          walletId
        ),
      },
      update: {
        walletAssetsID: uuidv5(
          quote.sourceAssetId + "-" + balanceTypeId,
          walletId
        ),
      },
      create: {
        walletAssetsID: uuidv5(
          quote.sourceAssetId + "-" + balanceTypeId,
          walletId
        ),
        walletId,
        assetsId: quote.sourceAssetId,
        balance: 0,
        balanceType: balanceTypeId,
      },
    });
    return walletAsset;
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const getTargetWalletAssetByWallet = async (
  prisma: PrismaClient,
  walletId: string,
  quote: institutional_quotes,
  balanceTypeId: number
) => {
  try {
    const walletAsset = await prisma.walletAssets.upsert({
      where: {
        walletAssetsID: uuidv5(
          quote.targetAssetId + "-" + balanceTypeId,
          walletId
        ),
      },
      update: {
        walletAssetsID: uuidv5(
          quote.targetAssetId + "-" + balanceTypeId,
          walletId
        ),
      },
      create: {
        walletAssetsID: uuidv5(
          quote.targetAssetId + "-" + balanceTypeId,
          walletId
        ),
        walletId,
        assetsId: quote.targetAssetId,
        balance: 0,
        balanceType: balanceTypeId,
      },
    });
    return walletAsset;
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const getWalletAssetByID = async (
  prisma: PrismaClient,
  walletAssetId: string
) => {
  try {
    const walletAsset = await prisma.walletAssets.findFirst({
      where: {
        walletAssetsID: walletAssetId,
      },
      include: {
        assets: true,
      },
    });
    return walletAsset;
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const createTransaction = async (
  prisma: PrismaClient,
  sourceWallet: string,
  targetWallet: string,
  sourceBalanceType: number,
  targetBalanceType: number,
  assetId: number,
  quantity: string,
  parentTransactionID: string | null,
  userID: string,
  updateBy: string,
  type: enum_transactionType
) => {
  try {
    const transaction = await prisma.public_transactions.create({
      data: {
        userID,
        createdAt: new Date(),
        updatedAt: new Date(),
        updateBy,
        error: {},
        sourceWallet,
        targetWallet,
        parentTransactionID: parentTransactionID || null,
        assets_id: assetId,
        assetQuantity: quantity,
        transactionPurpose: null,
        productID: null,
        transactionCredits: null,
        userMemo: null,
        type,
        transactionFees: null,
        sourceBalanceType,
        targetBalanceType,
      },
    });
    const transactionStatusType =
      await prisma.public_transactionStatusTypes.findFirst({
        where: {
          name: "completed",
        },
      });
    await prisma.transactionStatus.create({
      data: {
        transactionID: transaction.transactionID,
        transactionStatusTypeID: transactionStatusType.transactionStatusTypeID,
      },
    });
    return transaction;
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const createAssetTrade = async (
  prisma: PrismaClient,
  tradeOrderId: string,
  transactionID: string
) => {
  try {
    const assetTrade = await prisma.assetTrade.create({
      data: {
        tradeOrderId,
        transactionID,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return assetTrade;
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const reservedToLPsettlement1Transfer = async (
  yoga: Yoga,
  reservedWalletAssetId: string,
  order: orders
) => {
  try {
    const reservedWalletAsset = await yoga.prisma.walletAssets.findFirst({
      where: {
        walletAssetsID: reservedWalletAssetId,
      },
    });
    const lpSettlement1Wallet = await yoga.prisma.wallets.findFirst({
      where: {
        walletName: "lpSettlement1",
      },
    });
    const availableBalanceType = await getAssetBalanceType(
      yoga.prisma,
      "Available"
    );
    const balance = calNumbers().subFixedNumber(
      Number(reservedWalletAsset.balance),
      Number(order.userAcceptedQuantity)
    )._value;
    await yoga.prisma.walletAssets.update({
      data: {
        balance,
      },
      where: {
        walletAssetsID: reservedWalletAsset.walletAssetsID,
      },
    });
    const lpSettlement1WalletAsset = await yoga.prisma.walletAssets.upsert({
      where: {
        walletAssetsID: uuidv5(
          reservedWalletAsset.assetsId +
            "-" +
            availableBalanceType.balanceTypeId,
          lpSettlement1Wallet.walletsID
        ),
      },
      update: {
        balance: Number(order.userAcceptedQuantity),
      },
      create: {
        walletAssetsID: uuidv5(
          reservedWalletAsset.assetsId +
            "-" +
            availableBalanceType.balanceTypeId,
          lpSettlement1Wallet.walletsID
        ),
        walletId: lpSettlement1Wallet.walletsID,
        assetsId: reservedWalletAsset.assetsId,
        balanceType: availableBalanceType.balanceTypeId,
        balance: Number(order.userAcceptedQuantity),
      },
    });
    const assetTrade = await yoga.prisma.assetTrade.findFirst({
      where: {
        tradeOrderId: order.transactionId,
      },
    });
    await createTransaction(
      yoga.prisma,
      reservedWalletAsset.walletId,
      lpSettlement1WalletAsset.walletId,
      reservedWalletAsset.balanceType,
      lpSettlement1WalletAsset.balanceType,
      reservedWalletAsset.assetsId,
      order?.userAcceptedQuantity,
      assetTrade.transactionID,
      order.userId,
      order.userId,
      enum_transactionType.internalWalletTransfer
    );
    yoga.logger.info("reservedToLPsettlement1Transfer completed");
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const targetAssetLPsettlement1Transfer = async (
  yoga: Yoga,
  order: orders
) => {
  try {
    const availableTargetWalletAsset = await yoga.prisma.walletAssets.findFirst(
      {
        where: {
          walletAssetsID: order.targetWalletAssetId,
        },
      }
    );
    const lpSettlement1Wallet = await yoga.prisma.wallets.findFirst({
      where: {
        walletName: "lpSettlement1",
      },
    });
    const availableBalanceType = await getAssetBalanceType(
      yoga.prisma,
      "Available"
    );
    const balance = calNumbers().mulFixedNumber(
      order.orderQuantityExecuted,
      order.orderPriceExecuted
    )._value;
    const lpSettlement1TargetWalletAsset =
      await yoga.prisma.walletAssets.upsert({
        where: {
          walletAssetsID: uuidv5(
            availableTargetWalletAsset.assetsId +
              "-" +
              availableBalanceType.balanceTypeId,
            lpSettlement1Wallet.walletsID
          ),
        },
        update: {
          balance,
        },
        create: {
          walletAssetsID: uuidv5(
            availableTargetWalletAsset.assetsId +
              "-" +
              availableBalanceType.balanceTypeId,
            lpSettlement1Wallet.walletsID
          ),
          walletId: lpSettlement1Wallet.walletsID,
          assetsId: availableTargetWalletAsset.assetsId,
          balanceType: availableBalanceType.balanceTypeId,
          balance,
        },
      });
    const assetTrade = await yoga.prisma.assetTrade.findFirst({
      where: {
        tradeOrderId: order.transactionId,
      },
    });
    await createTransaction(
      yoga.prisma,
      availableTargetWalletAsset.walletId,
      lpSettlement1TargetWalletAsset.walletId,
      availableTargetWalletAsset.balanceType,
      lpSettlement1TargetWalletAsset.balanceType,
      availableTargetWalletAsset.assetsId,
      order?.userAcceptedQuantity,
      assetTrade.transactionID,
      order.userId,
      order.userId,
      enum_transactionType.ledgerAdjustment
    );
    yoga.logger.info("targetAssetLPsettlement1Transfer completed");
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const LPsettlement1ToUserWalletTransfer = async (
  yoga: Yoga,
  order: orders
) => {
  try {
    const availableTargetWalletAsset = await yoga.prisma.walletAssets.findFirst(
      {
        where: {
          walletAssetsID: order.targetWalletAssetId,
        },
      }
    );
    const lpSettlement1Wallet = await yoga.prisma.wallets.findFirst({
      where: {
        walletName: "lpSettlement1",
      },
    });
    const availableBalanceType = await getAssetBalanceType(
      yoga.prisma,
      "Available"
    );
    const lpSettlement1WalletAsset = await yoga.prisma.walletAssets.findFirst({
      where: {
        walletAssetsID: uuidv5(
          availableTargetWalletAsset.assetsId +
            "-" +
            availableBalanceType.balanceTypeId,
          lpSettlement1Wallet.walletsID
        ),
      },
    });
    const balance = calNumbers().mulFixedNumber(
      order.userAcceptedPrice,
      order.userAcceptedQuantity
    )._value;
    const tradeFeePercentage = 1.5;
    const tradeFee = calNumbers().divFixedNumber(
      calNumbers().mulFixedNumber(
        calNumbers().mulFixedNumber(
          order.orderPriceExecuted,
          order.orderQuantityExecuted
        )._value,
        tradeFeePercentage
      )._value,
      100
    )._value;
    let userTargetAssetBalance: string;
    if (order.userAcceptedSide === enum_tokenPairs_tradeSide.BUY) {
      userTargetAssetBalance = calNumbers().subFixedNumber(
        order.orderQuantityExecuted,
        tradeFee
      )._value;
    } else {
      userTargetAssetBalance = calNumbers().subFixedNumber(
        balance,
        tradeFee
      )._value;
    }
    const lpSettlement1TargetAssetBalance = calNumbers().subFixedNumber(
      Number(lpSettlement1WalletAsset.balance),
      userTargetAssetBalance
    )._value;
    const lpSettlement1TargetWalletAsset =
      await yoga.prisma.walletAssets.upsert({
        where: {
          walletAssetsID: uuidv5(
            availableTargetWalletAsset.assetsId +
              "-" +
              availableBalanceType.balanceTypeId,
            lpSettlement1Wallet.walletsID
          ),
        },
        update: {
          balance: lpSettlement1TargetAssetBalance,
        },
        create: {
          walletAssetsID: uuidv5(
            availableTargetWalletAsset.assetsId +
              "-" +
              availableBalanceType.balanceTypeId,
            lpSettlement1Wallet.walletsID
          ),
          walletId: lpSettlement1Wallet.walletsID,
          assetsId: availableTargetWalletAsset.assetsId,
          balanceType: availableBalanceType.balanceTypeId,
          balance: lpSettlement1TargetAssetBalance,
        },
      });
    const userTargetWalletAsset = await yoga.prisma.walletAssets.update({
      where: {
        walletAssetsID: availableTargetWalletAsset.walletAssetsID,
      },
      data: {
        balance: calNumbers().addFixedNumber(
          Number(availableTargetWalletAsset.balance),
          userTargetAssetBalance
        )._value,
      },
    });
    const assetTrade = await yoga.prisma.assetTrade.findFirst({
      where: {
        tradeOrderId: order.transactionId,
      },
    });
    await createTransaction(
      yoga.prisma,
      lpSettlement1TargetWalletAsset.walletId,
      userTargetWalletAsset.walletId,
      lpSettlement1TargetWalletAsset.balanceType,
      userTargetWalletAsset.balanceType,
      lpSettlement1TargetWalletAsset.assetsId,
      order?.userAcceptedQuantity,
      assetTrade.transactionID,
      order.userId,
      order.userId,
      enum_transactionType.internalWalletTransfer
    );
    yoga.logger.info("LPsettlement1ToUserWalletTransfer completed");
    return tradeFee;
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const tradeFeeLPS1tobssRevenueTransfer = async (
  yoga: Yoga,
  order: orders,
  tradeFee: string
) => {
  try {
    const availableTargetWalletAsset = await yoga.prisma.walletAssets.findFirst(
      {
        where: {
          walletAssetsID: order.targetWalletAssetId,
        },
      }
    );
    const bssRevenueWallet = await yoga.prisma.wallets.findFirst({
      where: {
        walletName: "bssRevenue",
      },
    });
    const bssRevenueWalletAsset = await yoga.prisma.walletAssets.findFirst({
      where: {
        walletAssetsID: uuidv5(
          availableTargetWalletAsset.assetsId +
            "-" +
            availableTargetWalletAsset.balanceType,
          bssRevenueWallet.walletsID
        ),
      },
    });
    const lpSettlement1Wallet = await yoga.prisma.wallets.findFirst({
      where: {
        walletName: "lpSettlement1",
      },
    });
    const lpSettlement1WalletAsset = await yoga.prisma.walletAssets.findFirst({
      where: {
        walletAssetsID: uuidv5(
          availableTargetWalletAsset.assetsId +
            "-" +
            availableTargetWalletAsset.balanceType,
          lpSettlement1Wallet.walletsID
        ),
      },
    });
    await yoga.prisma.walletAssets.update({
      where: {
        walletAssetsID: lpSettlement1WalletAsset.walletAssetsID,
      },
      data: {
        balance: calNumbers().subFixedNumber(
          Number(lpSettlement1WalletAsset.balance),
          tradeFee
        )._value,
      },
    });
    const updatedbssRevenueWalletAsset = await yoga.prisma.walletAssets.upsert({
      where: {
        walletAssetsID: uuidv5(
          availableTargetWalletAsset.assetsId +
            "-" +
            availableTargetWalletAsset.balanceType,
          bssRevenueWallet.walletsID
        ),
      },
      update: {
        balance: calNumbers().addFixedNumber(
          bssRevenueWalletAsset ? Number(bssRevenueWalletAsset.balance) : 0,
          tradeFee
        )._value,
      },
      create: {
        walletAssetsID: uuidv5(
          availableTargetWalletAsset.assetsId +
            "-" +
            availableTargetWalletAsset.balanceType,
          bssRevenueWallet.walletsID
        ),
        walletId: bssRevenueWallet.walletsID,
        assetsId: availableTargetWalletAsset.assetsId,
        balanceType: availableTargetWalletAsset.balanceType,
        balance: tradeFee,
      },
    });

    const assetTrade = await yoga.prisma.assetTrade.findFirst({
      where: {
        tradeOrderId: order.transactionId,
      },
    });
    await createTransaction(
      yoga.prisma,
      lpSettlement1WalletAsset.walletId,
      updatedbssRevenueWalletAsset.walletId,
      lpSettlement1WalletAsset.balanceType,
      updatedbssRevenueWalletAsset.balanceType,
      lpSettlement1WalletAsset.assetsId,
      order?.userAcceptedQuantity,
      assetTrade.transactionID,
      order.userId,
      order.userId,
      enum_transactionType.internalWalletTransfer
    );
    yoga.logger.info("tradeFeeLPS1tobssRevenueTransfer completed");
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};

export const spreadFeeLPS1toqeSpreadRevenueTransfer = async (
  yoga: Yoga,
  order: orders
) => {
  try {
    const availableTargetWalletAsset = await yoga.prisma.walletAssets.findFirst(
      {
        where: {
          walletAssetsID: order.targetWalletAssetId,
        },
      }
    );
    const lpSettlement1Wallet = await yoga.prisma.wallets.findFirst({
      where: {
        walletName: "lpSettlement1",
      },
    });
    const lpSettlement1WalletAsset = await yoga.prisma.walletAssets.findFirst({
      where: {
        walletAssetsID: uuidv5(
          availableTargetWalletAsset.assetsId +
            "-" +
            availableTargetWalletAsset.balanceType,
          lpSettlement1Wallet.walletsID
        ),
      },
    });
    const orderExecutedPrice = calNumbers().mulFixedNumber(
      order.orderPriceExecuted,
      order.orderQuantityExecuted
    )._value;
    const userAcceptedPrice = calNumbers().mulFixedNumber(
      order.userAcceptedPrice,
      order.userAcceptedQuantity
    )._value;
    const spreadFee = calNumbers().subFixedNumber(
      orderExecutedPrice,
      userAcceptedPrice
    )._value;
    const qeSpreadRevenueWallet = await yoga.prisma.wallets.findFirst({
      where: {
        walletName: "qeSpreadRevenue",
      },
    });
    const qeSpreadRevenueWalletAsset = await yoga.prisma.walletAssets.findFirst(
      {
        where: {
          walletAssetsID: uuidv5(
            availableTargetWalletAsset.assetsId +
              "-" +
              availableTargetWalletAsset.balanceType,
            qeSpreadRevenueWallet.walletsID
          ),
        },
      }
    );
    await yoga.prisma.walletAssets.update({
      where: {
        walletAssetsID: lpSettlement1WalletAsset.walletAssetsID,
      },
      data: {
        balance: calNumbers().subFixedNumber(
          Number(lpSettlement1WalletAsset.balance),
          spreadFee
        )._value,
      },
    });
    const updatedqeSpreadRevenueWalletAsset =
      await yoga.prisma.walletAssets.upsert({
        where: {
          walletAssetsID: uuidv5(
            availableTargetWalletAsset.assetsId +
              "-" +
              availableTargetWalletAsset.balanceType,
            qeSpreadRevenueWallet.walletsID
          ),
        },
        update: {
          balance: calNumbers().addFixedNumber(
            qeSpreadRevenueWalletAsset
              ? Number(qeSpreadRevenueWalletAsset.balance)
              : 0,
            spreadFee
          )._value,
        },
        create: {
          walletAssetsID: uuidv5(
            availableTargetWalletAsset.assetsId +
              "-" +
              availableTargetWalletAsset.balanceType,
            qeSpreadRevenueWallet.walletsID
          ),
          walletId: qeSpreadRevenueWallet.walletsID,
          assetsId: availableTargetWalletAsset.assetsId,
          balanceType: availableTargetWalletAsset.balanceType,
          balance: spreadFee,
        },
      });

    const assetTrade = await yoga.prisma.assetTrade.findFirst({
      where: {
        tradeOrderId: order.transactionId,
      },
    });
    await createTransaction(
      yoga.prisma,
      lpSettlement1WalletAsset.walletId,
      updatedqeSpreadRevenueWalletAsset.walletId,
      lpSettlement1WalletAsset.balanceType,
      updatedqeSpreadRevenueWalletAsset.balanceType,
      lpSettlement1WalletAsset.assetsId,
      order?.userAcceptedQuantity,
      assetTrade.transactionID,
      order.userId,
      order.userId,
      enum_transactionType.internalWalletTransfer
    );
    yoga.logger.info("spreadFeeLPS1toqeSpreadRevenueTransfer completed");
  } catch (err) {
    throw new Error(`Error: ${(err as Error).message}`);
  }
};
