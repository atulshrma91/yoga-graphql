import {
  GenerateWalletTransactionsSummary,
  Transaction,
} from "../../../../types";

export default class IGenerateWalletTransactionsSummary
  implements GenerateWalletTransactionsSummary
{
  totalRecords: number;
  transactions: Array<Transaction>;

  constructor() {
    this.totalRecords = 0;
    this.transactions = [] as Array<Transaction>;
  }
}
