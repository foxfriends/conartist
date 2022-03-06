/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddConventionInfo
// ====================================================

export type AddConventionInfo_addConventionExtraInfo = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};

export type AddConventionInfo = {
  addConventionExtraInfo: AddConventionInfo_addConventionExtraInfo
};

export type AddConventionInfoVariables = {
  conId: number,
  title: string,
  info?: ?string,
  action?: ?string,
  actionText?: ?string,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddExpense
// ====================================================

export type AddExpense_addUserExpense = {
  __typename: "Expense",
  id: number,
  uuid: ?any,
  category: string,
  description: string,
  price: any,
  time: any,
};

export type AddExpense = {
  addUserExpense: AddExpense_addUserExpense
};

export type AddExpenseVariables = {
  id?: ?number,
  expense: ExpenseAdd,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddPrice
// ====================================================

export type AddPrice_addUserPrice = {
  __typename: "Price",
  typeId: number,
  productId: ?number,
  quantity: number,
  price: any,
};

export type AddPrice = {
  addUserPrice: AddPrice_addUserPrice
};

export type AddPriceVariables = {
  userId?: ?number,
  price: PriceAdd,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddProductType
// ====================================================

export type AddProductType_addUserProductType = {
  __typename: "ProductType",
  id: number,
  name: string,
  color: ?number,
  discontinued: boolean,
  sort: number,
};

export type AddProductType = {
  addUserProductType: AddProductType_addUserProductType
};

export type AddProductTypeVariables = {
  id?: ?number,
  productType: ProductTypeAdd,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddProduct
// ====================================================

export type AddProduct_addUserProduct = {
  __typename: "Product",
  id: number,
  typeId: number,
  name: string,
  sku: ?string,
  quantity: number,
  discontinued: boolean,
  sort: number,
};

export type AddProduct = {
  addUserProduct: AddProduct_addUserProduct
};

export type AddProductVariables = {
  id?: ?number,
  product: ProductAdd,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddRecord
// ====================================================

export type AddRecord_addUserRecord = {
  __typename: "Record",
  id: number,
  uuid: ?any,
  products: Array<number>,
  price: any,
  time: any,
  info: string,
};

export type AddRecord = {
  addUserRecord: AddRecord_addUserRecord
};

export type AddRecordVariables = {
  id?: ?number,
  record: RecordAdd,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddUserConvention
// ====================================================

export type AddUserConvention_addUserConvention_images = {
  __typename: "ConventionImage",
  id: string,
};

export type AddUserConvention_addUserConvention_extraInfo = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};

export type AddUserConvention_addUserConvention_userInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};

export type AddUserConvention_addUserConvention = {
  __typename: "Convention",
  id: number,
  name: string,
  images: Array<AddUserConvention_addUserConvention_images>,
  start: any,
  end: any,
  extraInfo: Array<AddUserConvention_addUserConvention_extraInfo>,
  userInfo: Array<AddUserConvention_addUserConvention_userInfo>,
  recordTotal: ?any,
  expenseTotal: ?any,
};

export type AddUserConvention = {
  addUserConvention: AddUserConvention_addUserConvention
};

export type AddUserConventionVariables = {
  userId?: ?number,
  conId: number,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeEmail
// ====================================================

export type ChangeEmail_changeUserEmail_settings = {
  __typename: "Settings",
  currency: any,
  language: string,
};

export type ChangeEmail_changeUserEmail_conventions_images = {
  __typename: "ConventionImage",
  id: string,
};

export type ChangeEmail_changeUserEmail_conventions_extraInfo = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};

export type ChangeEmail_changeUserEmail_conventions_userInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};

export type ChangeEmail_changeUserEmail_conventions = {
  __typename: "Convention",
  id: number,
  name: string,
  images: Array<ChangeEmail_changeUserEmail_conventions_images>,
  start: any,
  end: any,
  extraInfo: Array<ChangeEmail_changeUserEmail_conventions_extraInfo>,
  userInfo: Array<ChangeEmail_changeUserEmail_conventions_userInfo>,
  recordTotal: ?any,
  expenseTotal: ?any,
};

export type ChangeEmail_changeUserEmail = {
  __typename: "User",
  name: string,
  email: string,
  verified: boolean,
  settings: ChangeEmail_changeUserEmail_settings,
  conventions: Array<ChangeEmail_changeUserEmail_conventions>,
};

export type ChangeEmail = {
  changeUserEmail: ChangeEmail_changeUserEmail
};

export type ChangeEmailVariables = {
  id?: ?number,
  email: string,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeName
// ====================================================

export type ChangeName_changeUserName_settings = {
  __typename: "Settings",
  currency: any,
  language: string,
};

export type ChangeName_changeUserName_conventions_images = {
  __typename: "ConventionImage",
  id: string,
};

export type ChangeName_changeUserName_conventions_extraInfo = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};

export type ChangeName_changeUserName_conventions_userInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};

export type ChangeName_changeUserName_conventions = {
  __typename: "Convention",
  id: number,
  name: string,
  images: Array<ChangeName_changeUserName_conventions_images>,
  start: any,
  end: any,
  extraInfo: Array<ChangeName_changeUserName_conventions_extraInfo>,
  userInfo: Array<ChangeName_changeUserName_conventions_userInfo>,
  recordTotal: ?any,
  expenseTotal: ?any,
};

export type ChangeName_changeUserName = {
  __typename: "User",
  name: string,
  email: string,
  verified: boolean,
  settings: ChangeName_changeUserName_settings,
  conventions: Array<ChangeName_changeUserName_conventions>,
};

export type ChangeName = {
  changeUserName: ChangeName_changeUserName
};

export type ChangeNameVariables = {
  id?: ?number,
  name: string,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ContributeConventionInfo
// ====================================================

export type ContributeConventionInfo_addConventionInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};

export type ContributeConventionInfo = {
  addConventionInfo: ContributeConventionInfo_addConventionInfo
};

export type ContributeConventionInfoVariables = {
  userId?: ?number,
  conId: number,
  info: string,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateConvention
// ====================================================

export type CreateConvention_createConvention = {
  __typename: "Convention",
  id: number,
};

export type CreateConvention = {
  createConvention: CreateConvention_createConvention
};

export type CreateConventionVariables = {
  title: string,
  startDate: any,
  endDate: any,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateSuggestion
// ====================================================

export type CreateSuggestion_createSuggestion_suggester = {
  __typename: "User",
  name: string,
};

export type CreateSuggestion_createSuggestion = {
  __typename: "Suggestion",
  id: number,
  suggestion: string,
  suggester: CreateSuggestion_createSuggestion_suggester,
  status: number,
  suggestedAt: any,
  ranking: number,
  voted: boolean,
};

export type CreateSuggestion = {
  createSuggestion: CreateSuggestion_createSuggestion
};

export type CreateSuggestionVariables = {
  suggestion: string
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteExpense
// ====================================================

export type DeleteExpense = {
  delUserExpense: boolean
};

export type DeleteExpenseVariables = {
  id?: ?number,
  expense: ExpenseDel,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeletePrice
// ====================================================

export type DeletePrice = {
  delUserPrice: boolean
};

export type DeletePriceVariables = {
  userId?: ?number,
  price: PriceDel,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteProductType
// ====================================================

export type DeleteProductType = {
  delUserProductType: boolean
};

export type DeleteProductTypeVariables = {
  id?: ?number,
  typeId: number,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteProduct
// ====================================================

export type DeleteProduct = {
  delUserProduct: boolean
};

export type DeleteProductVariables = {
  id?: ?number,
  productId: number,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteRecord
// ====================================================

export type DeleteRecord = {
  delUserRecord: boolean
};

export type DeleteRecordVariables = {
  id?: ?number,
  record: RecordDel,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteUserConvention
// ====================================================

export type DeleteUserConvention = {
  delUserConvention: boolean
};

export type DeleteUserConventionVariables = {
  userId?: ?number,
  conId: number,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DownvoteConventionInfo
// ====================================================

export type DownvoteConventionInfo_downvoteConventionInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  upvotes: number,
  downvotes: number,
};

export type DownvoteConventionInfo = {
  downvoteConventionInfo: DownvoteConventionInfo_downvoteConventionInfo
};

export type DownvoteConventionInfoVariables = {
  userId?: ?number,
  infoId: number,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ModProductType
// ====================================================

export type ModProductType_modUserProductType = {
  __typename: "ProductType",
  id: number,
  name: string,
  color: ?number,
  discontinued: boolean,
  sort: number,
};

export type ModProductType = {
  modUserProductType: ModProductType_modUserProductType
};

export type ModProductTypeVariables = {
  id?: ?number,
  productType: ProductTypeMod,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ModProduct
// ====================================================

export type ModProduct_modUserProduct = {
  __typename: "Product",
  id: number,
  typeId: number,
  name: string,
  sku: ?string,
  quantity: number,
  discontinued: boolean,
  sort: number,
};

export type ModProduct = {
  modUserProduct: ModProduct_modUserProduct
};

export type ModProductVariables = {
  id?: ?number,
  product: ProductMod,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateCurrency
// ====================================================

export type UpdateCurrency_updateSettings = {
  __typename: "SettingsMutation",
  currency: any,
};

export type UpdateCurrency = {
  updateSettings: UpdateCurrency_updateSettings
};

export type UpdateCurrencyVariables = {
  id?: ?number,
  currency: any,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateExpense
// ====================================================

export type UpdateExpense_modUserExpense = {
  __typename: "Expense",
  id: number,
  uuid: ?any,
  category: string,
  description: string,
  price: any,
  time: any,
};

export type UpdateExpense = {
  modUserExpense: UpdateExpense_modUserExpense
};

export type UpdateExpenseVariables = {
  id?: ?number,
  expense: ExpenseMod,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateLanguage
// ====================================================

export type UpdateLanguage_updateSettings = {
  __typename: "SettingsMutation",
  language: string,
};

export type UpdateLanguage = {
  updateSettings: UpdateLanguage_updateSettings
};

export type UpdateLanguageVariables = {
  id?: ?number,
  language: string,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateRecord
// ====================================================

export type UpdateRecord_modUserRecord = {
  __typename: "Record",
  id: number,
  uuid: ?any,
  products: Array<number>,
  price: any,
  time: any,
  info: string,
};

export type UpdateRecord = {
  modUserRecord: UpdateRecord_modUserRecord
};

export type UpdateRecordVariables = {
  id?: ?number,
  record: RecordMod,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpvoteConventionInfo
// ====================================================

export type UpvoteConventionInfo_upvoteConventionInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  upvotes: number,
  downvotes: number,
};

export type UpvoteConventionInfo = {
  upvoteConventionInfo: UpvoteConventionInfo_upvoteConventionInfo
};

export type UpvoteConventionInfoVariables = {
  userId?: ?number,
  infoId: number,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: VoteForSuggestion
// ====================================================

export type VoteForSuggestion_voteForSuggestion_suggester = {
  __typename: "User",
  name: string,
};

export type VoteForSuggestion_voteForSuggestion = {
  __typename: "Suggestion",
  id: number,
  suggestion: string,
  suggester: VoteForSuggestion_voteForSuggestion_suggester,
  status: number,
  suggestedAt: any,
  ranking: number,
  voted: boolean,
};

export type VoteForSuggestion = {
  voteForSuggestion: VoteForSuggestion_voteForSuggestion
};

export type VoteForSuggestionVariables = {
  suggestionId: number
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ConventionsConnection
// ====================================================

export type ConventionsConnection_conventionsConnection_nodes_images = {
  __typename: "ConventionImage",
  id: string,
};

export type ConventionsConnection_conventionsConnection_nodes_extraInfo = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};

export type ConventionsConnection_conventionsConnection_nodes_userInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};

export type ConventionsConnection_conventionsConnection_nodes = {
  __typename: "Convention",
  id: number,
  name: string,
  images: Array<ConventionsConnection_conventionsConnection_nodes_images>,
  start: any,
  end: any,
  extraInfo: Array<ConventionsConnection_conventionsConnection_nodes_extraInfo>,
  userInfo: Array<ConventionsConnection_conventionsConnection_nodes_userInfo>,
};

export type ConventionsConnection_conventionsConnection = {
  __typename: "ConventionsConnection",
  nodes: Array<ConventionsConnection_conventionsConnection_nodes>,
  endCursor: ?string,
  totalNodes: number,
};

export type ConventionsConnection = {
  /**
   * Retrieves one page of conventions which start after a given date
   */
  conventionsConnection: ConventionsConnection_conventionsConnection
};

export type ConventionsConnectionVariables = {
  date?: ?any,
  search?: ?string,
  limit?: ?number,
  before?: ?string,
  after?: ?string,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FullConvention
// ====================================================

export type FullConvention_convention_images = {
  __typename: "ConventionImage",
  id: string,
};

export type FullConvention_convention_extraInfo = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};

export type FullConvention_convention_userInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};

export type FullConvention_convention_products = {
  __typename: "Product",
  id: number,
  typeId: number,
  name: string,
  sku: ?string,
  quantity: number,
  discontinued: boolean,
  sort: number,
};

export type FullConvention_convention_productTypes = {
  __typename: "ProductType",
  id: number,
  name: string,
  color: ?number,
  discontinued: boolean,
  sort: number,
};

export type FullConvention_convention_prices = {
  __typename: "Price",
  typeId: number,
  productId: ?number,
  quantity: number,
  price: any,
};

export type FullConvention_convention_records = {
  __typename: "Record",
  id: number,
  uuid: ?any,
  products: Array<number>,
  price: any,
  time: any,
  info: string,
};

export type FullConvention_convention_expenses = {
  __typename: "Expense",
  id: number,
  uuid: ?any,
  category: string,
  description: string,
  price: any,
  time: any,
};

export type FullConvention_convention = {
  __typename: "Convention",
  id: number,
  name: string,
  images: Array<FullConvention_convention_images>,
  start: any,
  end: any,
  extraInfo: Array<FullConvention_convention_extraInfo>,
  userInfo: Array<FullConvention_convention_userInfo>,
  recordTotal: ?any,
  expenseTotal: ?any,
  products: Array<FullConvention_convention_products>,
  productTypes: Array<FullConvention_convention_productTypes>,
  prices: Array<FullConvention_convention_prices>,
  records: Array<FullConvention_convention_records>,
  expenses: Array<FullConvention_convention_expenses>,
};

export type FullConvention = {
  /**
   * Retrieves the full information of one convention
   */
  convention: FullConvention_convention
};

export type FullConventionVariables = {
  userId?: ?number,
  conId: number,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FullUser
// ====================================================

export type FullUser_user_settings = {
  __typename: "Settings",
  currency: any,
  language: string,
};

export type FullUser_user_conventions_images = {
  __typename: "ConventionImage",
  id: string,
};

export type FullUser_user_conventions_extraInfo = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};

export type FullUser_user_conventions_userInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};

export type FullUser_user_conventions = {
  __typename: "Convention",
  id: number,
  name: string,
  images: Array<FullUser_user_conventions_images>,
  start: any,
  end: any,
  extraInfo: Array<FullUser_user_conventions_extraInfo>,
  userInfo: Array<FullUser_user_conventions_userInfo>,
  recordTotal: ?any,
  expenseTotal: ?any,
};

export type FullUser_user_products = {
  __typename: "Product",
  id: number,
  typeId: number,
  name: string,
  sku: ?string,
  quantity: number,
  discontinued: boolean,
  sort: number,
};

export type FullUser_user_productTypes = {
  __typename: "ProductType",
  id: number,
  name: string,
  color: ?number,
  discontinued: boolean,
  sort: number,
};

export type FullUser_user_prices = {
  __typename: "Price",
  typeId: number,
  productId: ?number,
  quantity: number,
  price: any,
};

export type FullUser_user = {
  __typename: "User",
  name: string,
  email: string,
  verified: boolean,
  settings: FullUser_user_settings,
  conventions: Array<FullUser_user_conventions>,
  clearance: number,
  products: Array<FullUser_user_products>,
  productTypes: Array<FullUser_user_productTypes>,
  prices: Array<FullUser_user_prices>,
};

export type FullUser = {
  /**
   * Retrieves one user, corresponding to the provided ID
   */
  user: FullUser_user
};

export type FullUserVariables = {
  id?: ?number
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: RecordsConnection
// ====================================================

export type RecordsConnection_recordsConnection_nodes = {
  __typename: "Record",
  id: number,
  uuid: ?any,
  products: Array<number>,
  price: any,
  time: any,
  info: string,
};

export type RecordsConnection_recordsConnection = {
  __typename: "RecordsConnection",
  nodes: Array<RecordsConnection_recordsConnection_nodes>,
  endCursor: ?string,
  totalNodes: number,
};

export type RecordsConnection = {
  /**
   * Retrieves one page of records from sales not at a convention
   */
  recordsConnection: RecordsConnection_recordsConnection
};

export type RecordsConnectionVariables = {
  limit?: ?number,
  before?: ?string,
  after?: ?string,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SuggestionsConnection
// ====================================================

export type SuggestionsConnection_suggestionsConnection_nodes_suggester = {
  __typename: "User",
  name: string,
};

export type SuggestionsConnection_suggestionsConnection_nodes = {
  __typename: "Suggestion",
  id: number,
  suggestion: string,
  suggester: SuggestionsConnection_suggestionsConnection_nodes_suggester,
  status: number,
  suggestedAt: any,
  ranking: number,
  voted: boolean,
};

export type SuggestionsConnection_suggestionsConnection = {
  __typename: "SuggestionsConnection",
  nodes: Array<SuggestionsConnection_suggestionsConnection_nodes>,
  endCursor: ?string,
  totalNodes: number,
};

export type SuggestionsConnection = {
  /**
   * Retrieves one page of suggestions
   */
  suggestionsConnection: SuggestionsConnection_suggestionsConnection
};

export type SuggestionsConnectionVariables = {
  search?: ?string,
  limit?: ?number,
  before?: ?string,
  after?: ?string,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: User
// ====================================================

export type User_user_settings = {
  __typename: "Settings",
  currency: any,
  language: string,
};

export type User_user_conventions_images = {
  __typename: "ConventionImage",
  id: string,
};

export type User_user_conventions_extraInfo = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};

export type User_user_conventions_userInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};

export type User_user_conventions = {
  __typename: "Convention",
  id: number,
  name: string,
  images: Array<User_user_conventions_images>,
  start: any,
  end: any,
  extraInfo: Array<User_user_conventions_extraInfo>,
  userInfo: Array<User_user_conventions_userInfo>,
  recordTotal: ?any,
  expenseTotal: ?any,
};

export type User_user = {
  __typename: "User",
  name: string,
  email: string,
  verified: boolean,
  settings: User_user_settings,
  conventions: Array<User_user_conventions>,
};

export type User = {
  /**
   * Retrieves one user, corresponding to the provided ID
   */
  user: User_user
};

export type UserVariables = {
  id?: ?number
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ConventionBasicInfoFragment
// ====================================================

export type ConventionBasicInfoFragment_images = {
  __typename: "ConventionImage",
  id: string,
};

export type ConventionBasicInfoFragment_extraInfo = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};

export type ConventionBasicInfoFragment_userInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};

export type ConventionBasicInfoFragment = {
  __typename: "Convention",
  id: number,
  name: string,
  images: Array<ConventionBasicInfoFragment_images>,
  start: any,
  end: any,
  extraInfo: Array<ConventionBasicInfoFragment_extraInfo>,
  userInfo: Array<ConventionBasicInfoFragment_userInfo>,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ConventionImageFragment
// ====================================================

export type ConventionImageFragment = {
  __typename: "ConventionImage",
  id: string,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ExpenseFragment
// ====================================================

export type ExpenseFragment = {
  __typename: "Expense",
  id: number,
  uuid: ?any,
  category: string,
  description: string,
  price: any,
  time: any,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ExtraInfoFragment
// ====================================================

export type ExtraInfoFragment = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullConventionFragment
// ====================================================

export type FullConventionFragment_images = {
  __typename: "ConventionImage",
  id: string,
};

export type FullConventionFragment_extraInfo = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};

export type FullConventionFragment_userInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};

export type FullConventionFragment_products = {
  __typename: "Product",
  id: number,
  typeId: number,
  name: string,
  sku: ?string,
  quantity: number,
  discontinued: boolean,
  sort: number,
};

export type FullConventionFragment_productTypes = {
  __typename: "ProductType",
  id: number,
  name: string,
  color: ?number,
  discontinued: boolean,
  sort: number,
};

export type FullConventionFragment_prices = {
  __typename: "Price",
  typeId: number,
  productId: ?number,
  quantity: number,
  price: any,
};

export type FullConventionFragment_records = {
  __typename: "Record",
  id: number,
  uuid: ?any,
  products: Array<number>,
  price: any,
  time: any,
  info: string,
};

export type FullConventionFragment_expenses = {
  __typename: "Expense",
  id: number,
  uuid: ?any,
  category: string,
  description: string,
  price: any,
  time: any,
};

export type FullConventionFragment = {
  __typename: "Convention",
  id: number,
  name: string,
  images: Array<FullConventionFragment_images>,
  start: any,
  end: any,
  extraInfo: Array<FullConventionFragment_extraInfo>,
  userInfo: Array<FullConventionFragment_userInfo>,
  recordTotal: ?any,
  expenseTotal: ?any,
  products: Array<FullConventionFragment_products>,
  productTypes: Array<FullConventionFragment_productTypes>,
  prices: Array<FullConventionFragment_prices>,
  records: Array<FullConventionFragment_records>,
  expenses: Array<FullConventionFragment_expenses>,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullUserFragment
// ====================================================

export type FullUserFragment_settings = {
  __typename: "Settings",
  currency: any,
  language: string,
};

export type FullUserFragment_conventions_images = {
  __typename: "ConventionImage",
  id: string,
};

export type FullUserFragment_conventions_extraInfo = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};

export type FullUserFragment_conventions_userInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};

export type FullUserFragment_conventions = {
  __typename: "Convention",
  id: number,
  name: string,
  images: Array<FullUserFragment_conventions_images>,
  start: any,
  end: any,
  extraInfo: Array<FullUserFragment_conventions_extraInfo>,
  userInfo: Array<FullUserFragment_conventions_userInfo>,
  recordTotal: ?any,
  expenseTotal: ?any,
};

export type FullUserFragment_products = {
  __typename: "Product",
  id: number,
  typeId: number,
  name: string,
  sku: ?string,
  quantity: number,
  discontinued: boolean,
  sort: number,
};

export type FullUserFragment_productTypes = {
  __typename: "ProductType",
  id: number,
  name: string,
  color: ?number,
  discontinued: boolean,
  sort: number,
};

export type FullUserFragment_prices = {
  __typename: "Price",
  typeId: number,
  productId: ?number,
  quantity: number,
  price: any,
};

export type FullUserFragment = {
  __typename: "User",
  name: string,
  email: string,
  verified: boolean,
  settings: FullUserFragment_settings,
  conventions: Array<FullUserFragment_conventions>,
  clearance: number,
  products: Array<FullUserFragment_products>,
  productTypes: Array<FullUserFragment_productTypes>,
  prices: Array<FullUserFragment_prices>,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: MetaConventionFragment
// ====================================================

export type MetaConventionFragment_images = {
  __typename: "ConventionImage",
  id: string,
};

export type MetaConventionFragment_extraInfo = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};

export type MetaConventionFragment_userInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};

export type MetaConventionFragment = {
  __typename: "Convention",
  id: number,
  name: string,
  images: Array<MetaConventionFragment_images>,
  start: any,
  end: any,
  extraInfo: Array<MetaConventionFragment_extraInfo>,
  userInfo: Array<MetaConventionFragment_userInfo>,
  recordTotal: ?any,
  expenseTotal: ?any,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PriceFragment
// ====================================================

export type PriceFragment = {
  __typename: "Price",
  typeId: number,
  productId: ?number,
  quantity: number,
  price: any,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProductTypeFragment
// ====================================================

export type ProductTypeFragment = {
  __typename: "ProductType",
  id: number,
  name: string,
  color: ?number,
  discontinued: boolean,
  sort: number,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProductFragment
// ====================================================

export type ProductFragment = {
  __typename: "Product",
  id: number,
  typeId: number,
  name: string,
  sku: ?string,
  quantity: number,
  discontinued: boolean,
  sort: number,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RecordFragment
// ====================================================

export type RecordFragment = {
  __typename: "Record",
  id: number,
  uuid: ?any,
  products: Array<number>,
  price: any,
  time: any,
  info: string,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SettingsFragment
// ====================================================

export type SettingsFragment = {
  __typename: "Settings",
  currency: any,
  language: string,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SuggestionFragment
// ====================================================

export type SuggestionFragment_suggester = {
  __typename: "User",
  name: string,
};

export type SuggestionFragment = {
  __typename: "Suggestion",
  id: number,
  suggestion: string,
  suggester: SuggestionFragment_suggester,
  status: number,
  suggestedAt: any,
  ranking: number,
  voted: boolean,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserInfoFragment
// ====================================================

export type UserInfoFragment = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserFragment
// ====================================================

export type UserFragment_settings = {
  __typename: "Settings",
  currency: any,
  language: string,
};

export type UserFragment_conventions_images = {
  __typename: "ConventionImage",
  id: string,
};

export type UserFragment_conventions_extraInfo = {
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
};

export type UserFragment_conventions_userInfo = {
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
};

export type UserFragment_conventions = {
  __typename: "Convention",
  id: number,
  name: string,
  images: Array<UserFragment_conventions_images>,
  start: any,
  end: any,
  extraInfo: Array<UserFragment_conventions_extraInfo>,
  userInfo: Array<UserFragment_conventions_userInfo>,
  recordTotal: ?any,
  expenseTotal: ?any,
};

export type UserFragment = {
  __typename: "User",
  name: string,
  email: string,
  verified: boolean,
  settings: UserFragment_settings,
  conventions: Array<UserFragment_conventions>,
};
/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: VotesFragment
// ====================================================

export type VotesFragment = {
  __typename: "ConventionUserInfo",
  upvotes: number,
  downvotes: number,
};/* @flow */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export type ExpenseAdd = {|
  conId: number,
  uuid: any,
  price: any,
  category: string,
  description: string,
  time: any,
|};
/**
 *  Information required to create a convention expense
 */

export type PriceAdd = {|
  typeId: number,
  productId?: ?number,
  quantity: number,
  price: any,
|};
/**
 *  Information required to create a new price
 */

export type ProductTypeAdd = {|
  name: string,
  color: number,
  sort: number,
|};
/**
 *  Information required to create a new product type
 */

export type ProductAdd = {|
  typeId: number,
  name: string,
  sku?: ?string,
  quantity: number,
  sort: number,
|};
/**
 *  Information required to create a new product
 */

export type RecordAdd = {|
  conId?: ?number,
  uuid: any,
  products: Array<number>,
  price: any,
  time: any,
  info: string,
|};
/**
 *  Information required to create a sales record
 */

export type ExpenseDel = {|
  expenseId?: ?number,
  uuid?: ?any,
|};
/**
 *  Information required to delete a convention expense
 */

export type PriceDel = {|
  typeId: number,
  productId?: ?number,
  quantity: number,
|};
/**
 *  Information required to delete an existing price
 */

export type RecordDel = {|
  recordId?: ?number,
  uuid?: ?any,
|};
/**
 *  Information required to delete a sales record
 */

export type ProductTypeMod = {|
  typeId: number,
  name?: ?string,
  color?: ?number,
  discontinued?: ?boolean,
  sort?: ?number,
|};
/**
 *  Information required to modify an existing product type
 */

export type ProductMod = {|
  productId: number,
  name?: ?string,
  sku?: ?string,
  quantity?: ?number,
  discontinued?: ?boolean,
  sort?: ?number,
|};
/**
 *  Information required to modify an existing product
 */

export type ExpenseMod = {|
  expenseId: number,
  price?: ?any,
  category?: ?string,
  description?: ?string,
|};
/**
 *  Information required to modify a convention expense
 */

export type RecordMod = {|
  recordId: number,
  products?: ?Array<number>,
  price?: ?any,
  info?: ?string,
|};
/**
 *  Information required to modify a sales record
 */

//==============================================================
// END Enums and Input Objects
//==============================================================