import { userQueries } from "../users/users.schema";
import { walletQueries } from "../wallets/wallets.schema";
import { quoteQueries } from "../quotes/quotes.schema";
import { withdrawalQueries } from "../withdrawal/withdrawal.schema";
import { internalWalletTransferQueries } from "../internalWalletTransfer/internallWalletTransfer.schema";
import { membershipProductQueries } from "../membershipProduct/membershipProduct.schema";

const Query = `
    type Query {
        ${userQueries}
        ${walletQueries}
        ${quoteQueries}
        ${withdrawalQueries}
        ${internalWalletTransferQueries}
        ${membershipProductQueries}
    }
`;

export { Query };
