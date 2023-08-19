import { GenerateStakingAssetsSummary, WalletAsset } from "../../../../types";

export default class IGenerateStakingAssetsSummary
  implements GenerateStakingAssetsSummary
{
  totalRecords: number;
  assets: Array<WalletAsset>;

  constructor() {
    this.totalRecords = 0;
    this.assets = [] as Array<WalletAsset>;
  }
}
