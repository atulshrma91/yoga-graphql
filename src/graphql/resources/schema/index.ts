import { merge } from 'lodash';
import 'reflect-metadata';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { internalWalletTransfer } from '../internalWalletTransfer/internallWalletTransfer.schema';
import { internalWalletTransferResolver } from '../internalWalletTransfer/internalWalletTransfer.resolver';
import { membershipProductResolver } from '../membershipProduct/membershipProduct.resolvers';
import { membershipProductTypes } from '../membershipProduct/membershipProduct.schema';
import { priceFeedResolver } from '../priceFeed/priceFeed.resolver';
import { priceFeedTypes } from '../priceFeed/priceFeed.schema';
import { quotesResolvers } from '../quotes/quotes.resolvers';
import { quoteTypes } from '../quotes/quotes.schema';
import { userResolvers } from '../users/users.resolvers';
import { userTypes } from '../users/users.schema';
import { walletResolvers } from '../wallets/wallets.resolvers';
import { walletTypes } from '../wallets/wallets.schema';
import { withdrawalResolvers } from '../withdrawal/withdrawal.resolvers';
import { withdrawalTypes } from '../withdrawal/withdrawal.schema';
import { Mutation } from './mutation';
import { Query } from './query';
import { Subscription } from './subscription';

const resolvers = merge(
  userResolvers,
  walletResolvers,
  quotesResolvers,
  withdrawalResolvers,
  internalWalletTransferResolver,
  membershipProductResolver,
  priceFeedResolver,
);

const typeDefinitions = [
  Query,
  Mutation,
  Subscription,
  userTypes,
  walletTypes,
  quoteTypes,
  withdrawalTypes,
  internalWalletTransfer,
  membershipProductTypes,
  priceFeedTypes,
];
export default makeExecutableSchema({
  typeDefs: typeDefinitions,
  resolvers,
});

export { typeDefinitions };
