import { CodegenConfig } from "@graphql-codegen/cli";
import { typeDefinitions } from "./graphql/resources/schema";

const config: CodegenConfig = {
  schema: typeDefinitions,
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
export default config;
