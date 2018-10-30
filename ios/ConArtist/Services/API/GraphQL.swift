//  This file was automatically generated and should not be edited.

import Apollo

/// Information required to modify a sales record
public struct RecordMod: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(recordId: Int, products: Swift.Optional<[Int]?> = nil, price: Swift.Optional<String?> = nil, info: Swift.Optional<String?> = nil) {
    graphQLMap = ["recordId": recordId, "products": products, "price": price, "info": info]
  }

  public var recordId: Int {
    get {
      return graphQLMap["recordId"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "recordId")
    }
  }

  public var products: Swift.Optional<[Int]?> {
    get {
      return graphQLMap["products"] as! Swift.Optional<[Int]?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "products")
    }
  }

  public var price: Swift.Optional<String?> {
    get {
      return graphQLMap["price"] as! Swift.Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "price")
    }
  }

  public var info: Swift.Optional<String?> {
    get {
      return graphQLMap["info"] as! Swift.Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "info")
    }
  }
}

/// Information required to create a convention expense
public struct ExpenseAdd: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(conId: Int, uuid: String, price: String, category: String, description: String, time: String) {
    graphQLMap = ["conId": conId, "uuid": uuid, "price": price, "category": category, "description": description, "time": time]
  }

  public var conId: Int {
    get {
      return graphQLMap["conId"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "conId")
    }
  }

  public var uuid: String {
    get {
      return graphQLMap["uuid"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "uuid")
    }
  }

  public var price: String {
    get {
      return graphQLMap["price"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "price")
    }
  }

  public var category: String {
    get {
      return graphQLMap["category"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "category")
    }
  }

  public var description: String {
    get {
      return graphQLMap["description"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "description")
    }
  }

  public var time: String {
    get {
      return graphQLMap["time"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "time")
    }
  }
}

/// Information required to create a new product type
public struct ProductTypeAdd: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(name: String, color: Int, sort: Int) {
    graphQLMap = ["name": name, "color": color, "sort": sort]
  }

  public var name: String {
    get {
      return graphQLMap["name"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "name")
    }
  }

  public var color: Int {
    get {
      return graphQLMap["color"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "color")
    }
  }

  public var sort: Int {
    get {
      return graphQLMap["sort"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "sort")
    }
  }
}

/// Information required to create a new product
public struct ProductAdd: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(typeId: Int, name: String, quantity: Int, sort: Int) {
    graphQLMap = ["typeId": typeId, "name": name, "quantity": quantity, "sort": sort]
  }

  public var typeId: Int {
    get {
      return graphQLMap["typeId"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "typeId")
    }
  }

  public var name: String {
    get {
      return graphQLMap["name"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "name")
    }
  }

  public var quantity: Int {
    get {
      return graphQLMap["quantity"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "quantity")
    }
  }

  public var sort: Int {
    get {
      return graphQLMap["sort"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "sort")
    }
  }
}

/// Information required to delete a sales record
public struct RecordDel: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(recordId: Swift.Optional<Int?> = nil, uuid: Swift.Optional<String?> = nil) {
    graphQLMap = ["recordId": recordId, "uuid": uuid]
  }

  public var recordId: Swift.Optional<Int?> {
    get {
      return graphQLMap["recordId"] as! Swift.Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "recordId")
    }
  }

  public var uuid: Swift.Optional<String?> {
    get {
      return graphQLMap["uuid"] as! Swift.Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "uuid")
    }
  }
}

/// Information required to create a new price
public struct PriceAdd: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(typeId: Int, productId: Swift.Optional<Int?> = nil, quantity: Int, price: String) {
    graphQLMap = ["typeId": typeId, "productId": productId, "quantity": quantity, "price": price]
  }

  public var typeId: Int {
    get {
      return graphQLMap["typeId"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "typeId")
    }
  }

  public var productId: Swift.Optional<Int?> {
    get {
      return graphQLMap["productId"] as! Swift.Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "productId")
    }
  }

  public var quantity: Int {
    get {
      return graphQLMap["quantity"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "quantity")
    }
  }

  public var price: String {
    get {
      return graphQLMap["price"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "price")
    }
  }
}

/// Information required to modify a convention expense
public struct ExpenseMod: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(expenseId: Int, price: Swift.Optional<String?> = nil, category: Swift.Optional<String?> = nil, description: Swift.Optional<String?> = nil) {
    graphQLMap = ["expenseId": expenseId, "price": price, "category": category, "description": description]
  }

  public var expenseId: Int {
    get {
      return graphQLMap["expenseId"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "expenseId")
    }
  }

  public var price: Swift.Optional<String?> {
    get {
      return graphQLMap["price"] as! Swift.Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "price")
    }
  }

  public var category: Swift.Optional<String?> {
    get {
      return graphQLMap["category"] as! Swift.Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "category")
    }
  }

  public var description: Swift.Optional<String?> {
    get {
      return graphQLMap["description"] as! Swift.Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "description")
    }
  }
}

/// Information required to delete an existing price
public struct PriceDel: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(typeId: Int, productId: Swift.Optional<Int?> = nil, quantity: Int) {
    graphQLMap = ["typeId": typeId, "productId": productId, "quantity": quantity]
  }

  public var typeId: Int {
    get {
      return graphQLMap["typeId"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "typeId")
    }
  }

  public var productId: Swift.Optional<Int?> {
    get {
      return graphQLMap["productId"] as! Swift.Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "productId")
    }
  }

  public var quantity: Int {
    get {
      return graphQLMap["quantity"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "quantity")
    }
  }
}

/// Information required to modify an existing product
public struct ProductMod: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(productId: Int, name: Swift.Optional<String?> = nil, quantity: Swift.Optional<Int?> = nil, discontinued: Swift.Optional<Bool?> = nil, sort: Swift.Optional<Int?> = nil) {
    graphQLMap = ["productId": productId, "name": name, "quantity": quantity, "discontinued": discontinued, "sort": sort]
  }

  public var productId: Int {
    get {
      return graphQLMap["productId"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "productId")
    }
  }

  public var name: Swift.Optional<String?> {
    get {
      return graphQLMap["name"] as! Swift.Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "name")
    }
  }

  public var quantity: Swift.Optional<Int?> {
    get {
      return graphQLMap["quantity"] as! Swift.Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "quantity")
    }
  }

  public var discontinued: Swift.Optional<Bool?> {
    get {
      return graphQLMap["discontinued"] as! Swift.Optional<Bool?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "discontinued")
    }
  }

  public var sort: Swift.Optional<Int?> {
    get {
      return graphQLMap["sort"] as! Swift.Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "sort")
    }
  }
}

/// Information required to modify an existing product type
public struct ProductTypeMod: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(typeId: Int, name: Swift.Optional<String?> = nil, color: Swift.Optional<Int?> = nil, discontinued: Swift.Optional<Bool?> = nil, sort: Swift.Optional<Int?> = nil) {
    graphQLMap = ["typeId": typeId, "name": name, "color": color, "discontinued": discontinued, "sort": sort]
  }

  public var typeId: Int {
    get {
      return graphQLMap["typeId"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "typeId")
    }
  }

  public var name: Swift.Optional<String?> {
    get {
      return graphQLMap["name"] as! Swift.Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "name")
    }
  }

  public var color: Swift.Optional<Int?> {
    get {
      return graphQLMap["color"] as! Swift.Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "color")
    }
  }

  public var discontinued: Swift.Optional<Bool?> {
    get {
      return graphQLMap["discontinued"] as! Swift.Optional<Bool?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "discontinued")
    }
  }

  public var sort: Swift.Optional<Int?> {
    get {
      return graphQLMap["sort"] as! Swift.Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "sort")
    }
  }
}

/// Information required to delete a convention expense
public struct ExpenseDel: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(expenseId: Swift.Optional<Int?> = nil, uuid: Swift.Optional<String?> = nil) {
    graphQLMap = ["expenseId": expenseId, "uuid": uuid]
  }

  public var expenseId: Swift.Optional<Int?> {
    get {
      return graphQLMap["expenseId"] as! Swift.Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "expenseId")
    }
  }

  public var uuid: Swift.Optional<String?> {
    get {
      return graphQLMap["uuid"] as! Swift.Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "uuid")
    }
  }
}

/// Information required to create a sales record
public struct RecordAdd: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(conId: Int, uuid: String, products: [Int], price: String, time: String, info: String) {
    graphQLMap = ["conId": conId, "uuid": uuid, "products": products, "price": price, "time": time, "info": info]
  }

  public var conId: Int {
    get {
      return graphQLMap["conId"] as! Int
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "conId")
    }
  }

  public var uuid: String {
    get {
      return graphQLMap["uuid"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "uuid")
    }
  }

  public var products: [Int] {
    get {
      return graphQLMap["products"] as! [Int]
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "products")
    }
  }

  public var price: String {
    get {
      return graphQLMap["price"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "price")
    }
  }

  public var time: String {
    get {
      return graphQLMap["time"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "time")
    }
  }

  public var info: String {
    get {
      return graphQLMap["info"] as! String
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "info")
    }
  }
}

public final class UpdateRecordMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation UpdateRecord($id: Int, $record: RecordMod!) {\n  modUserRecord(userId: $id, record: $record) {\n    __typename\n    ...RecordFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(RecordFragment.fragmentDefinition) }

  public var id: Int?
  public var record: RecordMod

  public init(id: Int? = nil, record: RecordMod) {
    self.id = id
    self.record = record
  }

  public var variables: GraphQLMap? {
    return ["id": id, "record": record]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("modUserRecord", arguments: ["userId": GraphQLVariable("id"), "record": GraphQLVariable("record")], type: .nonNull(.object(ModUserRecord.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(modUserRecord: ModUserRecord) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "modUserRecord": modUserRecord.resultMap])
    }

    public var modUserRecord: ModUserRecord {
      get {
        return ModUserRecord(unsafeResultMap: resultMap["modUserRecord"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "modUserRecord")
      }
    }

    public struct ModUserRecord: GraphQLSelectionSet {
      public static let possibleTypes = ["Record"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(RecordFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(id: Int, uuid: String? = nil, products: [Int], price: String, time: String, info: String) {
        self.init(unsafeResultMap: ["__typename": "Record", "id": id, "uuid": uuid, "products": products, "price": price, "time": time, "info": info])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var recordFragment: RecordFragment {
          get {
            return RecordFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class AddExpenseMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation AddExpense($id: Int, $expense: ExpenseAdd!) {\n  addUserExpense(userId: $id, expense: $expense) {\n    __typename\n    ...ExpenseFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(ExpenseFragment.fragmentDefinition) }

  public var id: Int?
  public var expense: ExpenseAdd

  public init(id: Int? = nil, expense: ExpenseAdd) {
    self.id = id
    self.expense = expense
  }

  public var variables: GraphQLMap? {
    return ["id": id, "expense": expense]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("addUserExpense", arguments: ["userId": GraphQLVariable("id"), "expense": GraphQLVariable("expense")], type: .nonNull(.object(AddUserExpense.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(addUserExpense: AddUserExpense) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "addUserExpense": addUserExpense.resultMap])
    }

    public var addUserExpense: AddUserExpense {
      get {
        return AddUserExpense(unsafeResultMap: resultMap["addUserExpense"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "addUserExpense")
      }
    }

    public struct AddUserExpense: GraphQLSelectionSet {
      public static let possibleTypes = ["Expense"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(ExpenseFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(id: Int, uuid: String? = nil, category: String, description: String, price: String, time: String) {
        self.init(unsafeResultMap: ["__typename": "Expense", "id": id, "uuid": uuid, "category": category, "description": description, "price": price, "time": time])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var expenseFragment: ExpenseFragment {
          get {
            return ExpenseFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class ContributeConventionInfoMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation ContributeConventionInfo($userId: Int, $conId: Int!, $info: String!) {\n  addConventionInfo(userId: $userId, conId: $conId, info: $info) {\n    __typename\n    ...UserInfoFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(UserInfoFragment.fragmentDefinition).appending(VotesFragment.fragmentDefinition) }

  public var userId: Int?
  public var conId: Int
  public var info: String

  public init(userId: Int? = nil, conId: Int, info: String) {
    self.userId = userId
    self.conId = conId
    self.info = info
  }

  public var variables: GraphQLMap? {
    return ["userId": userId, "conId": conId, "info": info]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("addConventionInfo", arguments: ["userId": GraphQLVariable("userId"), "conId": GraphQLVariable("conId"), "info": GraphQLVariable("info")], type: .nonNull(.object(AddConventionInfo.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(addConventionInfo: AddConventionInfo) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "addConventionInfo": addConventionInfo.resultMap])
    }

    public var addConventionInfo: AddConventionInfo {
      get {
        return AddConventionInfo(unsafeResultMap: resultMap["addConventionInfo"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "addConventionInfo")
      }
    }

    public struct AddConventionInfo: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionUserInfo"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(UserInfoFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
        self.init(unsafeResultMap: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var userInfoFragment: UserInfoFragment {
          get {
            return UserInfoFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class AddProductTypeMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation AddProductType($id: Int, $productType: ProductTypeAdd!) {\n  addUserProductType(userId: $id, productType: $productType) {\n    __typename\n    ...ProductTypeFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(ProductTypeFragment.fragmentDefinition) }

  public var id: Int?
  public var productType: ProductTypeAdd

  public init(id: Int? = nil, productType: ProductTypeAdd) {
    self.id = id
    self.productType = productType
  }

  public var variables: GraphQLMap? {
    return ["id": id, "productType": productType]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("addUserProductType", arguments: ["userId": GraphQLVariable("id"), "productType": GraphQLVariable("productType")], type: .nonNull(.object(AddUserProductType.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(addUserProductType: AddUserProductType) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "addUserProductType": addUserProductType.resultMap])
    }

    public var addUserProductType: AddUserProductType {
      get {
        return AddUserProductType(unsafeResultMap: resultMap["addUserProductType"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "addUserProductType")
      }
    }

    public struct AddUserProductType: GraphQLSelectionSet {
      public static let possibleTypes = ["ProductType"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(ProductTypeFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(id: Int, name: String, color: Int? = nil, discontinued: Bool, sort: Int) {
        self.init(unsafeResultMap: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued, "sort": sort])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var productTypeFragment: ProductTypeFragment {
          get {
            return ProductTypeFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class AddProductMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation AddProduct($id: Int, $product: ProductAdd!) {\n  addUserProduct(userId: $id, product: $product) {\n    __typename\n    ...ProductFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(ProductFragment.fragmentDefinition) }

  public var id: Int?
  public var product: ProductAdd

  public init(id: Int? = nil, product: ProductAdd) {
    self.id = id
    self.product = product
  }

  public var variables: GraphQLMap? {
    return ["id": id, "product": product]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("addUserProduct", arguments: ["userId": GraphQLVariable("id"), "product": GraphQLVariable("product")], type: .nonNull(.object(AddUserProduct.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(addUserProduct: AddUserProduct) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "addUserProduct": addUserProduct.resultMap])
    }

    public var addUserProduct: AddUserProduct {
      get {
        return AddUserProduct(unsafeResultMap: resultMap["addUserProduct"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "addUserProduct")
      }
    }

    public struct AddUserProduct: GraphQLSelectionSet {
      public static let possibleTypes = ["Product"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(ProductFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool, sort: Int) {
        self.init(unsafeResultMap: ["__typename": "Product", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued, "sort": sort])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var productFragment: ProductFragment {
          get {
            return ProductFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class DeleteRecordMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation DeleteRecord($id: Int, $record: RecordDel!) {\n  delUserRecord(userId: $id, record: $record)\n}"

  public var id: Int?
  public var record: RecordDel

  public init(id: Int? = nil, record: RecordDel) {
    self.id = id
    self.record = record
  }

  public var variables: GraphQLMap? {
    return ["id": id, "record": record]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("delUserRecord", arguments: ["userId": GraphQLVariable("id"), "record": GraphQLVariable("record")], type: .nonNull(.scalar(Bool.self))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(delUserRecord: Bool) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "delUserRecord": delUserRecord])
    }

    public var delUserRecord: Bool {
      get {
        return resultMap["delUserRecord"]! as! Bool
      }
      set {
        resultMap.updateValue(newValue, forKey: "delUserRecord")
      }
    }
  }
}

public final class DeleteUserConventionMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation DeleteUserConvention($userId: Int, $conId: Int!) {\n  delUserConvention(userId: $userId, conId: $conId)\n}"

  public var userId: Int?
  public var conId: Int

  public init(userId: Int? = nil, conId: Int) {
    self.userId = userId
    self.conId = conId
  }

  public var variables: GraphQLMap? {
    return ["userId": userId, "conId": conId]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("delUserConvention", arguments: ["userId": GraphQLVariable("userId"), "conId": GraphQLVariable("conId")], type: .nonNull(.scalar(Bool.self))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(delUserConvention: Bool) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "delUserConvention": delUserConvention])
    }

    public var delUserConvention: Bool {
      get {
        return resultMap["delUserConvention"]! as! Bool
      }
      set {
        resultMap.updateValue(newValue, forKey: "delUserConvention")
      }
    }
  }
}

public final class UpvoteConventionInfoMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation UpvoteConventionInfo($userId: Int, $infoId: Int!) {\n  upvoteConventionInfo(userId: $userId, infoId: $infoId) {\n    __typename\n    id\n    ...VotesFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(VotesFragment.fragmentDefinition) }

  public var userId: Int?
  public var infoId: Int

  public init(userId: Int? = nil, infoId: Int) {
    self.userId = userId
    self.infoId = infoId
  }

  public var variables: GraphQLMap? {
    return ["userId": userId, "infoId": infoId]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("upvoteConventionInfo", arguments: ["userId": GraphQLVariable("userId"), "infoId": GraphQLVariable("infoId")], type: .nonNull(.object(UpvoteConventionInfo.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(upvoteConventionInfo: UpvoteConventionInfo) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "upvoteConventionInfo": upvoteConventionInfo.resultMap])
    }

    public var upvoteConventionInfo: UpvoteConventionInfo {
      get {
        return UpvoteConventionInfo(unsafeResultMap: resultMap["upvoteConventionInfo"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "upvoteConventionInfo")
      }
    }

    public struct UpvoteConventionInfo: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionUserInfo"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLFragmentSpread(VotesFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(id: Int, upvotes: Int, downvotes: Int) {
        self.init(unsafeResultMap: ["__typename": "ConventionUserInfo", "id": id, "upvotes": upvotes, "downvotes": downvotes])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return resultMap["id"]! as! Int
        }
        set {
          resultMap.updateValue(newValue, forKey: "id")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var votesFragment: VotesFragment {
          get {
            return VotesFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class AddUserConventionMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation AddUserConvention($userId: Int, $conId: Int!) {\n  addUserConvention(userId: $userId, conId: $conId) {\n    __typename\n    ...MetaConventionFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(MetaConventionFragment.fragmentDefinition).appending(ConventionBasicInfoFragment.fragmentDefinition).appending(ConventionImageFragment.fragmentDefinition).appending(ExtraInfoFragment.fragmentDefinition).appending(UserInfoFragment.fragmentDefinition).appending(VotesFragment.fragmentDefinition) }

  public var userId: Int?
  public var conId: Int

  public init(userId: Int? = nil, conId: Int) {
    self.userId = userId
    self.conId = conId
  }

  public var variables: GraphQLMap? {
    return ["userId": userId, "conId": conId]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("addUserConvention", arguments: ["userId": GraphQLVariable("userId"), "conId": GraphQLVariable("conId")], type: .nonNull(.object(AddUserConvention.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(addUserConvention: AddUserConvention) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "addUserConvention": addUserConvention.resultMap])
    }

    public var addUserConvention: AddUserConvention {
      get {
        return AddUserConvention(unsafeResultMap: resultMap["addUserConvention"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "addUserConvention")
      }
    }

    public struct AddUserConvention: GraphQLSelectionSet {
      public static let possibleTypes = ["Convention"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(MetaConventionFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var metaConventionFragment: MetaConventionFragment {
          get {
            return MetaConventionFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class AddPriceMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation AddPrice($userId: Int, $price: PriceAdd!) {\n  addUserPrice(userId: $userId, price: $price) {\n    __typename\n    ...PriceFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(PriceFragment.fragmentDefinition) }

  public var userId: Int?
  public var price: PriceAdd

  public init(userId: Int? = nil, price: PriceAdd) {
    self.userId = userId
    self.price = price
  }

  public var variables: GraphQLMap? {
    return ["userId": userId, "price": price]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("addUserPrice", arguments: ["userId": GraphQLVariable("userId"), "price": GraphQLVariable("price")], type: .nonNull(.object(AddUserPrice.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(addUserPrice: AddUserPrice) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "addUserPrice": addUserPrice.resultMap])
    }

    public var addUserPrice: AddUserPrice {
      get {
        return AddUserPrice(unsafeResultMap: resultMap["addUserPrice"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "addUserPrice")
      }
    }

    public struct AddUserPrice: GraphQLSelectionSet {
      public static let possibleTypes = ["Price"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(PriceFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(typeId: Int, productId: Int? = nil, quantity: Int, price: String) {
        self.init(unsafeResultMap: ["__typename": "Price", "typeId": typeId, "productId": productId, "quantity": quantity, "price": price])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var priceFragment: PriceFragment {
          get {
            return PriceFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class UpdateExpenseMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation UpdateExpense($id: Int, $expense: ExpenseMod!) {\n  modUserExpense(userId: $id, expense: $expense) {\n    __typename\n    ...ExpenseFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(ExpenseFragment.fragmentDefinition) }

  public var id: Int?
  public var expense: ExpenseMod

  public init(id: Int? = nil, expense: ExpenseMod) {
    self.id = id
    self.expense = expense
  }

  public var variables: GraphQLMap? {
    return ["id": id, "expense": expense]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("modUserExpense", arguments: ["userId": GraphQLVariable("id"), "expense": GraphQLVariable("expense")], type: .nonNull(.object(ModUserExpense.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(modUserExpense: ModUserExpense) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "modUserExpense": modUserExpense.resultMap])
    }

    public var modUserExpense: ModUserExpense {
      get {
        return ModUserExpense(unsafeResultMap: resultMap["modUserExpense"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "modUserExpense")
      }
    }

    public struct ModUserExpense: GraphQLSelectionSet {
      public static let possibleTypes = ["Expense"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(ExpenseFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(id: Int, uuid: String? = nil, category: String, description: String, price: String, time: String) {
        self.init(unsafeResultMap: ["__typename": "Expense", "id": id, "uuid": uuid, "category": category, "description": description, "price": price, "time": time])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var expenseFragment: ExpenseFragment {
          get {
            return ExpenseFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class CreateConventionMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation CreateConvention($title: String!, $startDate: NaiveDate!, $endDate: NaiveDate!) {\n  createConvention(title: $title, startDate: $startDate, endDate: $endDate) {\n    __typename\n    id\n  }\n}"

  public var title: String
  public var startDate: String
  public var endDate: String

  public init(title: String, startDate: String, endDate: String) {
    self.title = title
    self.startDate = startDate
    self.endDate = endDate
  }

  public var variables: GraphQLMap? {
    return ["title": title, "startDate": startDate, "endDate": endDate]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("createConvention", arguments: ["title": GraphQLVariable("title"), "startDate": GraphQLVariable("startDate"), "endDate": GraphQLVariable("endDate")], type: .nonNull(.object(CreateConvention.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(createConvention: CreateConvention) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "createConvention": createConvention.resultMap])
    }

    public var createConvention: CreateConvention {
      get {
        return CreateConvention(unsafeResultMap: resultMap["createConvention"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "createConvention")
      }
    }

    public struct CreateConvention: GraphQLSelectionSet {
      public static let possibleTypes = ["Convention"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(id: Int) {
        self.init(unsafeResultMap: ["__typename": "Convention", "id": id])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return resultMap["id"]! as! Int
        }
        set {
          resultMap.updateValue(newValue, forKey: "id")
        }
      }
    }
  }
}

public final class UpdateCurrencyMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation UpdateCurrency($id: Int, $currency: Currency!) {\n  updateSettings(userId: $id) {\n    __typename\n    currency(currency: $currency)\n  }\n}"

  public var id: Int?
  public var currency: String

  public init(id: Int? = nil, currency: String) {
    self.id = id
    self.currency = currency
  }

  public var variables: GraphQLMap? {
    return ["id": id, "currency": currency]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("updateSettings", arguments: ["userId": GraphQLVariable("id")], type: .nonNull(.object(UpdateSetting.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(updateSettings: UpdateSetting) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "updateSettings": updateSettings.resultMap])
    }

    public var updateSettings: UpdateSetting {
      get {
        return UpdateSetting(unsafeResultMap: resultMap["updateSettings"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "updateSettings")
      }
    }

    public struct UpdateSetting: GraphQLSelectionSet {
      public static let possibleTypes = ["SettingsMutation"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("currency", arguments: ["currency": GraphQLVariable("currency")], type: .nonNull(.scalar(String.self))),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(currency: String) {
        self.init(unsafeResultMap: ["__typename": "SettingsMutation", "currency": currency])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var currency: String {
        get {
          return resultMap["currency"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "currency")
        }
      }
    }
  }
}

public final class DeletePriceMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation DeletePrice($userId: Int, $price: PriceDel!) {\n  delUserPrice(userId: $userId, price: $price)\n}"

  public var userId: Int?
  public var price: PriceDel

  public init(userId: Int? = nil, price: PriceDel) {
    self.userId = userId
    self.price = price
  }

  public var variables: GraphQLMap? {
    return ["userId": userId, "price": price]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("delUserPrice", arguments: ["userId": GraphQLVariable("userId"), "price": GraphQLVariable("price")], type: .nonNull(.scalar(Bool.self))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(delUserPrice: Bool) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "delUserPrice": delUserPrice])
    }

    public var delUserPrice: Bool {
      get {
        return resultMap["delUserPrice"]! as! Bool
      }
      set {
        resultMap.updateValue(newValue, forKey: "delUserPrice")
      }
    }
  }
}

public final class ModProductMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation ModProduct($id: Int, $product: ProductMod!) {\n  modUserProduct(userId: $id, product: $product) {\n    __typename\n    ...ProductFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(ProductFragment.fragmentDefinition) }

  public var id: Int?
  public var product: ProductMod

  public init(id: Int? = nil, product: ProductMod) {
    self.id = id
    self.product = product
  }

  public var variables: GraphQLMap? {
    return ["id": id, "product": product]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("modUserProduct", arguments: ["userId": GraphQLVariable("id"), "product": GraphQLVariable("product")], type: .nonNull(.object(ModUserProduct.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(modUserProduct: ModUserProduct) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "modUserProduct": modUserProduct.resultMap])
    }

    public var modUserProduct: ModUserProduct {
      get {
        return ModUserProduct(unsafeResultMap: resultMap["modUserProduct"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "modUserProduct")
      }
    }

    public struct ModUserProduct: GraphQLSelectionSet {
      public static let possibleTypes = ["Product"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(ProductFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool, sort: Int) {
        self.init(unsafeResultMap: ["__typename": "Product", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued, "sort": sort])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var productFragment: ProductFragment {
          get {
            return ProductFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class ModProductTypeMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation ModProductType($id: Int, $productType: ProductTypeMod!) {\n  modUserProductType(userId: $id, productType: $productType) {\n    __typename\n    ...ProductTypeFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(ProductTypeFragment.fragmentDefinition) }

  public var id: Int?
  public var productType: ProductTypeMod

  public init(id: Int? = nil, productType: ProductTypeMod) {
    self.id = id
    self.productType = productType
  }

  public var variables: GraphQLMap? {
    return ["id": id, "productType": productType]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("modUserProductType", arguments: ["userId": GraphQLVariable("id"), "productType": GraphQLVariable("productType")], type: .nonNull(.object(ModUserProductType.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(modUserProductType: ModUserProductType) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "modUserProductType": modUserProductType.resultMap])
    }

    public var modUserProductType: ModUserProductType {
      get {
        return ModUserProductType(unsafeResultMap: resultMap["modUserProductType"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "modUserProductType")
      }
    }

    public struct ModUserProductType: GraphQLSelectionSet {
      public static let possibleTypes = ["ProductType"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(ProductTypeFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(id: Int, name: String, color: Int? = nil, discontinued: Bool, sort: Int) {
        self.init(unsafeResultMap: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued, "sort": sort])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var productTypeFragment: ProductTypeFragment {
          get {
            return ProductTypeFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class DeleteExpenseMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation DeleteExpense($id: Int, $expense: ExpenseDel!) {\n  delUserExpense(userId: $id, expense: $expense)\n}"

  public var id: Int?
  public var expense: ExpenseDel

  public init(id: Int? = nil, expense: ExpenseDel) {
    self.id = id
    self.expense = expense
  }

  public var variables: GraphQLMap? {
    return ["id": id, "expense": expense]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("delUserExpense", arguments: ["userId": GraphQLVariable("id"), "expense": GraphQLVariable("expense")], type: .nonNull(.scalar(Bool.self))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(delUserExpense: Bool) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "delUserExpense": delUserExpense])
    }

    public var delUserExpense: Bool {
      get {
        return resultMap["delUserExpense"]! as! Bool
      }
      set {
        resultMap.updateValue(newValue, forKey: "delUserExpense")
      }
    }
  }
}

public final class DownvoteConventionInfoMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation DownvoteConventionInfo($userId: Int, $infoId: Int!) {\n  downvoteConventionInfo(userId: $userId, infoId: $infoId) {\n    __typename\n    id\n    ...VotesFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(VotesFragment.fragmentDefinition) }

  public var userId: Int?
  public var infoId: Int

  public init(userId: Int? = nil, infoId: Int) {
    self.userId = userId
    self.infoId = infoId
  }

  public var variables: GraphQLMap? {
    return ["userId": userId, "infoId": infoId]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("downvoteConventionInfo", arguments: ["userId": GraphQLVariable("userId"), "infoId": GraphQLVariable("infoId")], type: .nonNull(.object(DownvoteConventionInfo.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(downvoteConventionInfo: DownvoteConventionInfo) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "downvoteConventionInfo": downvoteConventionInfo.resultMap])
    }

    public var downvoteConventionInfo: DownvoteConventionInfo {
      get {
        return DownvoteConventionInfo(unsafeResultMap: resultMap["downvoteConventionInfo"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "downvoteConventionInfo")
      }
    }

    public struct DownvoteConventionInfo: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionUserInfo"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLFragmentSpread(VotesFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(id: Int, upvotes: Int, downvotes: Int) {
        self.init(unsafeResultMap: ["__typename": "ConventionUserInfo", "id": id, "upvotes": upvotes, "downvotes": downvotes])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return resultMap["id"]! as! Int
        }
        set {
          resultMap.updateValue(newValue, forKey: "id")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var votesFragment: VotesFragment {
          get {
            return VotesFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class AddConventionInfoMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation AddConventionInfo($conId: Int!, $title: String!, $info: String, $action: String, $actionText: String) {\n  addConventionExtraInfo(conId: $conId, title: $title, info: $info, action: $action, actionText: $actionText) {\n    __typename\n    ...ExtraInfoFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(ExtraInfoFragment.fragmentDefinition) }

  public var conId: Int
  public var title: String
  public var info: String?
  public var action: String?
  public var actionText: String?

  public init(conId: Int, title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
    self.conId = conId
    self.title = title
    self.info = info
    self.action = action
    self.actionText = actionText
  }

  public var variables: GraphQLMap? {
    return ["conId": conId, "title": title, "info": info, "action": action, "actionText": actionText]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("addConventionExtraInfo", arguments: ["conId": GraphQLVariable("conId"), "title": GraphQLVariable("title"), "info": GraphQLVariable("info"), "action": GraphQLVariable("action"), "actionText": GraphQLVariable("actionText")], type: .nonNull(.object(AddConventionExtraInfo.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(addConventionExtraInfo: AddConventionExtraInfo) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "addConventionExtraInfo": addConventionExtraInfo.resultMap])
    }

    public var addConventionExtraInfo: AddConventionExtraInfo {
      get {
        return AddConventionExtraInfo(unsafeResultMap: resultMap["addConventionExtraInfo"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "addConventionExtraInfo")
      }
    }

    public struct AddConventionExtraInfo: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionExtraInfo"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(ExtraInfoFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
        self.init(unsafeResultMap: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var extraInfoFragment: ExtraInfoFragment {
          get {
            return ExtraInfoFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class AddRecordMutation: GraphQLMutation {
  public let operationDefinition =
    "mutation AddRecord($id: Int, $record: RecordAdd!) {\n  addUserRecord(userId: $id, record: $record) {\n    __typename\n    ...RecordFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(RecordFragment.fragmentDefinition) }

  public var id: Int?
  public var record: RecordAdd

  public init(id: Int? = nil, record: RecordAdd) {
    self.id = id
    self.record = record
  }

  public var variables: GraphQLMap? {
    return ["id": id, "record": record]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Mutation"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("addUserRecord", arguments: ["userId": GraphQLVariable("id"), "record": GraphQLVariable("record")], type: .nonNull(.object(AddUserRecord.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(addUserRecord: AddUserRecord) {
      self.init(unsafeResultMap: ["__typename": "Mutation", "addUserRecord": addUserRecord.resultMap])
    }

    public var addUserRecord: AddUserRecord {
      get {
        return AddUserRecord(unsafeResultMap: resultMap["addUserRecord"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "addUserRecord")
      }
    }

    public struct AddUserRecord: GraphQLSelectionSet {
      public static let possibleTypes = ["Record"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(RecordFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(id: Int, uuid: String? = nil, products: [Int], price: String, time: String, info: String) {
        self.init(unsafeResultMap: ["__typename": "Record", "id": id, "uuid": uuid, "products": products, "price": price, "time": time, "info": info])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var recordFragment: RecordFragment {
          get {
            return RecordFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class ConventionsConnectionQuery: GraphQLQuery {
  public let operationDefinition =
    "query ConventionsConnection($date: DateTimeFixedOffset, $search: String, $limit: Int, $before: String, $after: String) {\n  conventionsConnection(date: $date, search: $search, limit: $limit, after: $after, before: $before) {\n    __typename\n    nodes {\n      __typename\n      ...ConventionBasicInfoFragment\n    }\n    endCursor\n    totalNodes\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(ConventionBasicInfoFragment.fragmentDefinition).appending(ConventionImageFragment.fragmentDefinition).appending(ExtraInfoFragment.fragmentDefinition).appending(UserInfoFragment.fragmentDefinition).appending(VotesFragment.fragmentDefinition) }

  public var date: String?
  public var search: String?
  public var limit: Int?
  public var before: String?
  public var after: String?

  public init(date: String? = nil, search: String? = nil, limit: Int? = nil, before: String? = nil, after: String? = nil) {
    self.date = date
    self.search = search
    self.limit = limit
    self.before = before
    self.after = after
  }

  public var variables: GraphQLMap? {
    return ["date": date, "search": search, "limit": limit, "before": before, "after": after]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Query"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("conventionsConnection", arguments: ["date": GraphQLVariable("date"), "search": GraphQLVariable("search"), "limit": GraphQLVariable("limit"), "after": GraphQLVariable("after"), "before": GraphQLVariable("before")], type: .nonNull(.object(ConventionsConnection.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(conventionsConnection: ConventionsConnection) {
      self.init(unsafeResultMap: ["__typename": "Query", "conventionsConnection": conventionsConnection.resultMap])
    }

    /// Retrieves one page of conventions which start after a given date
    public var conventionsConnection: ConventionsConnection {
      get {
        return ConventionsConnection(unsafeResultMap: resultMap["conventionsConnection"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "conventionsConnection")
      }
    }

    public struct ConventionsConnection: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionsConnection"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("nodes", type: .nonNull(.list(.nonNull(.object(Node.selections))))),
        GraphQLField("endCursor", type: .scalar(String.self)),
        GraphQLField("totalNodes", type: .nonNull(.scalar(Int.self))),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public init(nodes: [Node], endCursor: String? = nil, totalNodes: Int) {
        self.init(unsafeResultMap: ["__typename": "ConventionsConnection", "nodes": nodes.map { (value: Node) -> ResultMap in value.resultMap }, "endCursor": endCursor, "totalNodes": totalNodes])
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var nodes: [Node] {
        get {
          return (resultMap["nodes"] as! [ResultMap]).map { (value: ResultMap) -> Node in Node(unsafeResultMap: value) }
        }
        set {
          resultMap.updateValue(newValue.map { (value: Node) -> ResultMap in value.resultMap }, forKey: "nodes")
        }
      }

      public var endCursor: String? {
        get {
          return resultMap["endCursor"] as? String
        }
        set {
          resultMap.updateValue(newValue, forKey: "endCursor")
        }
      }

      public var totalNodes: Int {
        get {
          return resultMap["totalNodes"]! as! Int
        }
        set {
          resultMap.updateValue(newValue, forKey: "totalNodes")
        }
      }

      public struct Node: GraphQLSelectionSet {
        public static let possibleTypes = ["Convention"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLFragmentSpread(ConventionBasicInfoFragment.self),
        ]

        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var __typename: String {
          get {
            return resultMap["__typename"]! as! String
          }
          set {
            resultMap.updateValue(newValue, forKey: "__typename")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }

        public struct Fragments {
          public private(set) var resultMap: ResultMap

          public init(unsafeResultMap: ResultMap) {
            self.resultMap = unsafeResultMap
          }

          public var conventionBasicInfoFragment: ConventionBasicInfoFragment {
            get {
              return ConventionBasicInfoFragment(unsafeResultMap: resultMap)
            }
            set {
              resultMap += newValue.resultMap
            }
          }
        }
      }
    }
  }
}

public final class UserQuery: GraphQLQuery {
  public let operationDefinition =
    "query User($id: Int) {\n  user(id: $id) {\n    __typename\n    ...UserFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(UserFragment.fragmentDefinition).appending(SettingsFragment.fragmentDefinition).appending(MetaConventionFragment.fragmentDefinition).appending(ConventionBasicInfoFragment.fragmentDefinition).appending(ConventionImageFragment.fragmentDefinition).appending(ExtraInfoFragment.fragmentDefinition).appending(UserInfoFragment.fragmentDefinition).appending(VotesFragment.fragmentDefinition) }

  public var id: Int?

  public init(id: Int? = nil) {
    self.id = id
  }

  public var variables: GraphQLMap? {
    return ["id": id]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Query"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("user", arguments: ["id": GraphQLVariable("id")], type: .nonNull(.object(User.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(user: User) {
      self.init(unsafeResultMap: ["__typename": "Query", "user": user.resultMap])
    }

    /// Retrieves one user, corresponding to the provided ID
    public var user: User {
      get {
        return User(unsafeResultMap: resultMap["user"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "user")
      }
    }

    public struct User: GraphQLSelectionSet {
      public static let possibleTypes = ["User"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(UserFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var userFragment: UserFragment {
          get {
            return UserFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class FullConventionQuery: GraphQLQuery {
  public let operationDefinition =
    "query FullConvention($userId: Int, $conId: Int!) {\n  convention(userId: $userId, conId: $conId) {\n    __typename\n    ...FullConventionFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(FullConventionFragment.fragmentDefinition).appending(MetaConventionFragment.fragmentDefinition).appending(ConventionBasicInfoFragment.fragmentDefinition).appending(ConventionImageFragment.fragmentDefinition).appending(ExtraInfoFragment.fragmentDefinition).appending(UserInfoFragment.fragmentDefinition).appending(VotesFragment.fragmentDefinition).appending(ProductFragment.fragmentDefinition).appending(ProductTypeFragment.fragmentDefinition).appending(PriceFragment.fragmentDefinition).appending(RecordFragment.fragmentDefinition).appending(ExpenseFragment.fragmentDefinition) }

  public var userId: Int?
  public var conId: Int

  public init(userId: Int? = nil, conId: Int) {
    self.userId = userId
    self.conId = conId
  }

  public var variables: GraphQLMap? {
    return ["userId": userId, "conId": conId]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Query"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("convention", arguments: ["userId": GraphQLVariable("userId"), "conId": GraphQLVariable("conId")], type: .nonNull(.object(Convention.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(convention: Convention) {
      self.init(unsafeResultMap: ["__typename": "Query", "convention": convention.resultMap])
    }

    /// Retrieves the full information of one convention
    public var convention: Convention {
      get {
        return Convention(unsafeResultMap: resultMap["convention"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "convention")
      }
    }

    public struct Convention: GraphQLSelectionSet {
      public static let possibleTypes = ["Convention"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(FullConventionFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var fullConventionFragment: FullConventionFragment {
          get {
            return FullConventionFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public final class FullUserQuery: GraphQLQuery {
  public let operationDefinition =
    "query FullUser($id: Int) {\n  user(id: $id) {\n    __typename\n    ...FullUserFragment\n  }\n}"

  public var queryDocument: String { return operationDefinition.appending(FullUserFragment.fragmentDefinition).appending(UserFragment.fragmentDefinition).appending(SettingsFragment.fragmentDefinition).appending(MetaConventionFragment.fragmentDefinition).appending(ConventionBasicInfoFragment.fragmentDefinition).appending(ConventionImageFragment.fragmentDefinition).appending(ExtraInfoFragment.fragmentDefinition).appending(UserInfoFragment.fragmentDefinition).appending(VotesFragment.fragmentDefinition).appending(ProductFragment.fragmentDefinition).appending(ProductTypeFragment.fragmentDefinition).appending(PriceFragment.fragmentDefinition) }

  public var id: Int?

  public init(id: Int? = nil) {
    self.id = id
  }

  public var variables: GraphQLMap? {
    return ["id": id]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Query"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("user", arguments: ["id": GraphQLVariable("id")], type: .nonNull(.object(User.selections))),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(user: User) {
      self.init(unsafeResultMap: ["__typename": "Query", "user": user.resultMap])
    }

    /// Retrieves one user, corresponding to the provided ID
    public var user: User {
      get {
        return User(unsafeResultMap: resultMap["user"]! as! ResultMap)
      }
      set {
        resultMap.updateValue(newValue.resultMap, forKey: "user")
      }
    }

    public struct User: GraphQLSelectionSet {
      public static let possibleTypes = ["User"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLFragmentSpread(FullUserFragment.self),
      ]

      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var __typename: String {
        get {
          return resultMap["__typename"]! as! String
        }
        set {
          resultMap.updateValue(newValue, forKey: "__typename")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }

      public struct Fragments {
        public private(set) var resultMap: ResultMap

        public init(unsafeResultMap: ResultMap) {
          self.resultMap = unsafeResultMap
        }

        public var fullUserFragment: FullUserFragment {
          get {
            return FullUserFragment(unsafeResultMap: resultMap)
          }
          set {
            resultMap += newValue.resultMap
          }
        }
      }
    }
  }
}

public struct UserFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment UserFragment on User {\n  __typename\n  name\n  email\n  settings {\n    __typename\n    ...SettingsFragment\n  }\n  conventions {\n    __typename\n    ...MetaConventionFragment\n  }\n}"

  public static let possibleTypes = ["User"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("name", type: .nonNull(.scalar(String.self))),
    GraphQLField("email", type: .nonNull(.scalar(String.self))),
    GraphQLField("settings", type: .nonNull(.object(Setting.selections))),
    GraphQLField("conventions", type: .nonNull(.list(.nonNull(.object(Convention.selections))))),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(name: String, email: String, settings: Setting, conventions: [Convention]) {
    self.init(unsafeResultMap: ["__typename": "User", "name": name, "email": email, "settings": settings.resultMap, "conventions": conventions.map { (value: Convention) -> ResultMap in value.resultMap }])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var name: String {
    get {
      return resultMap["name"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "name")
    }
  }

  public var email: String {
    get {
      return resultMap["email"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "email")
    }
  }

  public var settings: Setting {
    get {
      return Setting(unsafeResultMap: resultMap["settings"]! as! ResultMap)
    }
    set {
      resultMap.updateValue(newValue.resultMap, forKey: "settings")
    }
  }

  public var conventions: [Convention] {
    get {
      return (resultMap["conventions"] as! [ResultMap]).map { (value: ResultMap) -> Convention in Convention(unsafeResultMap: value) }
    }
    set {
      resultMap.updateValue(newValue.map { (value: Convention) -> ResultMap in value.resultMap }, forKey: "conventions")
    }
  }

  public struct Setting: GraphQLSelectionSet {
    public static let possibleTypes = ["Settings"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(SettingsFragment.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(currency: String, language: String) {
      self.init(unsafeResultMap: ["__typename": "Settings", "currency": currency, "language": language])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var settingsFragment: SettingsFragment {
        get {
          return SettingsFragment(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }

  public struct Convention: GraphQLSelectionSet {
    public static let possibleTypes = ["Convention"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(MetaConventionFragment.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var metaConventionFragment: MetaConventionFragment {
        get {
          return MetaConventionFragment(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }
}

public struct ConventionBasicInfoFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment ConventionBasicInfoFragment on Convention {\n  __typename\n  id\n  name\n  images {\n    __typename\n    ...ConventionImageFragment\n  }\n  start\n  end\n  extraInfo {\n    __typename\n    ...ExtraInfoFragment\n  }\n  userInfo {\n    __typename\n    ...UserInfoFragment\n  }\n}"

  public static let possibleTypes = ["Convention"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("name", type: .nonNull(.scalar(String.self))),
    GraphQLField("images", type: .nonNull(.list(.nonNull(.object(Image.selections))))),
    GraphQLField("start", type: .nonNull(.scalar(String.self))),
    GraphQLField("end", type: .nonNull(.scalar(String.self))),
    GraphQLField("extraInfo", type: .nonNull(.list(.nonNull(.object(ExtraInfo.selections))))),
    GraphQLField("userInfo", type: .nonNull(.list(.nonNull(.object(UserInfo.selections))))),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(id: Int, name: String, images: [Image], start: String, end: String, extraInfo: [ExtraInfo], userInfo: [UserInfo]) {
    self.init(unsafeResultMap: ["__typename": "Convention", "id": id, "name": name, "images": images.map { (value: Image) -> ResultMap in value.resultMap }, "start": start, "end": end, "extraInfo": extraInfo.map { (value: ExtraInfo) -> ResultMap in value.resultMap }, "userInfo": userInfo.map { (value: UserInfo) -> ResultMap in value.resultMap }])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return resultMap["id"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "id")
    }
  }

  public var name: String {
    get {
      return resultMap["name"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "name")
    }
  }

  public var images: [Image] {
    get {
      return (resultMap["images"] as! [ResultMap]).map { (value: ResultMap) -> Image in Image(unsafeResultMap: value) }
    }
    set {
      resultMap.updateValue(newValue.map { (value: Image) -> ResultMap in value.resultMap }, forKey: "images")
    }
  }

  public var start: String {
    get {
      return resultMap["start"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "start")
    }
  }

  public var end: String {
    get {
      return resultMap["end"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "end")
    }
  }

  public var extraInfo: [ExtraInfo] {
    get {
      return (resultMap["extraInfo"] as! [ResultMap]).map { (value: ResultMap) -> ExtraInfo in ExtraInfo(unsafeResultMap: value) }
    }
    set {
      resultMap.updateValue(newValue.map { (value: ExtraInfo) -> ResultMap in value.resultMap }, forKey: "extraInfo")
    }
  }

  public var userInfo: [UserInfo] {
    get {
      return (resultMap["userInfo"] as! [ResultMap]).map { (value: ResultMap) -> UserInfo in UserInfo(unsafeResultMap: value) }
    }
    set {
      resultMap.updateValue(newValue.map { (value: UserInfo) -> ResultMap in value.resultMap }, forKey: "userInfo")
    }
  }

  public struct Image: GraphQLSelectionSet {
    public static let possibleTypes = ["ConventionImage"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(ConventionImageFragment.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(id: String) {
      self.init(unsafeResultMap: ["__typename": "ConventionImage", "id": id])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var conventionImageFragment: ConventionImageFragment {
        get {
          return ConventionImageFragment(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }

  public struct ExtraInfo: GraphQLSelectionSet {
    public static let possibleTypes = ["ConventionExtraInfo"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(ExtraInfoFragment.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
      self.init(unsafeResultMap: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var extraInfoFragment: ExtraInfoFragment {
        get {
          return ExtraInfoFragment(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }

  public struct UserInfo: GraphQLSelectionSet {
    public static let possibleTypes = ["ConventionUserInfo"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(UserInfoFragment.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
      self.init(unsafeResultMap: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var userInfoFragment: UserInfoFragment {
        get {
          return UserInfoFragment(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }
}

public struct RecordFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment RecordFragment on Record {\n  __typename\n  id\n  uuid\n  products\n  price\n  time\n  info\n}"

  public static let possibleTypes = ["Record"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("uuid", type: .scalar(String.self)),
    GraphQLField("products", type: .nonNull(.list(.nonNull(.scalar(Int.self))))),
    GraphQLField("price", type: .nonNull(.scalar(String.self))),
    GraphQLField("time", type: .nonNull(.scalar(String.self))),
    GraphQLField("info", type: .nonNull(.scalar(String.self))),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(id: Int, uuid: String? = nil, products: [Int], price: String, time: String, info: String) {
    self.init(unsafeResultMap: ["__typename": "Record", "id": id, "uuid": uuid, "products": products, "price": price, "time": time, "info": info])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return resultMap["id"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "id")
    }
  }

  public var uuid: String? {
    get {
      return resultMap["uuid"] as? String
    }
    set {
      resultMap.updateValue(newValue, forKey: "uuid")
    }
  }

  public var products: [Int] {
    get {
      return resultMap["products"]! as! [Int]
    }
    set {
      resultMap.updateValue(newValue, forKey: "products")
    }
  }

  public var price: String {
    get {
      return resultMap["price"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "price")
    }
  }

  public var time: String {
    get {
      return resultMap["time"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "time")
    }
  }

  public var info: String {
    get {
      return resultMap["info"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "info")
    }
  }
}

public struct FullConventionFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment FullConventionFragment on Convention {\n  __typename\n  ...MetaConventionFragment\n  products {\n    __typename\n    ...ProductFragment\n  }\n  productTypes {\n    __typename\n    ...ProductTypeFragment\n  }\n  prices {\n    __typename\n    ...PriceFragment\n  }\n  records {\n    __typename\n    ...RecordFragment\n  }\n  expenses {\n    __typename\n    ...ExpenseFragment\n  }\n}"

  public static let possibleTypes = ["Convention"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLFragmentSpread(MetaConventionFragment.self),
    GraphQLField("products", type: .nonNull(.list(.nonNull(.object(Product.selections))))),
    GraphQLField("productTypes", type: .nonNull(.list(.nonNull(.object(ProductType.selections))))),
    GraphQLField("prices", type: .nonNull(.list(.nonNull(.object(Price.selections))))),
    GraphQLField("records", type: .nonNull(.list(.nonNull(.object(Record.selections))))),
    GraphQLField("expenses", type: .nonNull(.list(.nonNull(.object(Expense.selections))))),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var products: [Product] {
    get {
      return (resultMap["products"] as! [ResultMap]).map { (value: ResultMap) -> Product in Product(unsafeResultMap: value) }
    }
    set {
      resultMap.updateValue(newValue.map { (value: Product) -> ResultMap in value.resultMap }, forKey: "products")
    }
  }

  public var productTypes: [ProductType] {
    get {
      return (resultMap["productTypes"] as! [ResultMap]).map { (value: ResultMap) -> ProductType in ProductType(unsafeResultMap: value) }
    }
    set {
      resultMap.updateValue(newValue.map { (value: ProductType) -> ResultMap in value.resultMap }, forKey: "productTypes")
    }
  }

  public var prices: [Price] {
    get {
      return (resultMap["prices"] as! [ResultMap]).map { (value: ResultMap) -> Price in Price(unsafeResultMap: value) }
    }
    set {
      resultMap.updateValue(newValue.map { (value: Price) -> ResultMap in value.resultMap }, forKey: "prices")
    }
  }

  public var records: [Record] {
    get {
      return (resultMap["records"] as! [ResultMap]).map { (value: ResultMap) -> Record in Record(unsafeResultMap: value) }
    }
    set {
      resultMap.updateValue(newValue.map { (value: Record) -> ResultMap in value.resultMap }, forKey: "records")
    }
  }

  public var expenses: [Expense] {
    get {
      return (resultMap["expenses"] as! [ResultMap]).map { (value: ResultMap) -> Expense in Expense(unsafeResultMap: value) }
    }
    set {
      resultMap.updateValue(newValue.map { (value: Expense) -> ResultMap in value.resultMap }, forKey: "expenses")
    }
  }

  public var fragments: Fragments {
    get {
      return Fragments(unsafeResultMap: resultMap)
    }
    set {
      resultMap += newValue.resultMap
    }
  }

  public struct Fragments {
    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public var metaConventionFragment: MetaConventionFragment {
      get {
        return MetaConventionFragment(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }
  }

  public struct Product: GraphQLSelectionSet {
    public static let possibleTypes = ["Product"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(ProductFragment.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool, sort: Int) {
      self.init(unsafeResultMap: ["__typename": "Product", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued, "sort": sort])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var productFragment: ProductFragment {
        get {
          return ProductFragment(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }

  public struct ProductType: GraphQLSelectionSet {
    public static let possibleTypes = ["ProductType"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(ProductTypeFragment.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(id: Int, name: String, color: Int? = nil, discontinued: Bool, sort: Int) {
      self.init(unsafeResultMap: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued, "sort": sort])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var productTypeFragment: ProductTypeFragment {
        get {
          return ProductTypeFragment(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }

  public struct Price: GraphQLSelectionSet {
    public static let possibleTypes = ["Price"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(PriceFragment.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(typeId: Int, productId: Int? = nil, quantity: Int, price: String) {
      self.init(unsafeResultMap: ["__typename": "Price", "typeId": typeId, "productId": productId, "quantity": quantity, "price": price])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var priceFragment: PriceFragment {
        get {
          return PriceFragment(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }

  public struct Record: GraphQLSelectionSet {
    public static let possibleTypes = ["Record"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(RecordFragment.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(id: Int, uuid: String? = nil, products: [Int], price: String, time: String, info: String) {
      self.init(unsafeResultMap: ["__typename": "Record", "id": id, "uuid": uuid, "products": products, "price": price, "time": time, "info": info])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var recordFragment: RecordFragment {
        get {
          return RecordFragment(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }

  public struct Expense: GraphQLSelectionSet {
    public static let possibleTypes = ["Expense"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(ExpenseFragment.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(id: Int, uuid: String? = nil, category: String, description: String, price: String, time: String) {
      self.init(unsafeResultMap: ["__typename": "Expense", "id": id, "uuid": uuid, "category": category, "description": description, "price": price, "time": time])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var expenseFragment: ExpenseFragment {
        get {
          return ExpenseFragment(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }
}

public struct VotesFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment VotesFragment on ConventionUserInfo {\n  __typename\n  upvotes\n  downvotes\n}"

  public static let possibleTypes = ["ConventionUserInfo"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
    GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(upvotes: Int, downvotes: Int) {
    self.init(unsafeResultMap: ["__typename": "ConventionUserInfo", "upvotes": upvotes, "downvotes": downvotes])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var upvotes: Int {
    get {
      return resultMap["upvotes"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "upvotes")
    }
  }

  public var downvotes: Int {
    get {
      return resultMap["downvotes"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "downvotes")
    }
  }
}

public struct PriceFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment PriceFragment on Price {\n  __typename\n  typeId\n  productId\n  quantity\n  price\n}"

  public static let possibleTypes = ["Price"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
    GraphQLField("productId", type: .scalar(Int.self)),
    GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
    GraphQLField("price", type: .nonNull(.scalar(String.self))),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(typeId: Int, productId: Int? = nil, quantity: Int, price: String) {
    self.init(unsafeResultMap: ["__typename": "Price", "typeId": typeId, "productId": productId, "quantity": quantity, "price": price])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var typeId: Int {
    get {
      return resultMap["typeId"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "typeId")
    }
  }

  public var productId: Int? {
    get {
      return resultMap["productId"] as? Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "productId")
    }
  }

  public var quantity: Int {
    get {
      return resultMap["quantity"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "quantity")
    }
  }

  public var price: String {
    get {
      return resultMap["price"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "price")
    }
  }
}

public struct SettingsFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment SettingsFragment on Settings {\n  __typename\n  currency\n  language\n}"

  public static let possibleTypes = ["Settings"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("currency", type: .nonNull(.scalar(String.self))),
    GraphQLField("language", type: .nonNull(.scalar(String.self))),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(currency: String, language: String) {
    self.init(unsafeResultMap: ["__typename": "Settings", "currency": currency, "language": language])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var currency: String {
    get {
      return resultMap["currency"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "currency")
    }
  }

  public var language: String {
    get {
      return resultMap["language"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "language")
    }
  }
}

public struct ExtraInfoFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment ExtraInfoFragment on ConventionExtraInfo {\n  __typename\n  title\n  info\n  action\n  actionText\n}"

  public static let possibleTypes = ["ConventionExtraInfo"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("title", type: .nonNull(.scalar(String.self))),
    GraphQLField("info", type: .scalar(String.self)),
    GraphQLField("action", type: .scalar(String.self)),
    GraphQLField("actionText", type: .scalar(String.self)),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
    self.init(unsafeResultMap: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var title: String {
    get {
      return resultMap["title"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "title")
    }
  }

  public var info: String? {
    get {
      return resultMap["info"] as? String
    }
    set {
      resultMap.updateValue(newValue, forKey: "info")
    }
  }

  public var action: String? {
    get {
      return resultMap["action"] as? String
    }
    set {
      resultMap.updateValue(newValue, forKey: "action")
    }
  }

  public var actionText: String? {
    get {
      return resultMap["actionText"] as? String
    }
    set {
      resultMap.updateValue(newValue, forKey: "actionText")
    }
  }
}

public struct FullUserFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment FullUserFragment on User {\n  __typename\n  ...UserFragment\n  clearance\n  products {\n    __typename\n    ...ProductFragment\n  }\n  productTypes {\n    __typename\n    ...ProductTypeFragment\n  }\n  prices {\n    __typename\n    ...PriceFragment\n  }\n}"

  public static let possibleTypes = ["User"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLFragmentSpread(UserFragment.self),
    GraphQLField("clearance", type: .nonNull(.scalar(Int.self))),
    GraphQLField("products", type: .nonNull(.list(.nonNull(.object(Product.selections))))),
    GraphQLField("productTypes", type: .nonNull(.list(.nonNull(.object(ProductType.selections))))),
    GraphQLField("prices", type: .nonNull(.list(.nonNull(.object(Price.selections))))),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var clearance: Int {
    get {
      return resultMap["clearance"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "clearance")
    }
  }

  public var products: [Product] {
    get {
      return (resultMap["products"] as! [ResultMap]).map { (value: ResultMap) -> Product in Product(unsafeResultMap: value) }
    }
    set {
      resultMap.updateValue(newValue.map { (value: Product) -> ResultMap in value.resultMap }, forKey: "products")
    }
  }

  public var productTypes: [ProductType] {
    get {
      return (resultMap["productTypes"] as! [ResultMap]).map { (value: ResultMap) -> ProductType in ProductType(unsafeResultMap: value) }
    }
    set {
      resultMap.updateValue(newValue.map { (value: ProductType) -> ResultMap in value.resultMap }, forKey: "productTypes")
    }
  }

  public var prices: [Price] {
    get {
      return (resultMap["prices"] as! [ResultMap]).map { (value: ResultMap) -> Price in Price(unsafeResultMap: value) }
    }
    set {
      resultMap.updateValue(newValue.map { (value: Price) -> ResultMap in value.resultMap }, forKey: "prices")
    }
  }

  public var fragments: Fragments {
    get {
      return Fragments(unsafeResultMap: resultMap)
    }
    set {
      resultMap += newValue.resultMap
    }
  }

  public struct Fragments {
    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public var userFragment: UserFragment {
      get {
        return UserFragment(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }
  }

  public struct Product: GraphQLSelectionSet {
    public static let possibleTypes = ["Product"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(ProductFragment.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool, sort: Int) {
      self.init(unsafeResultMap: ["__typename": "Product", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued, "sort": sort])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var productFragment: ProductFragment {
        get {
          return ProductFragment(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }

  public struct ProductType: GraphQLSelectionSet {
    public static let possibleTypes = ["ProductType"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(ProductTypeFragment.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(id: Int, name: String, color: Int? = nil, discontinued: Bool, sort: Int) {
      self.init(unsafeResultMap: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued, "sort": sort])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var productTypeFragment: ProductTypeFragment {
        get {
          return ProductTypeFragment(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }

  public struct Price: GraphQLSelectionSet {
    public static let possibleTypes = ["Price"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLFragmentSpread(PriceFragment.self),
    ]

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(typeId: Int, productId: Int? = nil, quantity: Int, price: String) {
      self.init(unsafeResultMap: ["__typename": "Price", "typeId": typeId, "productId": productId, "quantity": quantity, "price": price])
    }

    public var __typename: String {
      get {
        return resultMap["__typename"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "__typename")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }

    public struct Fragments {
      public private(set) var resultMap: ResultMap

      public init(unsafeResultMap: ResultMap) {
        self.resultMap = unsafeResultMap
      }

      public var priceFragment: PriceFragment {
        get {
          return PriceFragment(unsafeResultMap: resultMap)
        }
        set {
          resultMap += newValue.resultMap
        }
      }
    }
  }
}

public struct MetaConventionFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment MetaConventionFragment on Convention {\n  __typename\n  ...ConventionBasicInfoFragment\n  recordTotal\n  expenseTotal\n}"

  public static let possibleTypes = ["Convention"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLFragmentSpread(ConventionBasicInfoFragment.self),
    GraphQLField("recordTotal", type: .scalar(String.self)),
    GraphQLField("expenseTotal", type: .scalar(String.self)),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var recordTotal: String? {
    get {
      return resultMap["recordTotal"] as? String
    }
    set {
      resultMap.updateValue(newValue, forKey: "recordTotal")
    }
  }

  public var expenseTotal: String? {
    get {
      return resultMap["expenseTotal"] as? String
    }
    set {
      resultMap.updateValue(newValue, forKey: "expenseTotal")
    }
  }

  public var fragments: Fragments {
    get {
      return Fragments(unsafeResultMap: resultMap)
    }
    set {
      resultMap += newValue.resultMap
    }
  }

  public struct Fragments {
    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public var conventionBasicInfoFragment: ConventionBasicInfoFragment {
      get {
        return ConventionBasicInfoFragment(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }
  }
}

public struct UserInfoFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment UserInfoFragment on ConventionUserInfo {\n  __typename\n  id\n  info\n  vote\n  ...VotesFragment\n}"

  public static let possibleTypes = ["ConventionUserInfo"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("info", type: .nonNull(.scalar(String.self))),
    GraphQLField("vote", type: .nonNull(.scalar(Int.self))),
    GraphQLFragmentSpread(VotesFragment.self),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
    self.init(unsafeResultMap: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return resultMap["id"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "id")
    }
  }

  public var info: String {
    get {
      return resultMap["info"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "info")
    }
  }

  public var vote: Int {
    get {
      return resultMap["vote"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "vote")
    }
  }

  public var fragments: Fragments {
    get {
      return Fragments(unsafeResultMap: resultMap)
    }
    set {
      resultMap += newValue.resultMap
    }
  }

  public struct Fragments {
    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public var votesFragment: VotesFragment {
      get {
        return VotesFragment(unsafeResultMap: resultMap)
      }
      set {
        resultMap += newValue.resultMap
      }
    }
  }
}

public struct ProductTypeFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment ProductTypeFragment on ProductType {\n  __typename\n  id\n  name\n  color\n  discontinued\n  sort\n}"

  public static let possibleTypes = ["ProductType"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("name", type: .nonNull(.scalar(String.self))),
    GraphQLField("color", type: .scalar(Int.self)),
    GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
    GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(id: Int, name: String, color: Int? = nil, discontinued: Bool, sort: Int) {
    self.init(unsafeResultMap: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued, "sort": sort])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return resultMap["id"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "id")
    }
  }

  public var name: String {
    get {
      return resultMap["name"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "name")
    }
  }

  public var color: Int? {
    get {
      return resultMap["color"] as? Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "color")
    }
  }

  public var discontinued: Bool {
    get {
      return resultMap["discontinued"]! as! Bool
    }
    set {
      resultMap.updateValue(newValue, forKey: "discontinued")
    }
  }

  public var sort: Int {
    get {
      return resultMap["sort"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "sort")
    }
  }
}

public struct ProductFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment ProductFragment on Product {\n  __typename\n  id\n  typeId\n  name\n  quantity\n  discontinued\n  sort\n}"

  public static let possibleTypes = ["Product"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
    GraphQLField("name", type: .nonNull(.scalar(String.self))),
    GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
    GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
    GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool, sort: Int) {
    self.init(unsafeResultMap: ["__typename": "Product", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued, "sort": sort])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return resultMap["id"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "id")
    }
  }

  public var typeId: Int {
    get {
      return resultMap["typeId"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "typeId")
    }
  }

  public var name: String {
    get {
      return resultMap["name"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "name")
    }
  }

  public var quantity: Int {
    get {
      return resultMap["quantity"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "quantity")
    }
  }

  public var discontinued: Bool {
    get {
      return resultMap["discontinued"]! as! Bool
    }
    set {
      resultMap.updateValue(newValue, forKey: "discontinued")
    }
  }

  public var sort: Int {
    get {
      return resultMap["sort"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "sort")
    }
  }
}

public struct ConventionImageFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment ConventionImageFragment on ConventionImage {\n  __typename\n  id\n}"

  public static let possibleTypes = ["ConventionImage"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(String.self))),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(id: String) {
    self.init(unsafeResultMap: ["__typename": "ConventionImage", "id": id])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: String {
    get {
      return resultMap["id"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "id")
    }
  }
}

public struct ExpenseFragment: GraphQLFragment {
  public static let fragmentDefinition =
    "fragment ExpenseFragment on Expense {\n  __typename\n  id\n  uuid\n  category\n  description\n  price\n  time\n}"

  public static let possibleTypes = ["Expense"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("uuid", type: .scalar(String.self)),
    GraphQLField("category", type: .nonNull(.scalar(String.self))),
    GraphQLField("description", type: .nonNull(.scalar(String.self))),
    GraphQLField("price", type: .nonNull(.scalar(String.self))),
    GraphQLField("time", type: .nonNull(.scalar(String.self))),
  ]

  public private(set) var resultMap: ResultMap

  public init(unsafeResultMap: ResultMap) {
    self.resultMap = unsafeResultMap
  }

  public init(id: Int, uuid: String? = nil, category: String, description: String, price: String, time: String) {
    self.init(unsafeResultMap: ["__typename": "Expense", "id": id, "uuid": uuid, "category": category, "description": description, "price": price, "time": time])
  }

  public var __typename: String {
    get {
      return resultMap["__typename"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return resultMap["id"]! as! Int
    }
    set {
      resultMap.updateValue(newValue, forKey: "id")
    }
  }

  public var uuid: String? {
    get {
      return resultMap["uuid"] as? String
    }
    set {
      resultMap.updateValue(newValue, forKey: "uuid")
    }
  }

  public var category: String {
    get {
      return resultMap["category"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "category")
    }
  }

  public var description: String {
    get {
      return resultMap["description"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "description")
    }
  }

  public var price: String {
    get {
      return resultMap["price"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "price")
    }
  }

  public var time: String {
    get {
      return resultMap["time"]! as! String
    }
    set {
      resultMap.updateValue(newValue, forKey: "time")
    }
  }
}