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

export type ProductTypeAdd = {|
  name: string,
  color: number,
|};

export type ProductAdd = {|
  typeId: number,
  name: string,
  quantity: number,
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

export type RecordDel = {|
  recordId: number,
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

export type DeleteExpenseMutationVariables = {|
  id?: ?number,
  expense: ExpenseDel,
|};

export type DeleteExpenseMutation = {|
  delUserExpense: boolean,
|};

export type DeleteRecordMutationVariables = {|
  id?: ?number,
  record: RecordDel,
|};

export type DeleteRecordMutation = {|
  delUserRecord: boolean,
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

export type ConventionPageQueryVariables = {|
  date?: ?any,
  limit?: ?number,
  page?: ?number,
|};

export type ConventionPageQuery = {|
  // Retrieves one page of conventions which start after a given date
  convention: {|
    __typename: "ConventionPages",
    page: number,
    pages: number,
    data:  Array< {|
      __typename: "Convention",
      id: number,
      name: string,
      start: any,
      end: any,
    |} >,
  |},
|};

export type FullConventionQueryVariables = {|
  userId?: ?number,
  conId: number,
|};

export type FullConventionQuery = {|
  // Retrieves the full information of one user's convention
  userConvention: {|
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
    |} >,
    productTypes:  Array< {|
      __typename: "ProductType",
      id: number,
      name: string,
      color: ?number,
      discontinued: boolean,
    |} >,
    prices:  Array< {|
      __typename: "Price",
      priceId: number,
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
    products:  Array< {|
      __typename: "Product",
      id: number,
      typeId: number,
      name: string,
      quantity: number,
      discontinued: boolean,
    |} >,
    productTypes:  Array< {|
      __typename: "ProductType",
      id: number,
      name: string,
      color: ?number,
      discontinued: boolean,
    |} >,
    prices:  Array< {|
      __typename: "Price",
      priceId: number,
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
  |} >,
  productTypes:  Array< {|
    __typename: "ProductType",
    id: number,
    name: string,
    color: ?number,
    discontinued: boolean,
  |} >,
  prices:  Array< {|
    __typename: "Price",
    priceId: number,
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
  products:  Array< {|
    __typename: "Product",
    id: number,
    typeId: number,
    name: string,
    quantity: number,
    discontinued: boolean,
  |} >,
  productTypes:  Array< {|
    __typename: "ProductType",
    id: number,
    name: string,
    color: ?number,
    discontinued: boolean,
  |} >,
  prices:  Array< {|
    __typename: "Price",
    priceId: number,
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
  priceId: number,
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
|};

export type ProductFragmentFragment = {|
  __typename: "Product",
  id: number,
  typeId: number,
  name: string,
  quantity: number,
  discontinued: boolean,
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