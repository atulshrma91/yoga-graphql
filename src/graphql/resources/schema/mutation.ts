import { userMutations } from "../users/users.schema";
import { walletMutations } from "../wallets/wallets.schema";
import { quoteMutations } from "../quotes/quotes.schema";
import { withdrawalMutations } from "../withdrawal/withdrawal.schema";
import { internalWalletTransferQueriesMutations } from "../internalWalletTransfer/internallWalletTransfer.schema";

const Mutation = `
    type Mutation {
        ${userMutations} 
        ${walletMutations} 
        ${quoteMutations}
        ${withdrawalMutations}
        ${internalWalletTransferQueriesMutations}
    }
`;

export { Mutation };
