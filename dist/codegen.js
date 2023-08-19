"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("./graphql/resources/schema");
var config = {
    schema: schema_1.typeDefinitions,
    generates: {
        "./src/types.ts": {
            plugins: ["typescript", "typescript-resolvers"],
        },
    },
    config: {
        enumsAsTypes: true,
        useIndexSignature: true,
    },
};
exports.default = config;
//# sourceMappingURL=codegen.js.map