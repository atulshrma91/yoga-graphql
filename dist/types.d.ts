import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
    [P in K]-?: NonNullable<T[P]>;
};
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    DateTime: any;
    Decimal: any;
};
export type Asset = {
    __typename?: 'Asset';
    fireblocksTicker?: Maybe<Scalars['String']>;
    id?: Maybe<Scalars['Int']>;
    name: Scalars['String'];
    ticker?: Maybe<Scalars['String']>;
    type: Scalars['String'];
};
export type AssetBalanceType = {
    __typename?: 'AssetBalanceType';
    balanceTypeName?: Maybe<Scalars['String']>;
};
export type CollateralSummary = {
    __typename?: 'CollateralSummary';
    assets?: Maybe<Array<Maybe<WalletAsset>>>;
    totalBalance?: Maybe<Scalars['String']>;
    totalWallets?: Maybe<Scalars['Int']>;
};
export type CollateralWallet = {
    __typename?: 'CollateralWallet';
    assets?: Maybe<Array<Maybe<WalletAsset>>>;
    loanEndDate?: Maybe<Scalars['DateTime']>;
    ltvFeePercentage?: Maybe<Scalars['Decimal']>;
    minimumPayment?: Maybe<Scalars['Decimal']>;
    minimumPaymentDueDate?: Maybe<Scalars['DateTime']>;
    nickname?: Maybe<Scalars['String']>;
    outstandingPaymentBalance?: Maybe<Scalars['Decimal']>;
    paidOnLoanAmount?: Maybe<Scalars['Decimal']>;
    totalBalance?: Maybe<Scalars['Decimal']>;
    totalLoanAmount?: Maybe<Scalars['Decimal']>;
    type?: Maybe<Scalars['String']>;
    walletId?: Maybe<Scalars['String']>;
};
export type CreateWalletAssetOutput = {
    __typename?: 'CreateWalletAssetOutput';
    assetId?: Maybe<Scalars['Int']>;
    depositAddress?: Maybe<Scalars['String']>;
    id?: Maybe<Scalars['String']>;
    tag?: Maybe<Scalars['String']>;
    walletId?: Maybe<Scalars['String']>;
};
export type EligibleTradeAsset = {
    __typename?: 'EligibleTradeAsset';
    assets?: Maybe<Asset>;
    id: Scalars['Int'];
};
export type EstimateWithdrawalTransferFees = {
    __typename?: 'EstimateWithdrawalTransferFees';
    networkFee?: Maybe<Scalars['String']>;
    networkFeeUsd?: Maybe<Scalars['String']>;
    ticker: Scalars['String'];
};
export type GenerateStakingAssetsSummary = {
    __typename?: 'GenerateStakingAssetsSummary';
    assets?: Maybe<Array<Maybe<WalletAsset>>>;
    totalRecords?: Maybe<Scalars['Int']>;
};
export type GenerateWalletAssetsSummary = {
    __typename?: 'GenerateWalletAssetsSummary';
    assets?: Maybe<Array<Maybe<WalletAsset>>>;
    totalRecords?: Maybe<Scalars['Int']>;
};
export type GenerateWalletSummary = {
    __typename?: 'GenerateWalletSummary';
    wallet?: Maybe<WalletSummary>;
};
export type GenerateWalletTransactionsSummary = {
    __typename?: 'GenerateWalletTransactionsSummary';
    totalRecords?: Maybe<Scalars['Int']>;
    transactions?: Maybe<Array<Maybe<Transaction>>>;
};
export type GenerateWalletsSummary = {
    __typename?: 'GenerateWalletsSummary';
    collateral?: Maybe<Array<Maybe<CollateralWallet>>>;
    currencySymbol?: Maybe<Scalars['String']>;
    membership?: Maybe<MembershipWallet>;
    staking?: Maybe<Array<Maybe<StakingWallet>>>;
    transactional?: Maybe<Array<Maybe<TransactionalWallet>>>;
    wallets?: Maybe<WalletsSummary>;
};
export type GoogleRegisterOutput = {
    __typename?: 'GoogleRegisterOutput';
    message: Scalars['String'];
    success: Scalars['Boolean'];
};
export type LoginHistory = {
    __typename?: 'LoginHistory';
    accessDevice?: Maybe<Scalars['String']>;
    accessLocation?: Maybe<Scalars['String']>;
    browser?: Maybe<Scalars['String']>;
    createdAt?: Maybe<Scalars['DateTime']>;
    ipAddress?: Maybe<Scalars['String']>;
};
export type MailSentOutput = {
    __typename?: 'MailSentOutput';
    mail: Scalars['String'];
};
export type MembershipProgram = {
    __typename?: 'MembershipProgram';
    products?: Maybe<Product>;
    programName: Scalars['String'];
};
export type MembershipSummary = {
    __typename?: 'MembershipSummary';
    committedCnfi?: Maybe<Scalars['String']>;
    fiatCnfiPrice?: Maybe<Scalars['String']>;
    membershipType?: Maybe<Scalars['String']>;
};
export type MembershipWallet = {
    __typename?: 'MembershipWallet';
    membershipType?: Maybe<Scalars['String']>;
    nickname?: Maybe<Scalars['String']>;
    walletId?: Maybe<Scalars['String']>;
};
export type Mutation = {
    __typename?: 'Mutation';
    authorizeUser: User;
    createQuote: Quote;
    createUserWallet?: Maybe<Wallet>;
    createWalletAsset?: Maybe<CreateWalletAssetOutput>;
    executeQuote: Order;
    getOrder: OrderQueue;
    getUserMembership: UserMembership;
    internalWalletTransfer: InternalWalletTransaction;
    resendVerificationEmail?: Maybe<MailSentOutput>;
    sendResetPasswordEmail?: Maybe<MailSentOutput>;
    sendUserGoogleRegister?: Maybe<GoogleRegisterOutput>;
    sendVerificationEmailNewUser?: Maybe<MailSentOutput>;
    stakingBalanceUpdate?: Maybe<WalletAsset>;
    verifyEmail?: Maybe<VerifyEmailOutput>;
};
export type MutationCreateQuoteArgs = {
    baseToken: Scalars['String'];
    quantity: Scalars['String'];
    quantityToken: Scalars['String'];
    quoteToken: Scalars['String'];
    source: Scalars['String'];
};
export type MutationCreateUserWalletArgs = {
    walletName: Scalars['String'];
    walletTypeId: Scalars['Int'];
};
export type MutationCreateWalletAssetArgs = {
    assetId: Scalars['Int'];
    walletId: Scalars['String'];
};
export type MutationExecuteQuoteArgs = {
    quoteId: Scalars['String'];
    walletId: Scalars['String'];
};
export type MutationGetOrderArgs = {
    orderId: Scalars['String'];
};
export type MutationInternalWalletTransferArgs = {
    amount: Scalars['Decimal'];
    assets_id: Scalars['Int'];
    sourceBalanceType: Scalars['Int'];
    sourceWallet: Scalars['String'];
    targetBalanceType: Scalars['Int'];
    targetWallet: Scalars['String'];
};
export type MutationSendResetPasswordEmailArgs = {
    email: Scalars['String'];
};
export type MutationSendUserGoogleRegisterArgs = {
    referralCode?: InputMaybe<Scalars['String']>;
    userName: Scalars['String'];
};
export type MutationSendVerificationEmailNewUserArgs = {
    email: Scalars['String'];
    referralCode?: InputMaybe<Scalars['String']>;
};
export type MutationStakingBalanceUpdateArgs = {
    assetId: Scalars['Int'];
    balance: Scalars['Decimal'];
    sourceBalanceType: Scalars['String'];
    sourceWalletId: Scalars['String'];
    targetWalletId: Scalars['String'];
    type: Scalars['String'];
};
export type MutationVerifyEmailArgs = {
    oobCode: Scalars['String'];
};
export type Order = {
    __typename?: 'Order';
    orderId: Scalars['String'];
};
export type OrderQueue = {
    __typename?: 'OrderQueue';
    id: Scalars['String'];
    orderPriceExecuted?: Maybe<Scalars['String']>;
    orderStatus: Scalars['String'];
    updatedAt: Scalars['DateTime'];
    userAcceptedPrice: Scalars['String'];
};
export type PriceFeed = {
    __typename?: 'PriceFeed';
    currentPrice?: Maybe<Scalars['Decimal']>;
    lastUpdated?: Maybe<Scalars['DateTime']>;
    name?: Maybe<Scalars['String']>;
    sevenDayPerChange?: Maybe<Scalars['Decimal']>;
    symbol?: Maybe<Scalars['String']>;
    todayPerChange?: Maybe<Scalars['Decimal']>;
};
export type Query = {
    __typename?: 'Query';
    estimateWithdrawalTransferFees?: Maybe<EstimateWithdrawalTransferFees>;
    generateStakingAssetsSummary?: Maybe<GenerateStakingAssetsSummary>;
    generateWalletAssetsSummary?: Maybe<GenerateWalletAssetsSummary>;
    generateWalletSummary?: Maybe<GenerateWalletSummary>;
    generateWalletTransactionsSummary?: Maybe<GenerateWalletTransactionsSummary>;
    generateWalletsSummary?: Maybe<GenerateWalletsSummary>;
    getEligibleWallets?: Maybe<Array<Maybe<Wallet>>>;
    getInternalWalletTransfer: InternalWalletTransaction;
    getTokenPairs?: Maybe<Array<Maybe<EligibleTradeAsset>>>;
    getUserMemberships?: Maybe<Array<Maybe<UserMembership>>>;
    membershipProducts?: Maybe<Array<Maybe<MembershipProduct>>>;
    user: User;
};
export type QueryEstimateWithdrawalTransferFeesArgs = {
    amount: Scalars['Float'];
    destination: Scalars['String'];
    walletAssetId: Scalars['String'];
};
export type QueryGenerateStakingAssetsSummaryArgs = {
    balanceType: Scalars['String'];
    limit: Scalars['Int'];
    offset: Scalars['Int'];
    walletId: Scalars['String'];
};
export type QueryGenerateWalletAssetsSummaryArgs = {
    balanceType?: InputMaybe<Scalars['String']>;
    limit: Scalars['Int'];
    offset: Scalars['Int'];
    walletId: Scalars['String'];
};
export type QueryGenerateWalletSummaryArgs = {
    walletId: Scalars['String'];
};
export type QueryGenerateWalletTransactionsSummaryArgs = {
    limit: Scalars['Int'];
    offset: Scalars['Int'];
    walletId: Scalars['String'];
};
export type QueryGetEligibleWalletsArgs = {
    asset?: InputMaybe<Scalars['String']>;
    productID: Scalars['String'];
};
export type Quote = {
    __typename?: 'Quote';
    quoteId: Scalars['String'];
};
export type QuoteQueue = {
    __typename?: 'QuoteQueue';
    baseToken: Scalars['String'];
    finalQuoteValue?: Maybe<Scalars['String']>;
    id: Scalars['String'];
    quantity: Scalars['String'];
    quoteToken: Scalars['String'];
    side: Scalars['String'];
    spreadFee?: Maybe<Scalars['String']>;
    updatedAt: Scalars['DateTime'];
    userQuotePrice?: Maybe<Scalars['String']>;
};
export type StakingSummary = {
    __typename?: 'StakingSummary';
    assets?: Maybe<Array<Maybe<WalletAsset>>>;
    stakedBalance?: Maybe<Scalars['String']>;
    totalWallets?: Maybe<Scalars['Int']>;
};
export type StakingWallet = {
    __typename?: 'StakingWallet';
    assets?: Maybe<Array<Maybe<WalletAsset>>>;
    availableRewards?: Maybe<Scalars['Decimal']>;
    balance?: Maybe<Scalars['Decimal']>;
    nickname?: Maybe<Scalars['String']>;
    paidRewards?: Maybe<Scalars['Decimal']>;
    pendingRewards?: Maybe<Scalars['String']>;
    stakedBalance?: Maybe<Scalars['Decimal']>;
    totalBalance?: Maybe<Scalars['Decimal']>;
    type?: Maybe<Scalars['String']>;
    walletId?: Maybe<Scalars['String']>;
};
export type Subscription = {
    __typename?: 'Subscription';
    getPriceFeed?: Maybe<PriceFeed>;
    getQuote: QuoteQueue;
};
export type SubscriptionGetPriceFeedArgs = {
    ticker: Scalars['String'];
};
export type SubscriptionGetQuoteArgs = {
    quoteId: Scalars['String'];
};
export type TokenPair = {
    __typename?: 'TokenPair';
    baseToken: Scalars['String'];
    id: Scalars['Int'];
    quoteToken: Scalars['String'];
};
export type Transaction = {
    __typename?: 'Transaction';
    assetQuantity?: Maybe<Scalars['Decimal']>;
    assets?: Maybe<Asset>;
    createdAt?: Maybe<Scalars['DateTime']>;
    transactionID?: Maybe<Scalars['String']>;
    transactionPurpose?: Maybe<Scalars['String']>;
    transactionStatus?: Maybe<Scalars['String']>;
    type?: Maybe<Scalars['String']>;
};
export type TransactionalSummary = {
    __typename?: 'TransactionalSummary';
    assets?: Maybe<Array<Maybe<WalletAsset>>>;
    totalBalance?: Maybe<Scalars['String']>;
    totalWallets?: Maybe<Scalars['Int']>;
};
export type TransactionalWallet = {
    __typename?: 'TransactionalWallet';
    assets?: Maybe<Array<Maybe<WalletAsset>>>;
    balance?: Maybe<Scalars['Decimal']>;
    nickname?: Maybe<Scalars['String']>;
    pendingRewards?: Maybe<Scalars['String']>;
    totalBalance?: Maybe<Scalars['Decimal']>;
    type?: Maybe<Scalars['String']>;
    walletId?: Maybe<Scalars['String']>;
};
export type User = {
    __typename?: 'User';
    dob?: Maybe<Scalars['String']>;
    email: Scalars['String'];
    firstName?: Maybe<Scalars['String']>;
    gender?: Maybe<Scalars['String']>;
    google2faSecret?: Maybe<Scalars['String']>;
    image?: Maybe<Scalars['String']>;
    is2faEnabled?: Maybe<Scalars['Boolean']>;
    isEmailVerified?: Maybe<Scalars['Boolean']>;
    isWhitelistEnabled?: Maybe<Scalars['Boolean']>;
    lastName?: Maybe<Scalars['String']>;
    loginHistories?: Maybe<Array<Maybe<LoginHistory>>>;
    mobileNumber?: Maybe<Scalars['String']>;
    phoneNumber?: Maybe<Scalars['String']>;
    receiveNewsletter?: Maybe<Scalars['Boolean']>;
    referenceCode?: Maybe<Scalars['String']>;
    userAddress?: Maybe<Array<Maybe<UserAddress>>>;
    userId: Scalars['String'];
    userName?: Maybe<Scalars['String']>;
    userRole?: Maybe<Array<Maybe<UserRole>>>;
};
export type UserAddress = {
    __typename?: 'UserAddress';
    City?: Maybe<Scalars['String']>;
    State?: Maybe<Scalars['String']>;
    Zipcode?: Maybe<Scalars['String']>;
    addressLine1?: Maybe<Scalars['String']>;
    addressLine2?: Maybe<Scalars['String']>;
};
export type UserMembership = {
    __typename?: 'UserMembership';
    isCurrent: Scalars['Boolean'];
    membershipEndedDate?: Maybe<Scalars['DateTime']>;
    membershipProgramId: Scalars['String'];
    membershipPrograms: MembershipProgram;
    membershipStartDate: Scalars['DateTime'];
    userId: Scalars['String'];
};
export type UserRole = {
    __typename?: 'UserRole';
    userId: Scalars['String'];
    userRoleTypeId?: Maybe<Scalars['Int']>;
};
export type VerifyEmailOutput = {
    __typename?: 'VerifyEmailOutput';
    message: Scalars['String'];
    verified: Scalars['Boolean'];
};
export type Wallet = {
    __typename?: 'Wallet';
    walletAssets?: Maybe<Array<Maybe<WalletAsset>>>;
    walletName?: Maybe<Scalars['String']>;
    walletsID: Scalars['String'];
};
export type WalletSummary = CollateralWallet | StakingWallet | TransactionalWallet;
export type WalletsSummary = {
    __typename?: 'WalletsSummary';
    Collateral?: Maybe<CollateralSummary>;
    Membership?: Maybe<MembershipSummary>;
    Staking?: Maybe<StakingSummary>;
    Transactional?: Maybe<TransactionalSummary>;
};
export type InternalWalletTransaction = {
    __typename?: 'internalWalletTransaction';
    assetQuantity?: Maybe<Scalars['Decimal']>;
    assets_id?: Maybe<Scalars['Int']>;
    parentTransactionID?: Maybe<Scalars['String']>;
    sourceBalanceType: Scalars['Int'];
    sourceWallet: Scalars['String'];
    targetBalanceType: Scalars['Int'];
    targetWallet: Scalars['String'];
    transactionFees?: Maybe<Scalars['String']>;
    transactionID: Scalars['String'];
    type?: Maybe<Scalars['String']>;
    userID: Scalars['String'];
    wallets_transactions_sourceWalletTowallets?: Maybe<Wallet>;
    wallets_transactions_targetWalletTowallets?: Maybe<Wallet>;
};
export type MembershipProduct = {
    __typename?: 'membershipProduct';
    baseCollateralCost?: Maybe<Scalars['Decimal']>;
    fiatCollateralCost?: Maybe<Scalars['Decimal']>;
    product?: Maybe<Product>;
};
export type Product = {
    __typename?: 'product';
    name: Scalars['String'];
    productID?: Maybe<Scalars['String']>;
};
export type WalletAsset = {
    __typename?: 'walletAsset';
    assetBalanceType?: Maybe<AssetBalanceType>;
    assets?: Maybe<Asset>;
    balance?: Maybe<Scalars['Decimal']>;
    price?: Maybe<Scalars['String']>;
    sevenDayPercChange?: Maybe<Scalars['Decimal']>;
    usdPrice?: Maybe<Scalars['Decimal']>;
    walletAssetsID: Scalars['String'];
};
export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;
export type ResolverTypeWrapper<T> = Promise<T> | T;
export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;
export type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult;
export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;
export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<{
        [key in TKey]: TResult;
    }, TParent, TContext, TArgs>;
    resolve?: SubscriptionResolveFn<TResult, {
        [key in TKey]: TResult;
    }, TContext, TArgs>;
}
export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}
export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> = SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs> | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;
export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> = ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>) | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;
export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>;
export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;
export type NextResolverFn<T> = () => Promise<T>;
export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (next: NextResolverFn<TResult>, parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
export type ResolversTypes = ResolversObject<{
    Asset: ResolverTypeWrapper<Asset>;
    AssetBalanceType: ResolverTypeWrapper<AssetBalanceType>;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
    CollateralSummary: ResolverTypeWrapper<CollateralSummary>;
    CollateralWallet: ResolverTypeWrapper<CollateralWallet>;
    CreateWalletAssetOutput: ResolverTypeWrapper<CreateWalletAssetOutput>;
    DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
    Decimal: ResolverTypeWrapper<Scalars['Decimal']>;
    EligibleTradeAsset: ResolverTypeWrapper<EligibleTradeAsset>;
    EstimateWithdrawalTransferFees: ResolverTypeWrapper<EstimateWithdrawalTransferFees>;
    Float: ResolverTypeWrapper<Scalars['Float']>;
    GenerateStakingAssetsSummary: ResolverTypeWrapper<GenerateStakingAssetsSummary>;
    GenerateWalletAssetsSummary: ResolverTypeWrapper<GenerateWalletAssetsSummary>;
    GenerateWalletSummary: ResolverTypeWrapper<Omit<GenerateWalletSummary, 'wallet'> & {
        wallet?: Maybe<ResolversTypes['WalletSummary']>;
    }>;
    GenerateWalletTransactionsSummary: ResolverTypeWrapper<GenerateWalletTransactionsSummary>;
    GenerateWalletsSummary: ResolverTypeWrapper<GenerateWalletsSummary>;
    GoogleRegisterOutput: ResolverTypeWrapper<GoogleRegisterOutput>;
    Int: ResolverTypeWrapper<Scalars['Int']>;
    LoginHistory: ResolverTypeWrapper<LoginHistory>;
    MailSentOutput: ResolverTypeWrapper<MailSentOutput>;
    MembershipProgram: ResolverTypeWrapper<MembershipProgram>;
    MembershipSummary: ResolverTypeWrapper<MembershipSummary>;
    MembershipWallet: ResolverTypeWrapper<MembershipWallet>;
    Mutation: ResolverTypeWrapper<{}>;
    Order: ResolverTypeWrapper<Order>;
    OrderQueue: ResolverTypeWrapper<OrderQueue>;
    PriceFeed: ResolverTypeWrapper<PriceFeed>;
    Query: ResolverTypeWrapper<{}>;
    Quote: ResolverTypeWrapper<Quote>;
    QuoteQueue: ResolverTypeWrapper<QuoteQueue>;
    StakingSummary: ResolverTypeWrapper<StakingSummary>;
    StakingWallet: ResolverTypeWrapper<StakingWallet>;
    String: ResolverTypeWrapper<Scalars['String']>;
    Subscription: ResolverTypeWrapper<{}>;
    TokenPair: ResolverTypeWrapper<TokenPair>;
    Transaction: ResolverTypeWrapper<Transaction>;
    TransactionalSummary: ResolverTypeWrapper<TransactionalSummary>;
    TransactionalWallet: ResolverTypeWrapper<TransactionalWallet>;
    User: ResolverTypeWrapper<User>;
    UserAddress: ResolverTypeWrapper<UserAddress>;
    UserMembership: ResolverTypeWrapper<UserMembership>;
    UserRole: ResolverTypeWrapper<UserRole>;
    VerifyEmailOutput: ResolverTypeWrapper<VerifyEmailOutput>;
    Wallet: ResolverTypeWrapper<Wallet>;
    WalletSummary: ResolversTypes['CollateralWallet'] | ResolversTypes['StakingWallet'] | ResolversTypes['TransactionalWallet'];
    WalletsSummary: ResolverTypeWrapper<WalletsSummary>;
    internalWalletTransaction: ResolverTypeWrapper<InternalWalletTransaction>;
    membershipProduct: ResolverTypeWrapper<MembershipProduct>;
    product: ResolverTypeWrapper<Product>;
    walletAsset: ResolverTypeWrapper<WalletAsset>;
}>;
export type ResolversParentTypes = ResolversObject<{
    Asset: Asset;
    AssetBalanceType: AssetBalanceType;
    Boolean: Scalars['Boolean'];
    CollateralSummary: CollateralSummary;
    CollateralWallet: CollateralWallet;
    CreateWalletAssetOutput: CreateWalletAssetOutput;
    DateTime: Scalars['DateTime'];
    Decimal: Scalars['Decimal'];
    EligibleTradeAsset: EligibleTradeAsset;
    EstimateWithdrawalTransferFees: EstimateWithdrawalTransferFees;
    Float: Scalars['Float'];
    GenerateStakingAssetsSummary: GenerateStakingAssetsSummary;
    GenerateWalletAssetsSummary: GenerateWalletAssetsSummary;
    GenerateWalletSummary: Omit<GenerateWalletSummary, 'wallet'> & {
        wallet?: Maybe<ResolversParentTypes['WalletSummary']>;
    };
    GenerateWalletTransactionsSummary: GenerateWalletTransactionsSummary;
    GenerateWalletsSummary: GenerateWalletsSummary;
    GoogleRegisterOutput: GoogleRegisterOutput;
    Int: Scalars['Int'];
    LoginHistory: LoginHistory;
    MailSentOutput: MailSentOutput;
    MembershipProgram: MembershipProgram;
    MembershipSummary: MembershipSummary;
    MembershipWallet: MembershipWallet;
    Mutation: {};
    Order: Order;
    OrderQueue: OrderQueue;
    PriceFeed: PriceFeed;
    Query: {};
    Quote: Quote;
    QuoteQueue: QuoteQueue;
    StakingSummary: StakingSummary;
    StakingWallet: StakingWallet;
    String: Scalars['String'];
    Subscription: {};
    TokenPair: TokenPair;
    Transaction: Transaction;
    TransactionalSummary: TransactionalSummary;
    TransactionalWallet: TransactionalWallet;
    User: User;
    UserAddress: UserAddress;
    UserMembership: UserMembership;
    UserRole: UserRole;
    VerifyEmailOutput: VerifyEmailOutput;
    Wallet: Wallet;
    WalletSummary: ResolversParentTypes['CollateralWallet'] | ResolversParentTypes['StakingWallet'] | ResolversParentTypes['TransactionalWallet'];
    WalletsSummary: WalletsSummary;
    internalWalletTransaction: InternalWalletTransaction;
    membershipProduct: MembershipProduct;
    product: Product;
    walletAsset: WalletAsset;
}>;
export type AssetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Asset'] = ResolversParentTypes['Asset']> = ResolversObject<{
    fireblocksTicker?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    ticker?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type AssetBalanceTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AssetBalanceType'] = ResolversParentTypes['AssetBalanceType']> = ResolversObject<{
    balanceTypeName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type CollateralSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollateralSummary'] = ResolversParentTypes['CollateralSummary']> = ResolversObject<{
    assets?: Resolver<Maybe<Array<Maybe<ResolversTypes['walletAsset']>>>, ParentType, ContextType>;
    totalBalance?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    totalWallets?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type CollateralWalletResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollateralWallet'] = ResolversParentTypes['CollateralWallet']> = ResolversObject<{
    assets?: Resolver<Maybe<Array<Maybe<ResolversTypes['walletAsset']>>>, ParentType, ContextType>;
    loanEndDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
    ltvFeePercentage?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    minimumPayment?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    minimumPaymentDueDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
    nickname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    outstandingPaymentBalance?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    paidOnLoanAmount?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    totalBalance?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    totalLoanAmount?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    walletId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type CreateWalletAssetOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateWalletAssetOutput'] = ResolversParentTypes['CreateWalletAssetOutput']> = ResolversObject<{
    assetId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    depositAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    tag?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    walletId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
    name: 'DateTime';
}
export interface DecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Decimal'], any> {
    name: 'Decimal';
}
export type EligibleTradeAssetResolvers<ContextType = any, ParentType extends ResolversParentTypes['EligibleTradeAsset'] = ResolversParentTypes['EligibleTradeAsset']> = ResolversObject<{
    assets?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type EstimateWithdrawalTransferFeesResolvers<ContextType = any, ParentType extends ResolversParentTypes['EstimateWithdrawalTransferFees'] = ResolversParentTypes['EstimateWithdrawalTransferFees']> = ResolversObject<{
    networkFee?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    networkFeeUsd?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    ticker?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type GenerateStakingAssetsSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['GenerateStakingAssetsSummary'] = ResolversParentTypes['GenerateStakingAssetsSummary']> = ResolversObject<{
    assets?: Resolver<Maybe<Array<Maybe<ResolversTypes['walletAsset']>>>, ParentType, ContextType>;
    totalRecords?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type GenerateWalletAssetsSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['GenerateWalletAssetsSummary'] = ResolversParentTypes['GenerateWalletAssetsSummary']> = ResolversObject<{
    assets?: Resolver<Maybe<Array<Maybe<ResolversTypes['walletAsset']>>>, ParentType, ContextType>;
    totalRecords?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type GenerateWalletSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['GenerateWalletSummary'] = ResolversParentTypes['GenerateWalletSummary']> = ResolversObject<{
    wallet?: Resolver<Maybe<ResolversTypes['WalletSummary']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type GenerateWalletTransactionsSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['GenerateWalletTransactionsSummary'] = ResolversParentTypes['GenerateWalletTransactionsSummary']> = ResolversObject<{
    totalRecords?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    transactions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Transaction']>>>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type GenerateWalletsSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['GenerateWalletsSummary'] = ResolversParentTypes['GenerateWalletsSummary']> = ResolversObject<{
    collateral?: Resolver<Maybe<Array<Maybe<ResolversTypes['CollateralWallet']>>>, ParentType, ContextType>;
    currencySymbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    membership?: Resolver<Maybe<ResolversTypes['MembershipWallet']>, ParentType, ContextType>;
    staking?: Resolver<Maybe<Array<Maybe<ResolversTypes['StakingWallet']>>>, ParentType, ContextType>;
    transactional?: Resolver<Maybe<Array<Maybe<ResolversTypes['TransactionalWallet']>>>, ParentType, ContextType>;
    wallets?: Resolver<Maybe<ResolversTypes['WalletsSummary']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type GoogleRegisterOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['GoogleRegisterOutput'] = ResolversParentTypes['GoogleRegisterOutput']> = ResolversObject<{
    message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type LoginHistoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginHistory'] = ResolversParentTypes['LoginHistory']> = ResolversObject<{
    accessDevice?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    accessLocation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    browser?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
    ipAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type MailSentOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['MailSentOutput'] = ResolversParentTypes['MailSentOutput']> = ResolversObject<{
    mail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type MembershipProgramResolvers<ContextType = any, ParentType extends ResolversParentTypes['MembershipProgram'] = ResolversParentTypes['MembershipProgram']> = ResolversObject<{
    products?: Resolver<Maybe<ResolversTypes['product']>, ParentType, ContextType>;
    programName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type MembershipSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['MembershipSummary'] = ResolversParentTypes['MembershipSummary']> = ResolversObject<{
    committedCnfi?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    fiatCnfiPrice?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    membershipType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type MembershipWalletResolvers<ContextType = any, ParentType extends ResolversParentTypes['MembershipWallet'] = ResolversParentTypes['MembershipWallet']> = ResolversObject<{
    membershipType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    nickname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    walletId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
    authorizeUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
    createQuote?: Resolver<ResolversTypes['Quote'], ParentType, ContextType, RequireFields<MutationCreateQuoteArgs, 'baseToken' | 'quantity' | 'quantityToken' | 'quoteToken' | 'source'>>;
    createUserWallet?: Resolver<Maybe<ResolversTypes['Wallet']>, ParentType, ContextType, RequireFields<MutationCreateUserWalletArgs, 'walletName' | 'walletTypeId'>>;
    createWalletAsset?: Resolver<Maybe<ResolversTypes['CreateWalletAssetOutput']>, ParentType, ContextType, RequireFields<MutationCreateWalletAssetArgs, 'assetId' | 'walletId'>>;
    executeQuote?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationExecuteQuoteArgs, 'quoteId' | 'walletId'>>;
    getOrder?: Resolver<ResolversTypes['OrderQueue'], ParentType, ContextType, RequireFields<MutationGetOrderArgs, 'orderId'>>;
    getUserMembership?: Resolver<ResolversTypes['UserMembership'], ParentType, ContextType>;
    internalWalletTransfer?: Resolver<ResolversTypes['internalWalletTransaction'], ParentType, ContextType, RequireFields<MutationInternalWalletTransferArgs, 'amount' | 'assets_id' | 'sourceBalanceType' | 'sourceWallet' | 'targetBalanceType' | 'targetWallet'>>;
    resendVerificationEmail?: Resolver<Maybe<ResolversTypes['MailSentOutput']>, ParentType, ContextType>;
    sendResetPasswordEmail?: Resolver<Maybe<ResolversTypes['MailSentOutput']>, ParentType, ContextType, RequireFields<MutationSendResetPasswordEmailArgs, 'email'>>;
    sendUserGoogleRegister?: Resolver<Maybe<ResolversTypes['GoogleRegisterOutput']>, ParentType, ContextType, RequireFields<MutationSendUserGoogleRegisterArgs, 'userName'>>;
    sendVerificationEmailNewUser?: Resolver<Maybe<ResolversTypes['MailSentOutput']>, ParentType, ContextType, RequireFields<MutationSendVerificationEmailNewUserArgs, 'email'>>;
    stakingBalanceUpdate?: Resolver<Maybe<ResolversTypes['walletAsset']>, ParentType, ContextType, RequireFields<MutationStakingBalanceUpdateArgs, 'assetId' | 'balance' | 'sourceBalanceType' | 'sourceWalletId' | 'targetWalletId' | 'type'>>;
    verifyEmail?: Resolver<Maybe<ResolversTypes['VerifyEmailOutput']>, ParentType, ContextType, RequireFields<MutationVerifyEmailArgs, 'oobCode'>>;
}>;
export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = ResolversObject<{
    orderId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type OrderQueueResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderQueue'] = ResolversParentTypes['OrderQueue']> = ResolversObject<{
    id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    orderPriceExecuted?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    orderStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    userAcceptedPrice?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type PriceFeedResolvers<ContextType = any, ParentType extends ResolversParentTypes['PriceFeed'] = ResolversParentTypes['PriceFeed']> = ResolversObject<{
    currentPrice?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    lastUpdated?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
    name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    sevenDayPerChange?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    symbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    todayPerChange?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
    estimateWithdrawalTransferFees?: Resolver<Maybe<ResolversTypes['EstimateWithdrawalTransferFees']>, ParentType, ContextType, RequireFields<QueryEstimateWithdrawalTransferFeesArgs, 'amount' | 'destination' | 'walletAssetId'>>;
    generateStakingAssetsSummary?: Resolver<Maybe<ResolversTypes['GenerateStakingAssetsSummary']>, ParentType, ContextType, RequireFields<QueryGenerateStakingAssetsSummaryArgs, 'balanceType' | 'limit' | 'offset' | 'walletId'>>;
    generateWalletAssetsSummary?: Resolver<Maybe<ResolversTypes['GenerateWalletAssetsSummary']>, ParentType, ContextType, RequireFields<QueryGenerateWalletAssetsSummaryArgs, 'limit' | 'offset' | 'walletId'>>;
    generateWalletSummary?: Resolver<Maybe<ResolversTypes['GenerateWalletSummary']>, ParentType, ContextType, RequireFields<QueryGenerateWalletSummaryArgs, 'walletId'>>;
    generateWalletTransactionsSummary?: Resolver<Maybe<ResolversTypes['GenerateWalletTransactionsSummary']>, ParentType, ContextType, RequireFields<QueryGenerateWalletTransactionsSummaryArgs, 'limit' | 'offset' | 'walletId'>>;
    generateWalletsSummary?: Resolver<Maybe<ResolversTypes['GenerateWalletsSummary']>, ParentType, ContextType>;
    getEligibleWallets?: Resolver<Maybe<Array<Maybe<ResolversTypes['Wallet']>>>, ParentType, ContextType, RequireFields<QueryGetEligibleWalletsArgs, 'productID'>>;
    getInternalWalletTransfer?: Resolver<ResolversTypes['internalWalletTransaction'], ParentType, ContextType>;
    getTokenPairs?: Resolver<Maybe<Array<Maybe<ResolversTypes['EligibleTradeAsset']>>>, ParentType, ContextType>;
    getUserMemberships?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserMembership']>>>, ParentType, ContextType>;
    membershipProducts?: Resolver<Maybe<Array<Maybe<ResolversTypes['membershipProduct']>>>, ParentType, ContextType>;
    user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;
export type QuoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Quote'] = ResolversParentTypes['Quote']> = ResolversObject<{
    quoteId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type QuoteQueueResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuoteQueue'] = ResolversParentTypes['QuoteQueue']> = ResolversObject<{
    baseToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    finalQuoteValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    quantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    quoteToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    side?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    spreadFee?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    userQuotePrice?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type StakingSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['StakingSummary'] = ResolversParentTypes['StakingSummary']> = ResolversObject<{
    assets?: Resolver<Maybe<Array<Maybe<ResolversTypes['walletAsset']>>>, ParentType, ContextType>;
    stakedBalance?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    totalWallets?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type StakingWalletResolvers<ContextType = any, ParentType extends ResolversParentTypes['StakingWallet'] = ResolversParentTypes['StakingWallet']> = ResolversObject<{
    assets?: Resolver<Maybe<Array<Maybe<ResolversTypes['walletAsset']>>>, ParentType, ContextType>;
    availableRewards?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    balance?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    nickname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    paidRewards?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    pendingRewards?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    stakedBalance?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    totalBalance?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    walletId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
    getPriceFeed?: SubscriptionResolver<Maybe<ResolversTypes['PriceFeed']>, "getPriceFeed", ParentType, ContextType, RequireFields<SubscriptionGetPriceFeedArgs, 'ticker'>>;
    getQuote?: SubscriptionResolver<ResolversTypes['QuoteQueue'], "getQuote", ParentType, ContextType, RequireFields<SubscriptionGetQuoteArgs, 'quoteId'>>;
}>;
export type TokenPairResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenPair'] = ResolversParentTypes['TokenPair']> = ResolversObject<{
    baseToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    quoteToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type TransactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction']> = ResolversObject<{
    assetQuantity?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    assets?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
    createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
    transactionID?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    transactionPurpose?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    transactionStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type TransactionalSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionalSummary'] = ResolversParentTypes['TransactionalSummary']> = ResolversObject<{
    assets?: Resolver<Maybe<Array<Maybe<ResolversTypes['walletAsset']>>>, ParentType, ContextType>;
    totalBalance?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    totalWallets?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type TransactionalWalletResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransactionalWallet'] = ResolversParentTypes['TransactionalWallet']> = ResolversObject<{
    assets?: Resolver<Maybe<Array<Maybe<ResolversTypes['walletAsset']>>>, ParentType, ContextType>;
    balance?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    nickname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    pendingRewards?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    totalBalance?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    walletId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
    dob?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    google2faSecret?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    is2faEnabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
    isEmailVerified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
    isWhitelistEnabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
    lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    loginHistories?: Resolver<Maybe<Array<Maybe<ResolversTypes['LoginHistory']>>>, ParentType, ContextType>;
    mobileNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    receiveNewsletter?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
    referenceCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    userAddress?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserAddress']>>>, ParentType, ContextType>;
    userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    userName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    userRole?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserRole']>>>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type UserAddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAddress'] = ResolversParentTypes['UserAddress']> = ResolversObject<{
    City?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    State?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    Zipcode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    addressLine1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    addressLine2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type UserMembershipResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserMembership'] = ResolversParentTypes['UserMembership']> = ResolversObject<{
    isCurrent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    membershipEndedDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
    membershipProgramId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    membershipPrograms?: Resolver<ResolversTypes['MembershipProgram'], ParentType, ContextType>;
    membershipStartDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type UserRoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserRole'] = ResolversParentTypes['UserRole']> = ResolversObject<{
    userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    userRoleTypeId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type VerifyEmailOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['VerifyEmailOutput'] = ResolversParentTypes['VerifyEmailOutput']> = ResolversObject<{
    message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type WalletResolvers<ContextType = any, ParentType extends ResolversParentTypes['Wallet'] = ResolversParentTypes['Wallet']> = ResolversObject<{
    walletAssets?: Resolver<Maybe<Array<Maybe<ResolversTypes['walletAsset']>>>, ParentType, ContextType>;
    walletName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    walletsID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type WalletSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['WalletSummary'] = ResolversParentTypes['WalletSummary']> = ResolversObject<{
    __resolveType: TypeResolveFn<'CollateralWallet' | 'StakingWallet' | 'TransactionalWallet', ParentType, ContextType>;
}>;
export type WalletsSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['WalletsSummary'] = ResolversParentTypes['WalletsSummary']> = ResolversObject<{
    Collateral?: Resolver<Maybe<ResolversTypes['CollateralSummary']>, ParentType, ContextType>;
    Membership?: Resolver<Maybe<ResolversTypes['MembershipSummary']>, ParentType, ContextType>;
    Staking?: Resolver<Maybe<ResolversTypes['StakingSummary']>, ParentType, ContextType>;
    Transactional?: Resolver<Maybe<ResolversTypes['TransactionalSummary']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type InternalWalletTransactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['internalWalletTransaction'] = ResolversParentTypes['internalWalletTransaction']> = ResolversObject<{
    assetQuantity?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    assets_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    parentTransactionID?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    sourceBalanceType?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    sourceWallet?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    targetBalanceType?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    targetWallet?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    transactionFees?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    transactionID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    userID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    wallets_transactions_sourceWalletTowallets?: Resolver<Maybe<ResolversTypes['Wallet']>, ParentType, ContextType>;
    wallets_transactions_targetWalletTowallets?: Resolver<Maybe<ResolversTypes['Wallet']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type MembershipProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['membershipProduct'] = ResolversParentTypes['membershipProduct']> = ResolversObject<{
    baseCollateralCost?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    fiatCollateralCost?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    product?: Resolver<Maybe<ResolversTypes['product']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['product'] = ResolversParentTypes['product']> = ResolversObject<{
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    productID?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type WalletAssetResolvers<ContextType = any, ParentType extends ResolversParentTypes['walletAsset'] = ResolversParentTypes['walletAsset']> = ResolversObject<{
    assetBalanceType?: Resolver<Maybe<ResolversTypes['AssetBalanceType']>, ParentType, ContextType>;
    assets?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
    balance?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    price?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    sevenDayPercChange?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    usdPrice?: Resolver<Maybe<ResolversTypes['Decimal']>, ParentType, ContextType>;
    walletAssetsID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;
export type Resolvers<ContextType = any> = ResolversObject<{
    Asset?: AssetResolvers<ContextType>;
    AssetBalanceType?: AssetBalanceTypeResolvers<ContextType>;
    CollateralSummary?: CollateralSummaryResolvers<ContextType>;
    CollateralWallet?: CollateralWalletResolvers<ContextType>;
    CreateWalletAssetOutput?: CreateWalletAssetOutputResolvers<ContextType>;
    DateTime?: GraphQLScalarType;
    Decimal?: GraphQLScalarType;
    EligibleTradeAsset?: EligibleTradeAssetResolvers<ContextType>;
    EstimateWithdrawalTransferFees?: EstimateWithdrawalTransferFeesResolvers<ContextType>;
    GenerateStakingAssetsSummary?: GenerateStakingAssetsSummaryResolvers<ContextType>;
    GenerateWalletAssetsSummary?: GenerateWalletAssetsSummaryResolvers<ContextType>;
    GenerateWalletSummary?: GenerateWalletSummaryResolvers<ContextType>;
    GenerateWalletTransactionsSummary?: GenerateWalletTransactionsSummaryResolvers<ContextType>;
    GenerateWalletsSummary?: GenerateWalletsSummaryResolvers<ContextType>;
    GoogleRegisterOutput?: GoogleRegisterOutputResolvers<ContextType>;
    LoginHistory?: LoginHistoryResolvers<ContextType>;
    MailSentOutput?: MailSentOutputResolvers<ContextType>;
    MembershipProgram?: MembershipProgramResolvers<ContextType>;
    MembershipSummary?: MembershipSummaryResolvers<ContextType>;
    MembershipWallet?: MembershipWalletResolvers<ContextType>;
    Mutation?: MutationResolvers<ContextType>;
    Order?: OrderResolvers<ContextType>;
    OrderQueue?: OrderQueueResolvers<ContextType>;
    PriceFeed?: PriceFeedResolvers<ContextType>;
    Query?: QueryResolvers<ContextType>;
    Quote?: QuoteResolvers<ContextType>;
    QuoteQueue?: QuoteQueueResolvers<ContextType>;
    StakingSummary?: StakingSummaryResolvers<ContextType>;
    StakingWallet?: StakingWalletResolvers<ContextType>;
    Subscription?: SubscriptionResolvers<ContextType>;
    TokenPair?: TokenPairResolvers<ContextType>;
    Transaction?: TransactionResolvers<ContextType>;
    TransactionalSummary?: TransactionalSummaryResolvers<ContextType>;
    TransactionalWallet?: TransactionalWalletResolvers<ContextType>;
    User?: UserResolvers<ContextType>;
    UserAddress?: UserAddressResolvers<ContextType>;
    UserMembership?: UserMembershipResolvers<ContextType>;
    UserRole?: UserRoleResolvers<ContextType>;
    VerifyEmailOutput?: VerifyEmailOutputResolvers<ContextType>;
    Wallet?: WalletResolvers<ContextType>;
    WalletSummary?: WalletSummaryResolvers<ContextType>;
    WalletsSummary?: WalletsSummaryResolvers<ContextType>;
    internalWalletTransaction?: InternalWalletTransactionResolvers<ContextType>;
    membershipProduct?: MembershipProductResolvers<ContextType>;
    product?: ProductResolvers<ContextType>;
    walletAsset?: WalletAssetResolvers<ContextType>;
}>;
