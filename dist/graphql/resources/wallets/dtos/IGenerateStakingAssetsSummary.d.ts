import { GenerateStakingAssetsSummary, WalletAsset } from "../../../../types";
export default class IGenerateStakingAssetsSummary implements GenerateStakingAssetsSummary {
    totalRecords: number;
    assets: Array<WalletAsset>;
    constructor();
}
