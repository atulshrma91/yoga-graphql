export declare const userResolvers: {
    Query: {
        user: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        getUserMemberships: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
    };
    Mutation: {
        authorizeUser: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        getUserMembership: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        sendResetPasswordEmail: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        sendVerificationEmailNewUser: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        verifyEmail: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        resendVerificationEmail: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
        sendUserGoogleRegister: import("graphql").GraphQLFieldResolver<any, import("../../../context").GraphQLContext, any, unknown>;
    };
    Subscription: {};
};
