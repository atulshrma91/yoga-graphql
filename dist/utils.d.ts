/// <reference types="lodash" />
import type { Auth } from 'firebase-admin/lib/auth/auth';
import { Yoga } from './app';
export declare const yogaGraphQLServer: (yoga: Yoga) => import("graphql-yoga").YogaServerInstance<{}, import("./context").GraphQLContext>;
export declare const firebaseInit: ((yoga: Yoga) => Promise<Auth>) & import("lodash").MemoizedFunction;
