declare const membershipProductTypes = "\n\nscalar Decimal\n\ntype membershipProduct {\n  fiatCollateralCost: Decimal\n  baseCollateralCost: Decimal\n  product: product\n}\n\ntype product {\n  name: String!\n  productID: String\n}\n\n";
declare const membershipProductQueries = "\n  membershipProducts: [membershipProduct]\n";
export { membershipProductTypes, membershipProductQueries };
