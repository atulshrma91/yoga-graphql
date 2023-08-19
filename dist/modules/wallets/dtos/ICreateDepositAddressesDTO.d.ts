export default interface ICreateDepositAddressesDTO {
    userId: string;
    walletId: string;
    assetId: number;
    custodyVaultID: string;
    address: string;
    tag: string;
}
