import { DateTimeTypeDefinition } from "graphql-scalars";
const walletTypes = `
${DateTimeTypeDefinition} 
scalar Decimal
union WalletSummary = TransactionalWallet | CollateralWallet | StakingWallet

type Wallet{
  walletsID: String!
  walletName: String
  walletAssets: [walletAsset]
}

type CreateWalletAssetOutput {
  id: String
  walletId: String
  assetId: Int
  depositAddress: String
  tag: String
}

type walletAsset {
  walletAssetsID: String!
  balance: Decimal
  assets: Asset
  assetBalanceType: AssetBalanceType
  price: String
  usdPrice: Decimal
  sevenDayPercChange: Decimal
}

type Asset {
  id: Int
  name: String!
  ticker: String
  fireblocksTicker: String
  type: String!
}

type AssetBalanceType {
  balanceTypeName: String
}

 type GenerateWalletsSummary {
  currencySymbol: String
  wallets: WalletsSummary
  transactional: [TransactionalWallet]
  collateral: [CollateralWallet]
  staking: [StakingWallet]
  membership: MembershipWallet
 }

 type GenerateWalletSummary {
  wallet: WalletSummary
 }

 type GenerateWalletAssetsSummary {
  totalRecords: Int
  assets: [walletAsset]
 }

 type GenerateWalletTransactionsSummary {
  totalRecords: Int
  transactions: [Transaction]
 }

 type GenerateStakingAssetsSummary {
  totalRecords: Int
  assets: [walletAsset]
 }

 type WalletsSummary {
  Transactional: TransactionalSummary
  Collateral: CollateralSummary
  Staking: StakingSummary
  Membership: MembershipSummary
 }

 type TransactionalSummary { 
  totalWallets: Int
  totalBalance: String
  assets: [walletAsset]
 }

 type CollateralSummary { 
  totalWallets: Int
  totalBalance: String
  assets: [walletAsset]
 }

 type StakingSummary { 
  totalWallets: Int
  stakedBalance: String
  assets: [walletAsset]
 }

 type MembershipSummary { 
  membershipType: String
  fiatCnfiPrice: String
  committedCnfi: String
 }

 type TransactionalWallet { 
  walletId: String,
  nickname: String,
  assets: [walletAsset],
  type: String,
  balance: Decimal,
  pendingRewards: String,
  totalBalance: Decimal
 }

 type CollateralWallet {
  walletId: String,
  nickname: String,
  assets: [walletAsset],
  type: String,
  ltvFeePercentage: Decimal,
  totalLoanAmount: Decimal,
  paidOnLoanAmount: Decimal,
  loanEndDate: DateTime,
  totalBalance: Decimal,
  minimumPayment: Decimal
  minimumPaymentDueDate:DateTime
  outstandingPaymentBalance: Decimal
 }

 type StakingWallet {
  walletId: String,
  nickname: String,
  assets: [walletAsset],
  type: String,
  balance: Decimal,
  pendingRewards: String,
  totalBalance: Decimal
  stakedBalance: Decimal
  availableRewards: Decimal
  paidRewards: Decimal
 }

 type MembershipWallet {
  walletId: String,
  nickname: String,
  membershipType: String
 }

 type Transaction {
  transactionID: String,
  type: String,
  assets: Asset,
  createdAt: DateTime,
  assetQuantity: Decimal,
  transactionPurpose: String
  transactionStatus: String
 }
`;

const walletQueries = `
  getEligibleWallets(asset: String, productID: String!): [Wallet]
  generateWalletsSummary: GenerateWalletsSummary
  generateWalletSummary(walletId: String!): GenerateWalletSummary
  generateWalletAssetsSummary(walletId: String!, balanceType: String, offset: Int!, limit: Int!): GenerateWalletAssetsSummary
  generateWalletTransactionsSummary(walletId: String!, offset: Int!, limit: Int!): GenerateWalletTransactionsSummary
  generateStakingAssetsSummary(walletId: String!, balanceType: String!, offset: Int!, limit: Int!): GenerateStakingAssetsSummary
`;

const walletMutations = `
  createUserWallet(walletTypeId: Int!, walletName: String!): Wallet
  createWalletAsset(walletId: String!, assetId: Int!): CreateWalletAssetOutput
  stakingBalanceUpdate(sourceWalletId: String!, targetWalletId: String!, assetId: Int!, balance: Decimal!,sourceBalanceType: String!, type: String!): walletAsset
`;

export { walletTypes, walletQueries, walletMutations };
