import { GenerateWalletAssetsSummary, WalletAsset } from "../../../../types";

export default class IGenerateWalletAssetsSummary
  implements GenerateWalletAssetsSummary
{
  totalRecords: number;
  assets: Array<WalletAsset>;

  constructor() {
    this.totalRecords = 0;
    this.assets = [] as Array<WalletAsset>;
  }
}
