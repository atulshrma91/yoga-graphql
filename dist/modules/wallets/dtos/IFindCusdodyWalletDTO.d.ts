import { custodyVault } from "@connectfinancial/prisma-database";
export default interface IFindCustodyWalletDTO {
    walletsID: string;
    userId: string;
    walletTypeId: number;
    walletAssets: any;
    walletCustodyVault: {
        custodyVault: custodyVault;
    };
}
