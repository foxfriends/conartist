/* @flow */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ExpenseAdd = {|
  conId: number,
  price: any,
  category: string,
  description: string,
  time: any,
|};

export type PriceAdd = {|
  typeId: number,
  productId?: ?number,
  quantity: number,
  price: any,
|};

export type ProductTypeAdd = {|
  name: string,
  color: number,
  sort: number,
|};

export type ProductAdd = {|
  typeId: number,
  name: string,
  quantity: number,
  sort: number,
|};

export type RecordAdd = {|
  conId: number,
  products: Array< number >,
  price: any,
  time: any,
  info: string,
|};

export type ExpenseDel = {|
  expenseId: number,
|};

export type PriceDel = {|
  typeId: number,
  productId?: ?number,
  quantity: number,
|};

export type RecordDel = {|
  recordId: number,
|};

export type ProductTypeMod = {|
  typeId: number,
  name?: ?string,
  color?: ?number,
  discontinued?: ?boolean,
  sort?: ?number,
|};

export type ProductMod = {|
  productId: number,
  name?: ?string,
  quantity?: ?number,
  discontinued?: ?boolean,
  sort?: ?number,
|};

export type ExpenseMod = {|
  expenseId: number,
  price?: ?any,
  category?: ?string,
  description?: ?string,
|};

export type RecordMod = {|
  recordId: number,
  products?: ?Array< number >,
  price?: ?any,
  info?: ?string,
|};

export type AddConventionInfoMutationVariables = {|
  conId: number,
  title: string,
  info?: ?string,
  action?: ?string,
  actionText?: ?string,
|};

export type AddConventionInfoMutation = {|
  addConventionExtraInfo: {|
    __typename: "ConventionExtraInfo",
    title: string,
    info: ?string,
    action: ?string,
    actionText: ?string,
  |},
|};

export type AddExpenseMutationVariables = {|
  id?: ?number,
  expense: ExpenseAdd,
|};

export type AddExpenseMutation = {|
  addUserExpense: {|
    __typename: "Expense",
    id: number,
    category: string,
    description: string,
    price: any,
    time: any,
  |},
|};

export type AddPriceMutationVariables = {|
  userId?: ?number,
  price: PriceAdd,
|};

export type AddPriceMutation = {|
  addUserPrice: {|
    __typename: "Price",
    typeId: number,
    productId: ?number,
    quantity: number,
    price: any,
  |},
|};

export type AddProductTypeMutationVariables = {|
  id?: ?number,
  productType: ProductTypeAdd,
|};

export type AddProductTypeMutation = {|
  addUserProductType: {|
    __typename: "ProductType",
    id: number,
    name: string,
    color: ?number,
    discontinued: boolean,
    sort: number,
  |},
|};

export type AddProductMutationVariables = {|
  id?: ?number,
  product: ProductAdd,
|};

export type AddProductMutation = {|
  addUserProduct: {|
    __typename: "Product",
    id: number,
    typeId: number,
    name: string,
    quantity: number,
    discontinued: boolean,
    sort: number,
  |},
|};

export type AddRecordMutationVariables = {|
  id?: ?number,
  record: RecordAdd,
|};

export type AddRecordMutation = {|
  addUserRecord: {|
    __typename: "Record",
    id: number,
    products: Array< number >,
    price: any,
    time: any,
    info: string,
  |},
|};

export type AddUserConventionMutationVariables = {|
  userId?: ?number,
  conId: number,
|};

export type AddUserConventionMutation = {|
  addUserConvention: {|
    __typename: "Convention",
    id: number,
    name: string,
    images:  Array< {|
      __typename: "ConventionImage",
      id: string,
    |} >,
    start: any,
    end: any,
    extraInfo:  Array< {|
      __typename: "ConventionExtraInfo",
      title: string,
      info: ?string,
      action: ?string,
      actionText: ?string,
    |} >,
    userInfo:  Array< {|
      __typename: "ConventionUserInfo",
      id: number,
      info: string,
      vote: number,
      upvotes: number,
      downvotes: number,
    |} >,
    recordTotal: ?any,
    expenseTotal: ?any,
  |},
|};

export type ContributeConventionInfoMutationVariables = {|
  userId?: ?number,
  conId: number,
  info: string,
|};

export type ContributeConventionInfoMutation = {|
  addConventionInfo: {|
    __typename: "ConventionUserInfo",
    id: number,
    info: string,
    vote: number,
    upvotes: number,
    downvotes: number,
  |},
|};

export type CreateConventionMutationVariables = {|
  title: string,
  startDate: any,
  endDate: any,
|};

export type CreateConventionMutation = {|
  createConvention: {|
    __typename: "Convention",
    id: number,
  |},
|};

export type DeleteExpenseMutationVariables = {|
  id?: ?number,
  expense: ExpenseDel,
|};

export type DeleteExpenseMutation = {|
  delUserExpense: boolean,
|};

export type DeletePriceMutationVariables = {|
  userId?: ?number,
  price: PriceDel,
|};

export type DeletePriceMutation = {|
  delUserPrice: boolean,
|};

export type DeleteRecordMutationVariables = {|
  id?: ?number,
  record: RecordDel,
|};

export type DeleteRecordMutation = {|
  delUserRecord: boolean,
|};

export type DeleteUserConventionMutationVariables = {|
  userId?: ?number,
  conId: number,
|};

export type DeleteUserConventionMutation = {|
  delUserConvention: boolean,
|};

export type DownvoteConventionInfoMutationVariables = {|
  userId?: ?number,
  infoId: number,
|};

export type DownvoteConventionInfoMutation = {|
  downvoteConventionInfo: {|
    __typename: "ConventionUserInfo",
    id: number,
    upvotes: number,
    downvotes: number,
  |},
|};

export type ModProductTypeMutationVariables = {|
  id?: ?number,
  productType: ProductTypeMod,
|};

export type ModProductTypeMutation = {|
  modUserProductType: {|
    __typename: "ProductType",
    id: number,
    name: string,
    color: ?number,
    discontinued: boolean,
    sort: number,
  |},
|};

export type ModProductMutationVariables = {|
  id?: ?number,
  product: ProductMod,
|};

export type ModProductMutation = {|
  modUserProduct: {|
    __typename: "Product",
    id: number,
    typeId: number,
    name: string,
    quantity: number,
    discontinued: boolean,
    sort: number,
  |},
|};

export type UpdateCurrencyMutationVariables = {|
  id?: ?number,
  currency: any,
|};

export type UpdateCurrencyMutation = {|
  updateSettings: {|
    __typename: "SettingsMutation",
    currency: any,
  |},
|};

export type UpdateExpenseMutationVariables = {|
  id?: ?number,
  expense: ExpenseMod,
|};

export type UpdateExpenseMutation = {|
  modUserExpense: {|
    __typename: "Expense",
    id: number,
    category: string,
    description: string,
    price: any,
    time: any,
  |},
|};

export type UpdateRecordMutationVariables = {|
  id?: ?number,
  record: RecordMod,
|};

export type UpdateRecordMutation = {|
  modUserRecord: {|
    __typename: "Record",
    id: number,
    products: Array< number >,
    price: any,
    time: any,
    info: string,
  |},
|};

export type UpvoteConventionInfoMutationVariables = {|
  userId?: ?number,
  infoId: number,
|};

export type UpvoteConventionInfoMutation = {|
  upvoteConventionInfo: {|
    __typename: "ConventionUserInfo",
    id: number,
    upvotes: number,
    downvotes: number,
  |},
|};

export type ConventionsConnectionQueryVariables = {|
  date?: ?any,
  search?: ?string,
  limit?: ?number,
  before?: ?string,
  after?: ?string,
|};

export type ConventionsConnectionQuery = {|
  // Retrieves one page of conventions which start after a given date
  conventionsConnection: {|
    __typename: "ConventionsConnection",
    nodes:  Array< {|
      __typename: "Convention",
      id: number,
      name: string,
      images:  Array< {|
        __typename: "ConventionImage",
        id: string,
      |} >,
      start: any,
      end: any,
      extraInfo:  Array< {|
        __typename: "ConventionExtraInfo",
        title: string,
        info: ?string,
        action: ?string,
        actionText: ?string,
      |} >,
      userInfo:  Array< {|
        __typename: "ConventionUserInfo",
        id: number,
        info: string,
        vote: number,
        upvotes: number,
        downvotes: number,
      |} >,
    |} >,
    endCursor: ?string,
    totalNodes: number,
  |},
|};

export type FullConventionQueryVariables = {|
  userId?: ?number,
  conId: number,
|};

export type FullConventionQuery = {|
  // Retrieves the full information of one convention
  convention: {|
    __typename: "Convention",
    id: number,
    name: string,
    images:  Array< {|
      __typename: "ConventionImage",
      id: string,
    |} >,
    start: any,
    end: any,
    extraInfo:  Array< {|
      __typename: "ConventionExtraInfo",
      title: string,
      info: ?string,
      action: ?string,
      actionText: ?string,
    |} >,
    userInfo:  Array< {|
      __typename: "ConventionUserInfo",
      id: number,
      info: string,
      vote: number,
      upvotes: number,
      downvotes: number,
    |} >,
    recordTotal: ?any,
    expenseTotal: ?any,
    products:  Array< {|
      __typename: "Product",
      id: number,
      typeId: number,
      name: string,
      quantity: number,
      discontinued: boolean,
      sort: number,
    |} >,
    productTypes:  Array< {|
      __typename: "ProductType",
      id: number,
      name: string,
      color: ?number,
      discontinued: boolean,
      sort: number,
    |} >,
    prices:  Array< {|
      __typename: "Price",
      typeId: number,
      productId: ?number,
      quantity: number,
      price: any,
    |} >,
    records:  Array< {|
      __typename: "Record",
      id: number,
      products: Array< number >,
      price: any,
      time: any,
      info: string,
    |} >,
    expenses:  Array< {|
      __typename: "Expense",
      id: number,
      category: string,
      description: string,
      price: any,
      time: any,
    |} >,
  |},
|};

export type FullUserQueryVariables = {|
  id?: ?number,
|};

export type FullUserQuery = {|
  // Retrieves one user, corresponding to the provided ID
  user: {|
    __typename: "User",
    name: string,
    email: string,
    settings: {|
      __typename: "Settings",
      currency: any,
      language: string,
    |},
    conventions:  Array< {|
      __typename: "Convention",
      id: number,
      name: string,
      images:  Array< {|
        __typename: "ConventionImage",
        id: string,
      |} >,
      start: any,
      end: any,
      extraInfo:  Array< {|
        __typename: "ConventionExtraInfo",
        title: string,
        info: ?string,
        action: ?string,
        actionText: ?string,
      |} >,
      userInfo:  Array< {|
        __typename: "ConventionUserInfo",
        id: number,
        info: string,
        vote: number,
        upvotes: number,
        downvotes: number,
      |} >,
      recordTotal: ?any,
      expenseTotal: ?any,
    |} >,
    clearance: number,
    products:  Array< {|
      __typename: "Product",
      id: number,
      typeId: number,
      name: string,
      quantity: number,
      discontinued: boolean,
      sort: number,
    |} >,
    productTypes:  Array< {|
      __typename: "ProductType",
      id: number,
      name: string,
      color: ?number,
      discontinued: boolean,
      sort: number,
    |} >,
    prices:  Array< {|
      __typename: "Price",
      typeId: number,
      productId: ?number,
      quantity: number,
      price: any,
    |} >,
  |},
|};

export type UserQueryVariables = {|
  id?: ?number,
|};

export type UserQuery = {|
  // Retrieves one user, corresponding to the provided ID
  user: {|
    __typename: "User",
    name: string,
    email: string,
    settings: {|
      __typename: "Settings",
      currency: any,
      language: string,
    |},
    conventions:  Array< {|
      __typename: "Convention",
      id: number,
      name: string,
      images:  Array< {|
        __typename: "ConventionImage",
        id: string,
      |} >,
      start: any,
      end: any,
      extraInfo:  Array< {|
        __typename: "ConventionExtraInfo",
        title: string,
        info: ?string,
        action: ?string,
        actionText: ?string,
      |} >,
      userInfo:  Array< {|
        __typename: "ConventionUserInfo",
        id: number,
        info: string,
        vote: number,
        upvotes: number,
        downvotes: number,
      |} >,
      recordTotal: ?any,
      expenseTotal: ?any,
    |} >,
  |},
|};

export type ConventionBasicInfoFragmentFragment = {|
  __typename: "Convention",
  id: number,
  name: string,
  images:  Array< {|
    __typename: "ConventionImage",
    id: string,
  |} >,
  start: any,
  end: any,
  extraInfo:  Array< {|
    __typename: "ConventionExtraInfo",
    title: string,
    info: ?string,
    action: ?string,
    actionText: ?string,
  |} >,
  userInfo:  Array< {|
    __typename: "ConventionUserInfo",
    id: number,
    info: string,
    vote: number,
    upvotes: number,
    downvotes: number,
  |} >,
|};

export type ConventionImageFragmentFragment = {|
  __typename: "ConventionImage",
  id: string,
|};

export type ExpenseFragmentFragment = {|
  __typename: "Expense",
  id: number,
  category: string,
  description: string,
  price: any,
  time: any,
|};

export type ExtraInfoFragmentFragment = {|
  __typename: "ConventionExtraInfo",
  title: string,
  info: ?string,
  action: ?string,
  actionText: ?string,
|};

export type FullConventionFragmentFragment = {|
  __typename: "Convention",
  id: number,
  name: string,
  images:  Array< {|
    __typename: "ConventionImage",
    id: string,
  |} >,
  start: any,
  end: any,
  extraInfo:  Array< {|
    __typename: "ConventionExtraInfo",
    title: string,
    info: ?string,
    action: ?string,
    actionText: ?string,
  |} >,
  userInfo:  Array< {|
    __typename: "ConventionUserInfo",
    id: number,
    info: string,
    vote: number,
    upvotes: number,
    downvotes: number,
  |} >,
  recordTotal: ?any,
  expenseTotal: ?any,
  products:  Array< {|
    __typename: "Product",
    id: number,
    typeId: number,
    name: string,
    quantity: number,
    discontinued: boolean,
    sort: number,
  |} >,
  productTypes:  Array< {|
    __typename: "ProductType",
    id: number,
    name: string,
    color: ?number,
    discontinued: boolean,
    sort: number,
  |} >,
  prices:  Array< {|
    __typename: "Price",
    typeId: number,
    productId: ?number,
    quantity: number,
    price: any,
  |} >,
  records:  Array< {|
    __typename: "Record",
    id: number,
    products: Array< number >,
    price: any,
    time: any,
    info: string,
  |} >,
  expenses:  Array< {|
    __typename: "Expense",
    id: number,
    category: string,
    description: string,
    price: any,
    time: any,
  |} >,
|};

export type FullUserFragmentFragment = {|
  __typename: "User",
  name: string,
  email: string,
  settings: {|
    __typename: "Settings",
    currency: any,
    language: string,
  |},
  conventions:  Array< {|
    __typename: "Convention",
    id: number,
    name: string,
    images:  Array< {|
      __typename: "ConventionImage",
      id: string,
    |} >,
    start: any,
    end: any,
    extraInfo:  Array< {|
      __typename: "ConventionExtraInfo",
      title: string,
      info: ?string,
      action: ?string,
      actionText: ?string,
    |} >,
    userInfo:  Array< {|
      __typename: "ConventionUserInfo",
      id: number,
      info: string,
      vote: number,
      upvotes: number,
      downvotes: number,
    |} >,
    recordTotal: ?any,
    expenseTotal: ?any,
  |} >,
  clearance: number,
  products:  Array< {|
    __typename: "Product",
    id: number,
    typeId: number,
    name: string,
    quantity: number,
    discontinued: boolean,
    sort: number,
  |} >,
  productTypes:  Array< {|
    __typename: "ProductType",
    id: number,
    name: string,
    color: ?number,
    discontinued: boolean,
    sort: number,
  |} >,
  prices:  Array< {|
    __typename: "Price",
    typeId: number,
    productId: ?number,
    quantity: number,
    price: any,
  |} >,
|};

export type MetaConventionFragmentFragment = {|
  __typename: "Convention",
  id: number,
  name: string,
  images:  Array< {|
    __typename: "ConventionImage",
    id: string,
  |} >,
  start: any,
  end: any,
  extraInfo:  Array< {|
    __typename: "ConventionExtraInfo",
    title: string,
    info: ?string,
    action: ?string,
    actionText: ?string,
  |} >,
  userInfo:  Array< {|
    __typename: "ConventionUserInfo",
    id: number,
    info: string,
    vote: number,
    upvotes: number,
    downvotes: number,
  |} >,
  recordTotal: ?any,
  expenseTotal: ?any,
|};

export type PriceFragmentFragment = {|
  __typename: "Price",
  typeId: number,
  productId: ?number,
  quantity: number,
  price: any,
|};

export type ProductTypeFragmentFragment = {|
  __typename: "ProductType",
  id: number,
  name: string,
  color: ?number,
  discontinued: boolean,
  sort: number,
|};

export type ProductFragmentFragment = {|
  __typename: "Product",
  id: number,
  typeId: number,
  name: string,
  quantity: number,
  discontinued: boolean,
  sort: number,
|};

export type RecordFragmentFragment = {|
  __typename: "Record",
  id: number,
  products: Array< number >,
  price: any,
  time: any,
  info: string,
|};

export type SettingsFragmentFragment = {|
  __typename: "Settings",
  currency: any,
  language: string,
|};

export type UserInfoFragmentFragment = {|
  __typename: "ConventionUserInfo",
  id: number,
  info: string,
  vote: number,
  upvotes: number,
  downvotes: number,
|};

export type UserFragmentFragment = {|
  __typename: "User",
  name: string,
  email: string,
  settings: {|
    __typename: "Settings",
    currency: any,
    language: string,
  |},
  conventions:  Array< {|
    __typename: "Convention",
    id: number,
    name: string,
    images:  Array< {|
      __typename: "ConventionImage",
      id: string,
    |} >,
    start: any,
    end: any,
    extraInfo:  Array< {|
      __typename: "ConventionExtraInfo",
      title: string,
      info: ?string,
      action: ?string,
      actionText: ?string,
    |} >,
    userInfo:  Array< {|
      __typename: "ConventionUserInfo",
      id: number,
      info: string,
      vote: number,
      upvotes: number,
      downvotes: number,
    |} >,
    recordTotal: ?any,
    expenseTotal: ?any,
  |} >,
|};

export type VotesFragmentFragment = {|
  __typename: "ConventionUserInfo",
  upvotes: number,
  downvotes: number,
|};