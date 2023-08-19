"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.membershipProductQueries = exports.membershipProductTypes = void 0;
var membershipProductTypes = "\n\nscalar Decimal\n\ntype membershipProduct {\n  fiatCollateralCost: Decimal\n  baseCollateralCost: Decimal\n  product: product\n}\n\ntype product {\n  name: String!\n  productID: String\n}\n\n";
exports.membershipProductTypes = membershipProductTypes;
var membershipProductQueries = "\n  membershipProducts: [membershipProduct]\n";
exports.membershipProductQueries = membershipProductQueries;
//# sourceMappingURL=membershipProduct.schema.js.map