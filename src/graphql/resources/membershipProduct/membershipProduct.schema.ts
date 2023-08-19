const membershipProductTypes = `

scalar Decimal

type membershipProduct {
  fiatCollateralCost: Decimal
  baseCollateralCost: Decimal
  product: product
}

type product {
  name: String!
  productID: String
}

`;

const membershipProductQueries = `
  membershipProducts: [membershipProduct]
`;

export { membershipProductTypes, membershipProductQueries };
