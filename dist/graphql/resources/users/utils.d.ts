import { GraphQLContext } from "../../../context";
export declare const detectSuspiciousSignIn: (context: GraphQLContext, userId: string) => Promise<void>;
export declare const genResetPasswordLink: (context: GraphQLContext, email: string) => Promise<string>;
export declare const genVerificationLink: (context: GraphQLContext, email: string) => Promise<string>;
export declare const getOobCode: (link: string) => string;
