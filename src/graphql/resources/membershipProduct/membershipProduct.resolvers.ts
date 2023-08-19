import "reflect-metadata";
import { authResolvers } from "../../../composable/auth.resolver";
import { compose } from "../../../composable/composable.resolver";

export const membershipProductResolver = {
  Query: {
    membershipProducts: compose(...authResolvers)(
      async (parent, {}, constext) => {
        try {
          const data = await constext.yoga.prisma.membershipProduct.findMany({
            select: {
              membershipProductAsset: true,
              product: {
                select: {
                  name: true,
                  productID: true,
                },
              },
              fiatCollateralCost: true,
              baseCollateralCost: true,
            },
          });
          return data;
        } catch (err: any) {
          return Promise.reject(err.message);
        }
      }
    ),
  },
  Mutation: {},
};
