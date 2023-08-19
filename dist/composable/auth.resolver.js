"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authResolvers = exports.authResolver = void 0;
var graphql_1 = require("graphql");
var verify_token_resolver_1 = require("./verify-token.resolver");
var authResolver = function (resolve) {
    return function (parent, args, context, info) {
        var whiteList = context.yoga.configManager.get("whiteList");
        if ((context === null || context === void 0 ? void 0 : context.currentUser) ||
            whiteList.includes(context.operationName) ||
            (context === null || context === void 0 ? void 0 : context.authorization)) {
            return resolve(parent, args, context, info);
        }
        return Promise.reject(new graphql_1.GraphQLError("Unauthorized! Token not provided!"));
    };
};
exports.authResolver = authResolver;
exports.authResolvers = [exports.authResolver, verify_token_resolver_1.verifyTokenResolver];
//# sourceMappingURL=auth.resolver.js.map