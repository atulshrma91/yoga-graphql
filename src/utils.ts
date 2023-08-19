import fbAdmin, { ServiceAccount } from 'firebase-admin';
import type { Auth } from 'firebase-admin/lib/auth/auth';
import { createSchema, createYoga } from 'graphql-yoga';
import { memoize, merge } from 'lodash';
import { useHive } from '@graphql-hive/client';
import { Yoga } from './app';
import { createContext } from './context';
import schema from './graphql/resources/schema';
import { userResolvers } from './graphql/resources/users/users.resolvers';

const resolvers = merge(userResolvers);

export const yogaGraphQLServer = (yoga: Yoga) =>
  createYoga({
    schema: createSchema({
      typeDefs: schema,
      resolvers,
    }) as any,
    graphqlEndpoint: '/graphql',
    context: async initialContext => {
      return await createContext(yoga, initialContext);
    },
    logging: true,
    graphiql: {
      subscriptionsProtocol: 'WS',
    },
    plugins: [
      useHive({
        enabled: !!yoga.secretManager.get('HIVE_TOKEN'),
        reporting: false,
        usage: true,
        debug: true,
        token: yoga.secretManager.get('HIVE_TOKEN'),
      }),
    ],
  });

const _firebaseInit = async (yoga: Yoga): Promise<Auth> => {
  const svAccount = yoga.secretManager.get('FIREBASE_ADMIN');

  fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(svAccount as ServiceAccount),
    projectId: svAccount.project_id,
  });
  return fbAdmin.auth();
};

export const firebaseInit = memoize(_firebaseInit);
