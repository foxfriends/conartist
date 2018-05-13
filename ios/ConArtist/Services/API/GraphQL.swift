//  This file was automatically generated and should not be edited.

import Apollo

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

/// Information required to create a new price
public struct PriceAdd: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(typeId: Int, productId: Optional<Int?> = nil, quantity: Int, price: String) {
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

  public var productId: Optional<Int?> {
    get {
      return graphQLMap["productId"] as! Optional<Int?>
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

/// Information required to delete a convention expense
public struct ExpenseDel: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(expenseId: Optional<Int?> = nil, uuid: Optional<String?> = nil) {
    graphQLMap = ["expenseId": expenseId, "uuid": uuid]
  }

  public var expenseId: Optional<Int?> {
    get {
      return graphQLMap["expenseId"] as! Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "expenseId")
    }
  }

  public var uuid: Optional<String?> {
    get {
      return graphQLMap["uuid"] as! Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "uuid")
    }
  }
}

/// Information required to delete an existing price
public struct PriceDel: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(typeId: Int, productId: Optional<Int?> = nil, quantity: Int) {
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

  public var productId: Optional<Int?> {
    get {
      return graphQLMap["productId"] as! Optional<Int?>
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

/// Information required to delete a sales record
public struct RecordDel: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(recordId: Optional<Int?> = nil, uuid: Optional<String?> = nil) {
    graphQLMap = ["recordId": recordId, "uuid": uuid]
  }

  public var recordId: Optional<Int?> {
    get {
      return graphQLMap["recordId"] as! Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "recordId")
    }
  }

  public var uuid: Optional<String?> {
    get {
      return graphQLMap["uuid"] as! Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "uuid")
    }
  }
}

/// Information required to modify an existing product type
public struct ProductTypeMod: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(typeId: Int, name: Optional<String?> = nil, color: Optional<Int?> = nil, discontinued: Optional<Bool?> = nil, sort: Optional<Int?> = nil) {
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

  public var name: Optional<String?> {
    get {
      return graphQLMap["name"] as! Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "name")
    }
  }

  public var color: Optional<Int?> {
    get {
      return graphQLMap["color"] as! Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "color")
    }
  }

  public var discontinued: Optional<Bool?> {
    get {
      return graphQLMap["discontinued"] as! Optional<Bool?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "discontinued")
    }
  }

  public var sort: Optional<Int?> {
    get {
      return graphQLMap["sort"] as! Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "sort")
    }
  }
}

/// Information required to modify an existing product
public struct ProductMod: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(productId: Int, name: Optional<String?> = nil, quantity: Optional<Int?> = nil, discontinued: Optional<Bool?> = nil, sort: Optional<Int?> = nil) {
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

  public var name: Optional<String?> {
    get {
      return graphQLMap["name"] as! Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "name")
    }
  }

  public var quantity: Optional<Int?> {
    get {
      return graphQLMap["quantity"] as! Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "quantity")
    }
  }

  public var discontinued: Optional<Bool?> {
    get {
      return graphQLMap["discontinued"] as! Optional<Bool?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "discontinued")
    }
  }

  public var sort: Optional<Int?> {
    get {
      return graphQLMap["sort"] as! Optional<Int?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "sort")
    }
  }
}

/// Information required to modify a convention expense
public struct ExpenseMod: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(expenseId: Int, price: Optional<String?> = nil, category: Optional<String?> = nil, description: Optional<String?> = nil) {
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

  public var price: Optional<String?> {
    get {
      return graphQLMap["price"] as! Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "price")
    }
  }

  public var category: Optional<String?> {
    get {
      return graphQLMap["category"] as! Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "category")
    }
  }

  public var description: Optional<String?> {
    get {
      return graphQLMap["description"] as! Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "description")
    }
  }
}

/// Information required to modify a sales record
public struct RecordMod: GraphQLMapConvertible {
  public var graphQLMap: GraphQLMap

  public init(recordId: Int, products: Optional<[Int]?> = nil, price: Optional<String?> = nil, info: Optional<String?> = nil) {
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

  public var products: Optional<[Int]?> {
    get {
      return graphQLMap["products"] as! Optional<[Int]?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "products")
    }
  }

  public var price: Optional<String?> {
    get {
      return graphQLMap["price"] as! Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "price")
    }
  }

  public var info: Optional<String?> {
    get {
      return graphQLMap["info"] as! Optional<String?>
    }
    set {
      graphQLMap.updateValue(newValue, forKey: "info")
    }
  }
}

public final class AddConventionInfoMutation: GraphQLMutation {
  public static let operationString =
    "mutation AddConventionInfo($conId: Int!, $title: String!, $info: String, $action: String, $actionText: String) {\n  addConventionExtraInfo(conId: $conId, title: $title, info: $info, action: $action, actionText: $actionText) {\n    __typename\n    ...ExtraInfoFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(ExtraInfoFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(addConventionExtraInfo: AddConventionExtraInfo) {
      self.init(snapshot: ["__typename": "Mutation", "addConventionExtraInfo": addConventionExtraInfo.snapshot])
    }

    public var addConventionExtraInfo: AddConventionExtraInfo {
      get {
        return AddConventionExtraInfo(snapshot: snapshot["addConventionExtraInfo"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "addConventionExtraInfo")
      }
    }

    public struct AddConventionExtraInfo: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionExtraInfo"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("title", type: .nonNull(.scalar(String.self))),
        GraphQLField("info", type: .scalar(String.self)),
        GraphQLField("action", type: .scalar(String.self)),
        GraphQLField("actionText", type: .scalar(String.self)),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
        self.init(snapshot: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var title: String {
        get {
          return snapshot["title"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "title")
        }
      }

      public var info: String? {
        get {
          return snapshot["info"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "info")
        }
      }

      public var action: String? {
        get {
          return snapshot["action"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "action")
        }
      }

      public var actionText: String? {
        get {
          return snapshot["actionText"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "actionText")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var extraInfoFragment: ExtraInfoFragment {
          get {
            return ExtraInfoFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public final class AddExpenseMutation: GraphQLMutation {
  public static let operationString =
    "mutation AddExpense($id: Int, $expense: ExpenseAdd!) {\n  addUserExpense(userId: $id, expense: $expense) {\n    __typename\n    ...ExpenseFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(ExpenseFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(addUserExpense: AddUserExpense) {
      self.init(snapshot: ["__typename": "Mutation", "addUserExpense": addUserExpense.snapshot])
    }

    public var addUserExpense: AddUserExpense {
      get {
        return AddUserExpense(snapshot: snapshot["addUserExpense"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "addUserExpense")
      }
    }

    public struct AddUserExpense: GraphQLSelectionSet {
      public static let possibleTypes = ["Expense"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("uuid", type: .scalar(String.self)),
        GraphQLField("category", type: .nonNull(.scalar(String.self))),
        GraphQLField("description", type: .nonNull(.scalar(String.self))),
        GraphQLField("price", type: .nonNull(.scalar(String.self))),
        GraphQLField("time", type: .nonNull(.scalar(String.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, uuid: String? = nil, category: String, description: String, price: String, time: String) {
        self.init(snapshot: ["__typename": "Expense", "id": id, "uuid": uuid, "category": category, "description": description, "price": price, "time": time])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var uuid: String? {
        get {
          return snapshot["uuid"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "uuid")
        }
      }

      public var category: String {
        get {
          return snapshot["category"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "category")
        }
      }

      public var description: String {
        get {
          return snapshot["description"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "description")
        }
      }

      public var price: String {
        get {
          return snapshot["price"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "price")
        }
      }

      public var time: String {
        get {
          return snapshot["time"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "time")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var expenseFragment: ExpenseFragment {
          get {
            return ExpenseFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public final class AddPriceMutation: GraphQLMutation {
  public static let operationString =
    "mutation AddPrice($userId: Int, $price: PriceAdd!) {\n  addUserPrice(userId: $userId, price: $price) {\n    __typename\n    ...PriceFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(PriceFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(addUserPrice: AddUserPrice) {
      self.init(snapshot: ["__typename": "Mutation", "addUserPrice": addUserPrice.snapshot])
    }

    public var addUserPrice: AddUserPrice {
      get {
        return AddUserPrice(snapshot: snapshot["addUserPrice"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "addUserPrice")
      }
    }

    public struct AddUserPrice: GraphQLSelectionSet {
      public static let possibleTypes = ["Price"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
        GraphQLField("productId", type: .scalar(Int.self)),
        GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
        GraphQLField("price", type: .nonNull(.scalar(String.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(typeId: Int, productId: Int? = nil, quantity: Int, price: String) {
        self.init(snapshot: ["__typename": "Price", "typeId": typeId, "productId": productId, "quantity": quantity, "price": price])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var typeId: Int {
        get {
          return snapshot["typeId"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "typeId")
        }
      }

      public var productId: Int? {
        get {
          return snapshot["productId"] as? Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "productId")
        }
      }

      public var quantity: Int {
        get {
          return snapshot["quantity"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "quantity")
        }
      }

      public var price: String {
        get {
          return snapshot["price"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "price")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var priceFragment: PriceFragment {
          get {
            return PriceFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public final class AddProductTypeMutation: GraphQLMutation {
  public static let operationString =
    "mutation AddProductType($id: Int, $productType: ProductTypeAdd!) {\n  addUserProductType(userId: $id, productType: $productType) {\n    __typename\n    ...ProductTypeFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(ProductTypeFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(addUserProductType: AddUserProductType) {
      self.init(snapshot: ["__typename": "Mutation", "addUserProductType": addUserProductType.snapshot])
    }

    public var addUserProductType: AddUserProductType {
      get {
        return AddUserProductType(snapshot: snapshot["addUserProductType"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "addUserProductType")
      }
    }

    public struct AddUserProductType: GraphQLSelectionSet {
      public static let possibleTypes = ["ProductType"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("name", type: .nonNull(.scalar(String.self))),
        GraphQLField("color", type: .scalar(Int.self)),
        GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
        GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, name: String, color: Int? = nil, discontinued: Bool, sort: Int) {
        self.init(snapshot: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued, "sort": sort])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var name: String {
        get {
          return snapshot["name"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "name")
        }
      }

      public var color: Int? {
        get {
          return snapshot["color"] as? Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "color")
        }
      }

      public var discontinued: Bool {
        get {
          return snapshot["discontinued"]! as! Bool
        }
        set {
          snapshot.updateValue(newValue, forKey: "discontinued")
        }
      }

      public var sort: Int {
        get {
          return snapshot["sort"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "sort")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var productTypeFragment: ProductTypeFragment {
          get {
            return ProductTypeFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public final class AddProductMutation: GraphQLMutation {
  public static let operationString =
    "mutation AddProduct($id: Int, $product: ProductAdd!) {\n  addUserProduct(userId: $id, product: $product) {\n    __typename\n    ...ProductFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(ProductFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(addUserProduct: AddUserProduct) {
      self.init(snapshot: ["__typename": "Mutation", "addUserProduct": addUserProduct.snapshot])
    }

    public var addUserProduct: AddUserProduct {
      get {
        return AddUserProduct(snapshot: snapshot["addUserProduct"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "addUserProduct")
      }
    }

    public struct AddUserProduct: GraphQLSelectionSet {
      public static let possibleTypes = ["Product"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
        GraphQLField("name", type: .nonNull(.scalar(String.self))),
        GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
        GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
        GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool, sort: Int) {
        self.init(snapshot: ["__typename": "Product", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued, "sort": sort])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var typeId: Int {
        get {
          return snapshot["typeId"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "typeId")
        }
      }

      public var name: String {
        get {
          return snapshot["name"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "name")
        }
      }

      public var quantity: Int {
        get {
          return snapshot["quantity"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "quantity")
        }
      }

      public var discontinued: Bool {
        get {
          return snapshot["discontinued"]! as! Bool
        }
        set {
          snapshot.updateValue(newValue, forKey: "discontinued")
        }
      }

      public var sort: Int {
        get {
          return snapshot["sort"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "sort")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var productFragment: ProductFragment {
          get {
            return ProductFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public final class AddRecordMutation: GraphQLMutation {
  public static let operationString =
    "mutation AddRecord($id: Int, $record: RecordAdd!) {\n  addUserRecord(userId: $id, record: $record) {\n    __typename\n    ...RecordFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(RecordFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(addUserRecord: AddUserRecord) {
      self.init(snapshot: ["__typename": "Mutation", "addUserRecord": addUserRecord.snapshot])
    }

    public var addUserRecord: AddUserRecord {
      get {
        return AddUserRecord(snapshot: snapshot["addUserRecord"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "addUserRecord")
      }
    }

    public struct AddUserRecord: GraphQLSelectionSet {
      public static let possibleTypes = ["Record"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("uuid", type: .scalar(String.self)),
        GraphQLField("products", type: .nonNull(.list(.nonNull(.scalar(Int.self))))),
        GraphQLField("price", type: .nonNull(.scalar(String.self))),
        GraphQLField("time", type: .nonNull(.scalar(String.self))),
        GraphQLField("info", type: .nonNull(.scalar(String.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, uuid: String? = nil, products: [Int], price: String, time: String, info: String) {
        self.init(snapshot: ["__typename": "Record", "id": id, "uuid": uuid, "products": products, "price": price, "time": time, "info": info])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var uuid: String? {
        get {
          return snapshot["uuid"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "uuid")
        }
      }

      public var products: [Int] {
        get {
          return snapshot["products"]! as! [Int]
        }
        set {
          snapshot.updateValue(newValue, forKey: "products")
        }
      }

      public var price: String {
        get {
          return snapshot["price"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "price")
        }
      }

      public var time: String {
        get {
          return snapshot["time"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "time")
        }
      }

      public var info: String {
        get {
          return snapshot["info"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "info")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var recordFragment: RecordFragment {
          get {
            return RecordFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public final class AddUserConventionMutation: GraphQLMutation {
  public static let operationString =
    "mutation AddUserConvention($userId: Int, $conId: Int!) {\n  addUserConvention(userId: $userId, conId: $conId) {\n    __typename\n    ...MetaConventionFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(MetaConventionFragment.fragmentString).appending(ConventionBasicInfoFragment.fragmentString).appending(ConventionImageFragment.fragmentString).appending(ExtraInfoFragment.fragmentString).appending(UserInfoFragment.fragmentString).appending(VotesFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(addUserConvention: AddUserConvention) {
      self.init(snapshot: ["__typename": "Mutation", "addUserConvention": addUserConvention.snapshot])
    }

    public var addUserConvention: AddUserConvention {
      get {
        return AddUserConvention(snapshot: snapshot["addUserConvention"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "addUserConvention")
      }
    }

    public struct AddUserConvention: GraphQLSelectionSet {
      public static let possibleTypes = ["Convention"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("name", type: .nonNull(.scalar(String.self))),
        GraphQLField("images", type: .nonNull(.list(.nonNull(.object(Image.selections))))),
        GraphQLField("start", type: .nonNull(.scalar(String.self))),
        GraphQLField("end", type: .nonNull(.scalar(String.self))),
        GraphQLField("extraInfo", type: .nonNull(.list(.nonNull(.object(ExtraInfo.selections))))),
        GraphQLField("userInfo", type: .nonNull(.list(.nonNull(.object(UserInfo.selections))))),
        GraphQLField("recordTotal", type: .scalar(String.self)),
        GraphQLField("expenseTotal", type: .scalar(String.self)),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, name: String, images: [Image], start: String, end: String, extraInfo: [ExtraInfo], userInfo: [UserInfo], recordTotal: String? = nil, expenseTotal: String? = nil) {
        self.init(snapshot: ["__typename": "Convention", "id": id, "name": name, "images": images.map { $0.snapshot }, "start": start, "end": end, "extraInfo": extraInfo.map { $0.snapshot }, "userInfo": userInfo.map { $0.snapshot }, "recordTotal": recordTotal, "expenseTotal": expenseTotal])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var name: String {
        get {
          return snapshot["name"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "name")
        }
      }

      public var images: [Image] {
        get {
          return (snapshot["images"] as! [Snapshot]).map { Image(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "images")
        }
      }

      public var start: String {
        get {
          return snapshot["start"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "start")
        }
      }

      public var end: String {
        get {
          return snapshot["end"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "end")
        }
      }

      public var extraInfo: [ExtraInfo] {
        get {
          return (snapshot["extraInfo"] as! [Snapshot]).map { ExtraInfo(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "extraInfo")
        }
      }

      public var userInfo: [UserInfo] {
        get {
          return (snapshot["userInfo"] as! [Snapshot]).map { UserInfo(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "userInfo")
        }
      }

      public var recordTotal: String? {
        get {
          return snapshot["recordTotal"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "recordTotal")
        }
      }

      public var expenseTotal: String? {
        get {
          return snapshot["expenseTotal"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "expenseTotal")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var metaConventionFragment: MetaConventionFragment {
          get {
            return MetaConventionFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public var conventionBasicInfoFragment: ConventionBasicInfoFragment {
          get {
            return ConventionBasicInfoFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }

      public struct Image: GraphQLSelectionSet {
        public static let possibleTypes = ["ConventionImage"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(String.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: String) {
          self.init(snapshot: ["__typename": "ConventionImage", "id": id])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var id: String {
          get {
            return snapshot["id"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "id")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var conventionImageFragment: ConventionImageFragment {
            get {
              return ConventionImageFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }

      public struct ExtraInfo: GraphQLSelectionSet {
        public static let possibleTypes = ["ConventionExtraInfo"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("title", type: .nonNull(.scalar(String.self))),
          GraphQLField("info", type: .scalar(String.self)),
          GraphQLField("action", type: .scalar(String.self)),
          GraphQLField("actionText", type: .scalar(String.self)),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
          self.init(snapshot: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var title: String {
          get {
            return snapshot["title"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "title")
          }
        }

        public var info: String? {
          get {
            return snapshot["info"] as? String
          }
          set {
            snapshot.updateValue(newValue, forKey: "info")
          }
        }

        public var action: String? {
          get {
            return snapshot["action"] as? String
          }
          set {
            snapshot.updateValue(newValue, forKey: "action")
          }
        }

        public var actionText: String? {
          get {
            return snapshot["actionText"] as? String
          }
          set {
            snapshot.updateValue(newValue, forKey: "actionText")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var extraInfoFragment: ExtraInfoFragment {
            get {
              return ExtraInfoFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }

      public struct UserInfo: GraphQLSelectionSet {
        public static let possibleTypes = ["ConventionUserInfo"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("info", type: .nonNull(.scalar(String.self))),
          GraphQLField("vote", type: .nonNull(.scalar(Int.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
          GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
          self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var id: Int {
          get {
            return snapshot["id"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "id")
          }
        }

        public var info: String {
          get {
            return snapshot["info"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "info")
          }
        }

        public var vote: Int {
          get {
            return snapshot["vote"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "vote")
          }
        }

        public var upvotes: Int {
          get {
            return snapshot["upvotes"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "upvotes")
          }
        }

        public var downvotes: Int {
          get {
            return snapshot["downvotes"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "downvotes")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var userInfoFragment: UserInfoFragment {
            get {
              return UserInfoFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }

          public var votesFragment: VotesFragment {
            get {
              return VotesFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }
    }
  }
}

public final class ContributeConventionInfoMutation: GraphQLMutation {
  public static let operationString =
    "mutation ContributeConventionInfo($userId: Int, $conId: Int!, $info: String!) {\n  addConventionInfo(userId: $userId, conId: $conId, info: $info) {\n    __typename\n    ...UserInfoFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(UserInfoFragment.fragmentString).appending(VotesFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(addConventionInfo: AddConventionInfo) {
      self.init(snapshot: ["__typename": "Mutation", "addConventionInfo": addConventionInfo.snapshot])
    }

    public var addConventionInfo: AddConventionInfo {
      get {
        return AddConventionInfo(snapshot: snapshot["addConventionInfo"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "addConventionInfo")
      }
    }

    public struct AddConventionInfo: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionUserInfo"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("info", type: .nonNull(.scalar(String.self))),
        GraphQLField("vote", type: .nonNull(.scalar(Int.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
        GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
        self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var info: String {
        get {
          return snapshot["info"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "info")
        }
      }

      public var vote: Int {
        get {
          return snapshot["vote"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "vote")
        }
      }

      public var upvotes: Int {
        get {
          return snapshot["upvotes"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "upvotes")
        }
      }

      public var downvotes: Int {
        get {
          return snapshot["downvotes"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "downvotes")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var userInfoFragment: UserInfoFragment {
          get {
            return UserInfoFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public var votesFragment: VotesFragment {
          get {
            return VotesFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public final class CreateConventionMutation: GraphQLMutation {
  public static let operationString =
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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(createConvention: CreateConvention) {
      self.init(snapshot: ["__typename": "Mutation", "createConvention": createConvention.snapshot])
    }

    public var createConvention: CreateConvention {
      get {
        return CreateConvention(snapshot: snapshot["createConvention"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "createConvention")
      }
    }

    public struct CreateConvention: GraphQLSelectionSet {
      public static let possibleTypes = ["Convention"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int) {
        self.init(snapshot: ["__typename": "Convention", "id": id])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }
    }
  }
}

public final class DeleteExpenseMutation: GraphQLMutation {
  public static let operationString =
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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(delUserExpense: Bool) {
      self.init(snapshot: ["__typename": "Mutation", "delUserExpense": delUserExpense])
    }

    public var delUserExpense: Bool {
      get {
        return snapshot["delUserExpense"]! as! Bool
      }
      set {
        snapshot.updateValue(newValue, forKey: "delUserExpense")
      }
    }
  }
}

public final class DeletePriceMutation: GraphQLMutation {
  public static let operationString =
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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(delUserPrice: Bool) {
      self.init(snapshot: ["__typename": "Mutation", "delUserPrice": delUserPrice])
    }

    public var delUserPrice: Bool {
      get {
        return snapshot["delUserPrice"]! as! Bool
      }
      set {
        snapshot.updateValue(newValue, forKey: "delUserPrice")
      }
    }
  }
}

public final class DeleteRecordMutation: GraphQLMutation {
  public static let operationString =
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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(delUserRecord: Bool) {
      self.init(snapshot: ["__typename": "Mutation", "delUserRecord": delUserRecord])
    }

    public var delUserRecord: Bool {
      get {
        return snapshot["delUserRecord"]! as! Bool
      }
      set {
        snapshot.updateValue(newValue, forKey: "delUserRecord")
      }
    }
  }
}

public final class DeleteUserConventionMutation: GraphQLMutation {
  public static let operationString =
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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(delUserConvention: Bool) {
      self.init(snapshot: ["__typename": "Mutation", "delUserConvention": delUserConvention])
    }

    public var delUserConvention: Bool {
      get {
        return snapshot["delUserConvention"]! as! Bool
      }
      set {
        snapshot.updateValue(newValue, forKey: "delUserConvention")
      }
    }
  }
}

public final class DownvoteConventionInfoMutation: GraphQLMutation {
  public static let operationString =
    "mutation DownvoteConventionInfo($userId: Int, $infoId: Int!) {\n  downvoteConventionInfo(userId: $userId, infoId: $infoId) {\n    __typename\n    id\n    ...VotesFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(VotesFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(downvoteConventionInfo: DownvoteConventionInfo) {
      self.init(snapshot: ["__typename": "Mutation", "downvoteConventionInfo": downvoteConventionInfo.snapshot])
    }

    public var downvoteConventionInfo: DownvoteConventionInfo {
      get {
        return DownvoteConventionInfo(snapshot: snapshot["downvoteConventionInfo"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "downvoteConventionInfo")
      }
    }

    public struct DownvoteConventionInfo: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionUserInfo"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
        GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, upvotes: Int, downvotes: Int) {
        self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "upvotes": upvotes, "downvotes": downvotes])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var upvotes: Int {
        get {
          return snapshot["upvotes"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "upvotes")
        }
      }

      public var downvotes: Int {
        get {
          return snapshot["downvotes"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "downvotes")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var votesFragment: VotesFragment {
          get {
            return VotesFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public final class ModProductTypeMutation: GraphQLMutation {
  public static let operationString =
    "mutation ModProductType($id: Int, $productType: ProductTypeMod!) {\n  modUserProductType(userId: $id, productType: $productType) {\n    __typename\n    ...ProductTypeFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(ProductTypeFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(modUserProductType: ModUserProductType) {
      self.init(snapshot: ["__typename": "Mutation", "modUserProductType": modUserProductType.snapshot])
    }

    public var modUserProductType: ModUserProductType {
      get {
        return ModUserProductType(snapshot: snapshot["modUserProductType"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "modUserProductType")
      }
    }

    public struct ModUserProductType: GraphQLSelectionSet {
      public static let possibleTypes = ["ProductType"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("name", type: .nonNull(.scalar(String.self))),
        GraphQLField("color", type: .scalar(Int.self)),
        GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
        GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, name: String, color: Int? = nil, discontinued: Bool, sort: Int) {
        self.init(snapshot: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued, "sort": sort])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var name: String {
        get {
          return snapshot["name"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "name")
        }
      }

      public var color: Int? {
        get {
          return snapshot["color"] as? Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "color")
        }
      }

      public var discontinued: Bool {
        get {
          return snapshot["discontinued"]! as! Bool
        }
        set {
          snapshot.updateValue(newValue, forKey: "discontinued")
        }
      }

      public var sort: Int {
        get {
          return snapshot["sort"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "sort")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var productTypeFragment: ProductTypeFragment {
          get {
            return ProductTypeFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public final class ModProductMutation: GraphQLMutation {
  public static let operationString =
    "mutation ModProduct($id: Int, $product: ProductMod!) {\n  modUserProduct(userId: $id, product: $product) {\n    __typename\n    ...ProductFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(ProductFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(modUserProduct: ModUserProduct) {
      self.init(snapshot: ["__typename": "Mutation", "modUserProduct": modUserProduct.snapshot])
    }

    public var modUserProduct: ModUserProduct {
      get {
        return ModUserProduct(snapshot: snapshot["modUserProduct"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "modUserProduct")
      }
    }

    public struct ModUserProduct: GraphQLSelectionSet {
      public static let possibleTypes = ["Product"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
        GraphQLField("name", type: .nonNull(.scalar(String.self))),
        GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
        GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
        GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool, sort: Int) {
        self.init(snapshot: ["__typename": "Product", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued, "sort": sort])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var typeId: Int {
        get {
          return snapshot["typeId"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "typeId")
        }
      }

      public var name: String {
        get {
          return snapshot["name"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "name")
        }
      }

      public var quantity: Int {
        get {
          return snapshot["quantity"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "quantity")
        }
      }

      public var discontinued: Bool {
        get {
          return snapshot["discontinued"]! as! Bool
        }
        set {
          snapshot.updateValue(newValue, forKey: "discontinued")
        }
      }

      public var sort: Int {
        get {
          return snapshot["sort"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "sort")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var productFragment: ProductFragment {
          get {
            return ProductFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public final class UpdateCurrencyMutation: GraphQLMutation {
  public static let operationString =
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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(updateSettings: UpdateSetting) {
      self.init(snapshot: ["__typename": "Mutation", "updateSettings": updateSettings.snapshot])
    }

    public var updateSettings: UpdateSetting {
      get {
        return UpdateSetting(snapshot: snapshot["updateSettings"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "updateSettings")
      }
    }

    public struct UpdateSetting: GraphQLSelectionSet {
      public static let possibleTypes = ["SettingsMutation"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("currency", arguments: ["currency": GraphQLVariable("currency")], type: .nonNull(.scalar(String.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(currency: String) {
        self.init(snapshot: ["__typename": "SettingsMutation", "currency": currency])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var currency: String {
        get {
          return snapshot["currency"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "currency")
        }
      }
    }
  }
}

public final class UpdateExpenseMutation: GraphQLMutation {
  public static let operationString =
    "mutation UpdateExpense($id: Int, $expense: ExpenseMod!) {\n  modUserExpense(userId: $id, expense: $expense) {\n    __typename\n    ...ExpenseFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(ExpenseFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(modUserExpense: ModUserExpense) {
      self.init(snapshot: ["__typename": "Mutation", "modUserExpense": modUserExpense.snapshot])
    }

    public var modUserExpense: ModUserExpense {
      get {
        return ModUserExpense(snapshot: snapshot["modUserExpense"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "modUserExpense")
      }
    }

    public struct ModUserExpense: GraphQLSelectionSet {
      public static let possibleTypes = ["Expense"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("uuid", type: .scalar(String.self)),
        GraphQLField("category", type: .nonNull(.scalar(String.self))),
        GraphQLField("description", type: .nonNull(.scalar(String.self))),
        GraphQLField("price", type: .nonNull(.scalar(String.self))),
        GraphQLField("time", type: .nonNull(.scalar(String.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, uuid: String? = nil, category: String, description: String, price: String, time: String) {
        self.init(snapshot: ["__typename": "Expense", "id": id, "uuid": uuid, "category": category, "description": description, "price": price, "time": time])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var uuid: String? {
        get {
          return snapshot["uuid"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "uuid")
        }
      }

      public var category: String {
        get {
          return snapshot["category"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "category")
        }
      }

      public var description: String {
        get {
          return snapshot["description"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "description")
        }
      }

      public var price: String {
        get {
          return snapshot["price"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "price")
        }
      }

      public var time: String {
        get {
          return snapshot["time"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "time")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var expenseFragment: ExpenseFragment {
          get {
            return ExpenseFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public final class UpdateRecordMutation: GraphQLMutation {
  public static let operationString =
    "mutation UpdateRecord($id: Int, $record: RecordMod!) {\n  modUserRecord(userId: $id, record: $record) {\n    __typename\n    ...RecordFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(RecordFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(modUserRecord: ModUserRecord) {
      self.init(snapshot: ["__typename": "Mutation", "modUserRecord": modUserRecord.snapshot])
    }

    public var modUserRecord: ModUserRecord {
      get {
        return ModUserRecord(snapshot: snapshot["modUserRecord"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "modUserRecord")
      }
    }

    public struct ModUserRecord: GraphQLSelectionSet {
      public static let possibleTypes = ["Record"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("uuid", type: .scalar(String.self)),
        GraphQLField("products", type: .nonNull(.list(.nonNull(.scalar(Int.self))))),
        GraphQLField("price", type: .nonNull(.scalar(String.self))),
        GraphQLField("time", type: .nonNull(.scalar(String.self))),
        GraphQLField("info", type: .nonNull(.scalar(String.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, uuid: String? = nil, products: [Int], price: String, time: String, info: String) {
        self.init(snapshot: ["__typename": "Record", "id": id, "uuid": uuid, "products": products, "price": price, "time": time, "info": info])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var uuid: String? {
        get {
          return snapshot["uuid"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "uuid")
        }
      }

      public var products: [Int] {
        get {
          return snapshot["products"]! as! [Int]
        }
        set {
          snapshot.updateValue(newValue, forKey: "products")
        }
      }

      public var price: String {
        get {
          return snapshot["price"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "price")
        }
      }

      public var time: String {
        get {
          return snapshot["time"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "time")
        }
      }

      public var info: String {
        get {
          return snapshot["info"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "info")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var recordFragment: RecordFragment {
          get {
            return RecordFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public final class UpvoteConventionInfoMutation: GraphQLMutation {
  public static let operationString =
    "mutation UpvoteConventionInfo($userId: Int, $infoId: Int!) {\n  upvoteConventionInfo(userId: $userId, infoId: $infoId) {\n    __typename\n    id\n    ...VotesFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(VotesFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(upvoteConventionInfo: UpvoteConventionInfo) {
      self.init(snapshot: ["__typename": "Mutation", "upvoteConventionInfo": upvoteConventionInfo.snapshot])
    }

    public var upvoteConventionInfo: UpvoteConventionInfo {
      get {
        return UpvoteConventionInfo(snapshot: snapshot["upvoteConventionInfo"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "upvoteConventionInfo")
      }
    }

    public struct UpvoteConventionInfo: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionUserInfo"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
        GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, upvotes: Int, downvotes: Int) {
        self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "upvotes": upvotes, "downvotes": downvotes])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var upvotes: Int {
        get {
          return snapshot["upvotes"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "upvotes")
        }
      }

      public var downvotes: Int {
        get {
          return snapshot["downvotes"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "downvotes")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var votesFragment: VotesFragment {
          get {
            return VotesFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public final class ConventionsConnectionQuery: GraphQLQuery {
  public static let operationString =
    "query ConventionsConnection($date: DateTimeFixedOffset, $search: String, $limit: Int, $before: String, $after: String) {\n  conventionsConnection(date: $date, search: $search, limit: $limit, after: $after, before: $before) {\n    __typename\n    nodes {\n      __typename\n      ...ConventionBasicInfoFragment\n    }\n    endCursor\n    totalNodes\n  }\n}"

  public static var requestString: String { return operationString.appending(ConventionBasicInfoFragment.fragmentString).appending(ConventionImageFragment.fragmentString).appending(ExtraInfoFragment.fragmentString).appending(UserInfoFragment.fragmentString).appending(VotesFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(conventionsConnection: ConventionsConnection) {
      self.init(snapshot: ["__typename": "Query", "conventionsConnection": conventionsConnection.snapshot])
    }

    /// Retrieves one page of conventions which start after a given date
    public var conventionsConnection: ConventionsConnection {
      get {
        return ConventionsConnection(snapshot: snapshot["conventionsConnection"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "conventionsConnection")
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

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(nodes: [Node], endCursor: String? = nil, totalNodes: Int) {
        self.init(snapshot: ["__typename": "ConventionsConnection", "nodes": nodes.map { $0.snapshot }, "endCursor": endCursor, "totalNodes": totalNodes])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var nodes: [Node] {
        get {
          return (snapshot["nodes"] as! [Snapshot]).map { Node(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "nodes")
        }
      }

      public var endCursor: String? {
        get {
          return snapshot["endCursor"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "endCursor")
        }
      }

      public var totalNodes: Int {
        get {
          return snapshot["totalNodes"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "totalNodes")
        }
      }

      public struct Node: GraphQLSelectionSet {
        public static let possibleTypes = ["Convention"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("name", type: .nonNull(.scalar(String.self))),
          GraphQLField("images", type: .nonNull(.list(.nonNull(.object(Image.selections))))),
          GraphQLField("start", type: .nonNull(.scalar(String.self))),
          GraphQLField("end", type: .nonNull(.scalar(String.self))),
          GraphQLField("extraInfo", type: .nonNull(.list(.nonNull(.object(ExtraInfo.selections))))),
          GraphQLField("userInfo", type: .nonNull(.list(.nonNull(.object(UserInfo.selections))))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, name: String, images: [Image], start: String, end: String, extraInfo: [ExtraInfo], userInfo: [UserInfo]) {
          self.init(snapshot: ["__typename": "Convention", "id": id, "name": name, "images": images.map { $0.snapshot }, "start": start, "end": end, "extraInfo": extraInfo.map { $0.snapshot }, "userInfo": userInfo.map { $0.snapshot }])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var id: Int {
          get {
            return snapshot["id"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "id")
          }
        }

        public var name: String {
          get {
            return snapshot["name"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "name")
          }
        }

        public var images: [Image] {
          get {
            return (snapshot["images"] as! [Snapshot]).map { Image(snapshot: $0) }
          }
          set {
            snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "images")
          }
        }

        public var start: String {
          get {
            return snapshot["start"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "start")
          }
        }

        public var end: String {
          get {
            return snapshot["end"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "end")
          }
        }

        public var extraInfo: [ExtraInfo] {
          get {
            return (snapshot["extraInfo"] as! [Snapshot]).map { ExtraInfo(snapshot: $0) }
          }
          set {
            snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "extraInfo")
          }
        }

        public var userInfo: [UserInfo] {
          get {
            return (snapshot["userInfo"] as! [Snapshot]).map { UserInfo(snapshot: $0) }
          }
          set {
            snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "userInfo")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var conventionBasicInfoFragment: ConventionBasicInfoFragment {
            get {
              return ConventionBasicInfoFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }

        public struct Image: GraphQLSelectionSet {
          public static let possibleTypes = ["ConventionImage"]

          public static let selections: [GraphQLSelection] = [
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("id", type: .nonNull(.scalar(String.self))),
          ]

          public var snapshot: Snapshot

          public init(snapshot: Snapshot) {
            self.snapshot = snapshot
          }

          public init(id: String) {
            self.init(snapshot: ["__typename": "ConventionImage", "id": id])
          }

          public var __typename: String {
            get {
              return snapshot["__typename"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "__typename")
            }
          }

          public var id: String {
            get {
              return snapshot["id"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "id")
            }
          }

          public var fragments: Fragments {
            get {
              return Fragments(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }

          public struct Fragments {
            public var snapshot: Snapshot

            public var conventionImageFragment: ConventionImageFragment {
              get {
                return ConventionImageFragment(snapshot: snapshot)
              }
              set {
                snapshot += newValue.snapshot
              }
            }
          }
        }

        public struct ExtraInfo: GraphQLSelectionSet {
          public static let possibleTypes = ["ConventionExtraInfo"]

          public static let selections: [GraphQLSelection] = [
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("title", type: .nonNull(.scalar(String.self))),
            GraphQLField("info", type: .scalar(String.self)),
            GraphQLField("action", type: .scalar(String.self)),
            GraphQLField("actionText", type: .scalar(String.self)),
          ]

          public var snapshot: Snapshot

          public init(snapshot: Snapshot) {
            self.snapshot = snapshot
          }

          public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
            self.init(snapshot: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
          }

          public var __typename: String {
            get {
              return snapshot["__typename"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "__typename")
            }
          }

          public var title: String {
            get {
              return snapshot["title"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "title")
            }
          }

          public var info: String? {
            get {
              return snapshot["info"] as? String
            }
            set {
              snapshot.updateValue(newValue, forKey: "info")
            }
          }

          public var action: String? {
            get {
              return snapshot["action"] as? String
            }
            set {
              snapshot.updateValue(newValue, forKey: "action")
            }
          }

          public var actionText: String? {
            get {
              return snapshot["actionText"] as? String
            }
            set {
              snapshot.updateValue(newValue, forKey: "actionText")
            }
          }

          public var fragments: Fragments {
            get {
              return Fragments(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }

          public struct Fragments {
            public var snapshot: Snapshot

            public var extraInfoFragment: ExtraInfoFragment {
              get {
                return ExtraInfoFragment(snapshot: snapshot)
              }
              set {
                snapshot += newValue.snapshot
              }
            }
          }
        }

        public struct UserInfo: GraphQLSelectionSet {
          public static let possibleTypes = ["ConventionUserInfo"]

          public static let selections: [GraphQLSelection] = [
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("id", type: .nonNull(.scalar(Int.self))),
            GraphQLField("info", type: .nonNull(.scalar(String.self))),
            GraphQLField("vote", type: .nonNull(.scalar(Int.self))),
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
            GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
          ]

          public var snapshot: Snapshot

          public init(snapshot: Snapshot) {
            self.snapshot = snapshot
          }

          public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
            self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
          }

          public var __typename: String {
            get {
              return snapshot["__typename"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "__typename")
            }
          }

          public var id: Int {
            get {
              return snapshot["id"]! as! Int
            }
            set {
              snapshot.updateValue(newValue, forKey: "id")
            }
          }

          public var info: String {
            get {
              return snapshot["info"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "info")
            }
          }

          public var vote: Int {
            get {
              return snapshot["vote"]! as! Int
            }
            set {
              snapshot.updateValue(newValue, forKey: "vote")
            }
          }

          public var upvotes: Int {
            get {
              return snapshot["upvotes"]! as! Int
            }
            set {
              snapshot.updateValue(newValue, forKey: "upvotes")
            }
          }

          public var downvotes: Int {
            get {
              return snapshot["downvotes"]! as! Int
            }
            set {
              snapshot.updateValue(newValue, forKey: "downvotes")
            }
          }

          public var fragments: Fragments {
            get {
              return Fragments(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }

          public struct Fragments {
            public var snapshot: Snapshot

            public var userInfoFragment: UserInfoFragment {
              get {
                return UserInfoFragment(snapshot: snapshot)
              }
              set {
                snapshot += newValue.snapshot
              }
            }

            public var votesFragment: VotesFragment {
              get {
                return VotesFragment(snapshot: snapshot)
              }
              set {
                snapshot += newValue.snapshot
              }
            }
          }
        }
      }
    }
  }
}

public final class FullConventionQuery: GraphQLQuery {
  public static let operationString =
    "query FullConvention($userId: Int, $conId: Int!) {\n  convention(userId: $userId, conId: $conId) {\n    __typename\n    ...FullConventionFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(FullConventionFragment.fragmentString).appending(MetaConventionFragment.fragmentString).appending(ConventionBasicInfoFragment.fragmentString).appending(ConventionImageFragment.fragmentString).appending(ExtraInfoFragment.fragmentString).appending(UserInfoFragment.fragmentString).appending(VotesFragment.fragmentString).appending(ProductFragment.fragmentString).appending(ProductTypeFragment.fragmentString).appending(PriceFragment.fragmentString).appending(RecordFragment.fragmentString).appending(ExpenseFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(convention: Convention) {
      self.init(snapshot: ["__typename": "Query", "convention": convention.snapshot])
    }

    /// Retrieves the full information of one convention
    public var convention: Convention {
      get {
        return Convention(snapshot: snapshot["convention"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "convention")
      }
    }

    public struct Convention: GraphQLSelectionSet {
      public static let possibleTypes = ["Convention"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("name", type: .nonNull(.scalar(String.self))),
        GraphQLField("images", type: .nonNull(.list(.nonNull(.object(Image.selections))))),
        GraphQLField("start", type: .nonNull(.scalar(String.self))),
        GraphQLField("end", type: .nonNull(.scalar(String.self))),
        GraphQLField("extraInfo", type: .nonNull(.list(.nonNull(.object(ExtraInfo.selections))))),
        GraphQLField("userInfo", type: .nonNull(.list(.nonNull(.object(UserInfo.selections))))),
        GraphQLField("recordTotal", type: .scalar(String.self)),
        GraphQLField("expenseTotal", type: .scalar(String.self)),
        GraphQLField("products", type: .nonNull(.list(.nonNull(.object(Product.selections))))),
        GraphQLField("productTypes", type: .nonNull(.list(.nonNull(.object(ProductType.selections))))),
        GraphQLField("prices", type: .nonNull(.list(.nonNull(.object(Price.selections))))),
        GraphQLField("records", type: .nonNull(.list(.nonNull(.object(Record.selections))))),
        GraphQLField("expenses", type: .nonNull(.list(.nonNull(.object(Expense.selections))))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, name: String, images: [Image], start: String, end: String, extraInfo: [ExtraInfo], userInfo: [UserInfo], recordTotal: String? = nil, expenseTotal: String? = nil, products: [Product], productTypes: [ProductType], prices: [Price], records: [Record], expenses: [Expense]) {
        self.init(snapshot: ["__typename": "Convention", "id": id, "name": name, "images": images.map { $0.snapshot }, "start": start, "end": end, "extraInfo": extraInfo.map { $0.snapshot }, "userInfo": userInfo.map { $0.snapshot }, "recordTotal": recordTotal, "expenseTotal": expenseTotal, "products": products.map { $0.snapshot }, "productTypes": productTypes.map { $0.snapshot }, "prices": prices.map { $0.snapshot }, "records": records.map { $0.snapshot }, "expenses": expenses.map { $0.snapshot }])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var name: String {
        get {
          return snapshot["name"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "name")
        }
      }

      public var images: [Image] {
        get {
          return (snapshot["images"] as! [Snapshot]).map { Image(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "images")
        }
      }

      public var start: String {
        get {
          return snapshot["start"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "start")
        }
      }

      public var end: String {
        get {
          return snapshot["end"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "end")
        }
      }

      public var extraInfo: [ExtraInfo] {
        get {
          return (snapshot["extraInfo"] as! [Snapshot]).map { ExtraInfo(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "extraInfo")
        }
      }

      public var userInfo: [UserInfo] {
        get {
          return (snapshot["userInfo"] as! [Snapshot]).map { UserInfo(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "userInfo")
        }
      }

      public var recordTotal: String? {
        get {
          return snapshot["recordTotal"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "recordTotal")
        }
      }

      public var expenseTotal: String? {
        get {
          return snapshot["expenseTotal"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "expenseTotal")
        }
      }

      public var products: [Product] {
        get {
          return (snapshot["products"] as! [Snapshot]).map { Product(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "products")
        }
      }

      public var productTypes: [ProductType] {
        get {
          return (snapshot["productTypes"] as! [Snapshot]).map { ProductType(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "productTypes")
        }
      }

      public var prices: [Price] {
        get {
          return (snapshot["prices"] as! [Snapshot]).map { Price(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "prices")
        }
      }

      public var records: [Record] {
        get {
          return (snapshot["records"] as! [Snapshot]).map { Record(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "records")
        }
      }

      public var expenses: [Expense] {
        get {
          return (snapshot["expenses"] as! [Snapshot]).map { Expense(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "expenses")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var fullConventionFragment: FullConventionFragment {
          get {
            return FullConventionFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public var metaConventionFragment: MetaConventionFragment {
          get {
            return MetaConventionFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public var conventionBasicInfoFragment: ConventionBasicInfoFragment {
          get {
            return ConventionBasicInfoFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }

      public struct Image: GraphQLSelectionSet {
        public static let possibleTypes = ["ConventionImage"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(String.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: String) {
          self.init(snapshot: ["__typename": "ConventionImage", "id": id])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var id: String {
          get {
            return snapshot["id"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "id")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var conventionImageFragment: ConventionImageFragment {
            get {
              return ConventionImageFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }

      public struct ExtraInfo: GraphQLSelectionSet {
        public static let possibleTypes = ["ConventionExtraInfo"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("title", type: .nonNull(.scalar(String.self))),
          GraphQLField("info", type: .scalar(String.self)),
          GraphQLField("action", type: .scalar(String.self)),
          GraphQLField("actionText", type: .scalar(String.self)),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
          self.init(snapshot: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var title: String {
          get {
            return snapshot["title"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "title")
          }
        }

        public var info: String? {
          get {
            return snapshot["info"] as? String
          }
          set {
            snapshot.updateValue(newValue, forKey: "info")
          }
        }

        public var action: String? {
          get {
            return snapshot["action"] as? String
          }
          set {
            snapshot.updateValue(newValue, forKey: "action")
          }
        }

        public var actionText: String? {
          get {
            return snapshot["actionText"] as? String
          }
          set {
            snapshot.updateValue(newValue, forKey: "actionText")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var extraInfoFragment: ExtraInfoFragment {
            get {
              return ExtraInfoFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }

      public struct UserInfo: GraphQLSelectionSet {
        public static let possibleTypes = ["ConventionUserInfo"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("info", type: .nonNull(.scalar(String.self))),
          GraphQLField("vote", type: .nonNull(.scalar(Int.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
          GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
          self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var id: Int {
          get {
            return snapshot["id"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "id")
          }
        }

        public var info: String {
          get {
            return snapshot["info"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "info")
          }
        }

        public var vote: Int {
          get {
            return snapshot["vote"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "vote")
          }
        }

        public var upvotes: Int {
          get {
            return snapshot["upvotes"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "upvotes")
          }
        }

        public var downvotes: Int {
          get {
            return snapshot["downvotes"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "downvotes")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var userInfoFragment: UserInfoFragment {
            get {
              return UserInfoFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }

          public var votesFragment: VotesFragment {
            get {
              return VotesFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }

      public struct Product: GraphQLSelectionSet {
        public static let possibleTypes = ["Product"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
          GraphQLField("name", type: .nonNull(.scalar(String.self))),
          GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
          GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
          GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool, sort: Int) {
          self.init(snapshot: ["__typename": "Product", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued, "sort": sort])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var id: Int {
          get {
            return snapshot["id"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "id")
          }
        }

        public var typeId: Int {
          get {
            return snapshot["typeId"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "typeId")
          }
        }

        public var name: String {
          get {
            return snapshot["name"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "name")
          }
        }

        public var quantity: Int {
          get {
            return snapshot["quantity"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "quantity")
          }
        }

        public var discontinued: Bool {
          get {
            return snapshot["discontinued"]! as! Bool
          }
          set {
            snapshot.updateValue(newValue, forKey: "discontinued")
          }
        }

        public var sort: Int {
          get {
            return snapshot["sort"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "sort")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var productFragment: ProductFragment {
            get {
              return ProductFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }

      public struct ProductType: GraphQLSelectionSet {
        public static let possibleTypes = ["ProductType"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("name", type: .nonNull(.scalar(String.self))),
          GraphQLField("color", type: .scalar(Int.self)),
          GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
          GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, name: String, color: Int? = nil, discontinued: Bool, sort: Int) {
          self.init(snapshot: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued, "sort": sort])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var id: Int {
          get {
            return snapshot["id"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "id")
          }
        }

        public var name: String {
          get {
            return snapshot["name"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "name")
          }
        }

        public var color: Int? {
          get {
            return snapshot["color"] as? Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "color")
          }
        }

        public var discontinued: Bool {
          get {
            return snapshot["discontinued"]! as! Bool
          }
          set {
            snapshot.updateValue(newValue, forKey: "discontinued")
          }
        }

        public var sort: Int {
          get {
            return snapshot["sort"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "sort")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var productTypeFragment: ProductTypeFragment {
            get {
              return ProductTypeFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }

      public struct Price: GraphQLSelectionSet {
        public static let possibleTypes = ["Price"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
          GraphQLField("productId", type: .scalar(Int.self)),
          GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
          GraphQLField("price", type: .nonNull(.scalar(String.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(typeId: Int, productId: Int? = nil, quantity: Int, price: String) {
          self.init(snapshot: ["__typename": "Price", "typeId": typeId, "productId": productId, "quantity": quantity, "price": price])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var typeId: Int {
          get {
            return snapshot["typeId"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "typeId")
          }
        }

        public var productId: Int? {
          get {
            return snapshot["productId"] as? Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "productId")
          }
        }

        public var quantity: Int {
          get {
            return snapshot["quantity"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "quantity")
          }
        }

        public var price: String {
          get {
            return snapshot["price"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "price")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var priceFragment: PriceFragment {
            get {
              return PriceFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }

      public struct Record: GraphQLSelectionSet {
        public static let possibleTypes = ["Record"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("uuid", type: .scalar(String.self)),
          GraphQLField("products", type: .nonNull(.list(.nonNull(.scalar(Int.self))))),
          GraphQLField("price", type: .nonNull(.scalar(String.self))),
          GraphQLField("time", type: .nonNull(.scalar(String.self))),
          GraphQLField("info", type: .nonNull(.scalar(String.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, uuid: String? = nil, products: [Int], price: String, time: String, info: String) {
          self.init(snapshot: ["__typename": "Record", "id": id, "uuid": uuid, "products": products, "price": price, "time": time, "info": info])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var id: Int {
          get {
            return snapshot["id"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "id")
          }
        }

        public var uuid: String? {
          get {
            return snapshot["uuid"] as? String
          }
          set {
            snapshot.updateValue(newValue, forKey: "uuid")
          }
        }

        public var products: [Int] {
          get {
            return snapshot["products"]! as! [Int]
          }
          set {
            snapshot.updateValue(newValue, forKey: "products")
          }
        }

        public var price: String {
          get {
            return snapshot["price"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "price")
          }
        }

        public var time: String {
          get {
            return snapshot["time"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "time")
          }
        }

        public var info: String {
          get {
            return snapshot["info"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "info")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var recordFragment: RecordFragment {
            get {
              return RecordFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }

      public struct Expense: GraphQLSelectionSet {
        public static let possibleTypes = ["Expense"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("uuid", type: .scalar(String.self)),
          GraphQLField("category", type: .nonNull(.scalar(String.self))),
          GraphQLField("description", type: .nonNull(.scalar(String.self))),
          GraphQLField("price", type: .nonNull(.scalar(String.self))),
          GraphQLField("time", type: .nonNull(.scalar(String.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, uuid: String? = nil, category: String, description: String, price: String, time: String) {
          self.init(snapshot: ["__typename": "Expense", "id": id, "uuid": uuid, "category": category, "description": description, "price": price, "time": time])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var id: Int {
          get {
            return snapshot["id"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "id")
          }
        }

        public var uuid: String? {
          get {
            return snapshot["uuid"] as? String
          }
          set {
            snapshot.updateValue(newValue, forKey: "uuid")
          }
        }

        public var category: String {
          get {
            return snapshot["category"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "category")
          }
        }

        public var description: String {
          get {
            return snapshot["description"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "description")
          }
        }

        public var price: String {
          get {
            return snapshot["price"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "price")
          }
        }

        public var time: String {
          get {
            return snapshot["time"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "time")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var expenseFragment: ExpenseFragment {
            get {
              return ExpenseFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }
    }
  }
}

public final class FullUserQuery: GraphQLQuery {
  public static let operationString =
    "query FullUser($id: Int) {\n  user(id: $id) {\n    __typename\n    ...FullUserFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(FullUserFragment.fragmentString).appending(UserFragment.fragmentString).appending(SettingsFragment.fragmentString).appending(MetaConventionFragment.fragmentString).appending(ConventionBasicInfoFragment.fragmentString).appending(ConventionImageFragment.fragmentString).appending(ExtraInfoFragment.fragmentString).appending(UserInfoFragment.fragmentString).appending(VotesFragment.fragmentString).appending(ProductFragment.fragmentString).appending(ProductTypeFragment.fragmentString).appending(PriceFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(user: User) {
      self.init(snapshot: ["__typename": "Query", "user": user.snapshot])
    }

    /// Retrieves one user, corresponding to the provided ID
    public var user: User {
      get {
        return User(snapshot: snapshot["user"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "user")
      }
    }

    public struct User: GraphQLSelectionSet {
      public static let possibleTypes = ["User"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("name", type: .nonNull(.scalar(String.self))),
        GraphQLField("email", type: .nonNull(.scalar(String.self))),
        GraphQLField("settings", type: .nonNull(.object(Setting.selections))),
        GraphQLField("conventions", type: .nonNull(.list(.nonNull(.object(Convention.selections))))),
        GraphQLField("clearance", type: .nonNull(.scalar(Int.self))),
        GraphQLField("products", type: .nonNull(.list(.nonNull(.object(Product.selections))))),
        GraphQLField("productTypes", type: .nonNull(.list(.nonNull(.object(ProductType.selections))))),
        GraphQLField("prices", type: .nonNull(.list(.nonNull(.object(Price.selections))))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(name: String, email: String, settings: Setting, conventions: [Convention], clearance: Int, products: [Product], productTypes: [ProductType], prices: [Price]) {
        self.init(snapshot: ["__typename": "User", "name": name, "email": email, "settings": settings.snapshot, "conventions": conventions.map { $0.snapshot }, "clearance": clearance, "products": products.map { $0.snapshot }, "productTypes": productTypes.map { $0.snapshot }, "prices": prices.map { $0.snapshot }])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var name: String {
        get {
          return snapshot["name"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "name")
        }
      }

      public var email: String {
        get {
          return snapshot["email"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "email")
        }
      }

      public var settings: Setting {
        get {
          return Setting(snapshot: snapshot["settings"]! as! Snapshot)
        }
        set {
          snapshot.updateValue(newValue.snapshot, forKey: "settings")
        }
      }

      public var conventions: [Convention] {
        get {
          return (snapshot["conventions"] as! [Snapshot]).map { Convention(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "conventions")
        }
      }

      public var clearance: Int {
        get {
          return snapshot["clearance"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "clearance")
        }
      }

      public var products: [Product] {
        get {
          return (snapshot["products"] as! [Snapshot]).map { Product(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "products")
        }
      }

      public var productTypes: [ProductType] {
        get {
          return (snapshot["productTypes"] as! [Snapshot]).map { ProductType(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "productTypes")
        }
      }

      public var prices: [Price] {
        get {
          return (snapshot["prices"] as! [Snapshot]).map { Price(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "prices")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var fullUserFragment: FullUserFragment {
          get {
            return FullUserFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public var userFragment: UserFragment {
          get {
            return UserFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }

      public struct Setting: GraphQLSelectionSet {
        public static let possibleTypes = ["Settings"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("currency", type: .nonNull(.scalar(String.self))),
          GraphQLField("language", type: .nonNull(.scalar(String.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(currency: String, language: String) {
          self.init(snapshot: ["__typename": "Settings", "currency": currency, "language": language])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var currency: String {
          get {
            return snapshot["currency"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "currency")
          }
        }

        public var language: String {
          get {
            return snapshot["language"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "language")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var settingsFragment: SettingsFragment {
            get {
              return SettingsFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }

      public struct Convention: GraphQLSelectionSet {
        public static let possibleTypes = ["Convention"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("name", type: .nonNull(.scalar(String.self))),
          GraphQLField("images", type: .nonNull(.list(.nonNull(.object(Image.selections))))),
          GraphQLField("start", type: .nonNull(.scalar(String.self))),
          GraphQLField("end", type: .nonNull(.scalar(String.self))),
          GraphQLField("extraInfo", type: .nonNull(.list(.nonNull(.object(ExtraInfo.selections))))),
          GraphQLField("userInfo", type: .nonNull(.list(.nonNull(.object(UserInfo.selections))))),
          GraphQLField("recordTotal", type: .scalar(String.self)),
          GraphQLField("expenseTotal", type: .scalar(String.self)),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, name: String, images: [Image], start: String, end: String, extraInfo: [ExtraInfo], userInfo: [UserInfo], recordTotal: String? = nil, expenseTotal: String? = nil) {
          self.init(snapshot: ["__typename": "Convention", "id": id, "name": name, "images": images.map { $0.snapshot }, "start": start, "end": end, "extraInfo": extraInfo.map { $0.snapshot }, "userInfo": userInfo.map { $0.snapshot }, "recordTotal": recordTotal, "expenseTotal": expenseTotal])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var id: Int {
          get {
            return snapshot["id"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "id")
          }
        }

        public var name: String {
          get {
            return snapshot["name"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "name")
          }
        }

        public var images: [Image] {
          get {
            return (snapshot["images"] as! [Snapshot]).map { Image(snapshot: $0) }
          }
          set {
            snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "images")
          }
        }

        public var start: String {
          get {
            return snapshot["start"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "start")
          }
        }

        public var end: String {
          get {
            return snapshot["end"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "end")
          }
        }

        public var extraInfo: [ExtraInfo] {
          get {
            return (snapshot["extraInfo"] as! [Snapshot]).map { ExtraInfo(snapshot: $0) }
          }
          set {
            snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "extraInfo")
          }
        }

        public var userInfo: [UserInfo] {
          get {
            return (snapshot["userInfo"] as! [Snapshot]).map { UserInfo(snapshot: $0) }
          }
          set {
            snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "userInfo")
          }
        }

        public var recordTotal: String? {
          get {
            return snapshot["recordTotal"] as? String
          }
          set {
            snapshot.updateValue(newValue, forKey: "recordTotal")
          }
        }

        public var expenseTotal: String? {
          get {
            return snapshot["expenseTotal"] as? String
          }
          set {
            snapshot.updateValue(newValue, forKey: "expenseTotal")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var metaConventionFragment: MetaConventionFragment {
            get {
              return MetaConventionFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }

          public var conventionBasicInfoFragment: ConventionBasicInfoFragment {
            get {
              return ConventionBasicInfoFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }

        public struct Image: GraphQLSelectionSet {
          public static let possibleTypes = ["ConventionImage"]

          public static let selections: [GraphQLSelection] = [
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("id", type: .nonNull(.scalar(String.self))),
          ]

          public var snapshot: Snapshot

          public init(snapshot: Snapshot) {
            self.snapshot = snapshot
          }

          public init(id: String) {
            self.init(snapshot: ["__typename": "ConventionImage", "id": id])
          }

          public var __typename: String {
            get {
              return snapshot["__typename"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "__typename")
            }
          }

          public var id: String {
            get {
              return snapshot["id"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "id")
            }
          }

          public var fragments: Fragments {
            get {
              return Fragments(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }

          public struct Fragments {
            public var snapshot: Snapshot

            public var conventionImageFragment: ConventionImageFragment {
              get {
                return ConventionImageFragment(snapshot: snapshot)
              }
              set {
                snapshot += newValue.snapshot
              }
            }
          }
        }

        public struct ExtraInfo: GraphQLSelectionSet {
          public static let possibleTypes = ["ConventionExtraInfo"]

          public static let selections: [GraphQLSelection] = [
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("title", type: .nonNull(.scalar(String.self))),
            GraphQLField("info", type: .scalar(String.self)),
            GraphQLField("action", type: .scalar(String.self)),
            GraphQLField("actionText", type: .scalar(String.self)),
          ]

          public var snapshot: Snapshot

          public init(snapshot: Snapshot) {
            self.snapshot = snapshot
          }

          public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
            self.init(snapshot: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
          }

          public var __typename: String {
            get {
              return snapshot["__typename"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "__typename")
            }
          }

          public var title: String {
            get {
              return snapshot["title"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "title")
            }
          }

          public var info: String? {
            get {
              return snapshot["info"] as? String
            }
            set {
              snapshot.updateValue(newValue, forKey: "info")
            }
          }

          public var action: String? {
            get {
              return snapshot["action"] as? String
            }
            set {
              snapshot.updateValue(newValue, forKey: "action")
            }
          }

          public var actionText: String? {
            get {
              return snapshot["actionText"] as? String
            }
            set {
              snapshot.updateValue(newValue, forKey: "actionText")
            }
          }

          public var fragments: Fragments {
            get {
              return Fragments(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }

          public struct Fragments {
            public var snapshot: Snapshot

            public var extraInfoFragment: ExtraInfoFragment {
              get {
                return ExtraInfoFragment(snapshot: snapshot)
              }
              set {
                snapshot += newValue.snapshot
              }
            }
          }
        }

        public struct UserInfo: GraphQLSelectionSet {
          public static let possibleTypes = ["ConventionUserInfo"]

          public static let selections: [GraphQLSelection] = [
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("id", type: .nonNull(.scalar(Int.self))),
            GraphQLField("info", type: .nonNull(.scalar(String.self))),
            GraphQLField("vote", type: .nonNull(.scalar(Int.self))),
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
            GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
          ]

          public var snapshot: Snapshot

          public init(snapshot: Snapshot) {
            self.snapshot = snapshot
          }

          public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
            self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
          }

          public var __typename: String {
            get {
              return snapshot["__typename"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "__typename")
            }
          }

          public var id: Int {
            get {
              return snapshot["id"]! as! Int
            }
            set {
              snapshot.updateValue(newValue, forKey: "id")
            }
          }

          public var info: String {
            get {
              return snapshot["info"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "info")
            }
          }

          public var vote: Int {
            get {
              return snapshot["vote"]! as! Int
            }
            set {
              snapshot.updateValue(newValue, forKey: "vote")
            }
          }

          public var upvotes: Int {
            get {
              return snapshot["upvotes"]! as! Int
            }
            set {
              snapshot.updateValue(newValue, forKey: "upvotes")
            }
          }

          public var downvotes: Int {
            get {
              return snapshot["downvotes"]! as! Int
            }
            set {
              snapshot.updateValue(newValue, forKey: "downvotes")
            }
          }

          public var fragments: Fragments {
            get {
              return Fragments(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }

          public struct Fragments {
            public var snapshot: Snapshot

            public var userInfoFragment: UserInfoFragment {
              get {
                return UserInfoFragment(snapshot: snapshot)
              }
              set {
                snapshot += newValue.snapshot
              }
            }

            public var votesFragment: VotesFragment {
              get {
                return VotesFragment(snapshot: snapshot)
              }
              set {
                snapshot += newValue.snapshot
              }
            }
          }
        }
      }

      public struct Product: GraphQLSelectionSet {
        public static let possibleTypes = ["Product"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
          GraphQLField("name", type: .nonNull(.scalar(String.self))),
          GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
          GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
          GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool, sort: Int) {
          self.init(snapshot: ["__typename": "Product", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued, "sort": sort])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var id: Int {
          get {
            return snapshot["id"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "id")
          }
        }

        public var typeId: Int {
          get {
            return snapshot["typeId"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "typeId")
          }
        }

        public var name: String {
          get {
            return snapshot["name"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "name")
          }
        }

        public var quantity: Int {
          get {
            return snapshot["quantity"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "quantity")
          }
        }

        public var discontinued: Bool {
          get {
            return snapshot["discontinued"]! as! Bool
          }
          set {
            snapshot.updateValue(newValue, forKey: "discontinued")
          }
        }

        public var sort: Int {
          get {
            return snapshot["sort"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "sort")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var productFragment: ProductFragment {
            get {
              return ProductFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }

      public struct ProductType: GraphQLSelectionSet {
        public static let possibleTypes = ["ProductType"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("name", type: .nonNull(.scalar(String.self))),
          GraphQLField("color", type: .scalar(Int.self)),
          GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
          GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, name: String, color: Int? = nil, discontinued: Bool, sort: Int) {
          self.init(snapshot: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued, "sort": sort])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var id: Int {
          get {
            return snapshot["id"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "id")
          }
        }

        public var name: String {
          get {
            return snapshot["name"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "name")
          }
        }

        public var color: Int? {
          get {
            return snapshot["color"] as? Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "color")
          }
        }

        public var discontinued: Bool {
          get {
            return snapshot["discontinued"]! as! Bool
          }
          set {
            snapshot.updateValue(newValue, forKey: "discontinued")
          }
        }

        public var sort: Int {
          get {
            return snapshot["sort"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "sort")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var productTypeFragment: ProductTypeFragment {
            get {
              return ProductTypeFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }

      public struct Price: GraphQLSelectionSet {
        public static let possibleTypes = ["Price"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
          GraphQLField("productId", type: .scalar(Int.self)),
          GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
          GraphQLField("price", type: .nonNull(.scalar(String.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(typeId: Int, productId: Int? = nil, quantity: Int, price: String) {
          self.init(snapshot: ["__typename": "Price", "typeId": typeId, "productId": productId, "quantity": quantity, "price": price])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var typeId: Int {
          get {
            return snapshot["typeId"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "typeId")
          }
        }

        public var productId: Int? {
          get {
            return snapshot["productId"] as? Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "productId")
          }
        }

        public var quantity: Int {
          get {
            return snapshot["quantity"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "quantity")
          }
        }

        public var price: String {
          get {
            return snapshot["price"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "price")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var priceFragment: PriceFragment {
            get {
              return PriceFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }
    }
  }
}

public final class UserQuery: GraphQLQuery {
  public static let operationString =
    "query User($id: Int) {\n  user(id: $id) {\n    __typename\n    ...UserFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(UserFragment.fragmentString).appending(SettingsFragment.fragmentString).appending(MetaConventionFragment.fragmentString).appending(ConventionBasicInfoFragment.fragmentString).appending(ConventionImageFragment.fragmentString).appending(ExtraInfoFragment.fragmentString).appending(UserInfoFragment.fragmentString).appending(VotesFragment.fragmentString) }

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

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(user: User) {
      self.init(snapshot: ["__typename": "Query", "user": user.snapshot])
    }

    /// Retrieves one user, corresponding to the provided ID
    public var user: User {
      get {
        return User(snapshot: snapshot["user"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "user")
      }
    }

    public struct User: GraphQLSelectionSet {
      public static let possibleTypes = ["User"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("name", type: .nonNull(.scalar(String.self))),
        GraphQLField("email", type: .nonNull(.scalar(String.self))),
        GraphQLField("settings", type: .nonNull(.object(Setting.selections))),
        GraphQLField("conventions", type: .nonNull(.list(.nonNull(.object(Convention.selections))))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(name: String, email: String, settings: Setting, conventions: [Convention]) {
        self.init(snapshot: ["__typename": "User", "name": name, "email": email, "settings": settings.snapshot, "conventions": conventions.map { $0.snapshot }])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var name: String {
        get {
          return snapshot["name"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "name")
        }
      }

      public var email: String {
        get {
          return snapshot["email"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "email")
        }
      }

      public var settings: Setting {
        get {
          return Setting(snapshot: snapshot["settings"]! as! Snapshot)
        }
        set {
          snapshot.updateValue(newValue.snapshot, forKey: "settings")
        }
      }

      public var conventions: [Convention] {
        get {
          return (snapshot["conventions"] as! [Snapshot]).map { Convention(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "conventions")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var userFragment: UserFragment {
          get {
            return UserFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }

      public struct Setting: GraphQLSelectionSet {
        public static let possibleTypes = ["Settings"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("currency", type: .nonNull(.scalar(String.self))),
          GraphQLField("language", type: .nonNull(.scalar(String.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(currency: String, language: String) {
          self.init(snapshot: ["__typename": "Settings", "currency": currency, "language": language])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var currency: String {
          get {
            return snapshot["currency"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "currency")
          }
        }

        public var language: String {
          get {
            return snapshot["language"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "language")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var settingsFragment: SettingsFragment {
            get {
              return SettingsFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }
      }

      public struct Convention: GraphQLSelectionSet {
        public static let possibleTypes = ["Convention"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("name", type: .nonNull(.scalar(String.self))),
          GraphQLField("images", type: .nonNull(.list(.nonNull(.object(Image.selections))))),
          GraphQLField("start", type: .nonNull(.scalar(String.self))),
          GraphQLField("end", type: .nonNull(.scalar(String.self))),
          GraphQLField("extraInfo", type: .nonNull(.list(.nonNull(.object(ExtraInfo.selections))))),
          GraphQLField("userInfo", type: .nonNull(.list(.nonNull(.object(UserInfo.selections))))),
          GraphQLField("recordTotal", type: .scalar(String.self)),
          GraphQLField("expenseTotal", type: .scalar(String.self)),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, name: String, images: [Image], start: String, end: String, extraInfo: [ExtraInfo], userInfo: [UserInfo], recordTotal: String? = nil, expenseTotal: String? = nil) {
          self.init(snapshot: ["__typename": "Convention", "id": id, "name": name, "images": images.map { $0.snapshot }, "start": start, "end": end, "extraInfo": extraInfo.map { $0.snapshot }, "userInfo": userInfo.map { $0.snapshot }, "recordTotal": recordTotal, "expenseTotal": expenseTotal])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var id: Int {
          get {
            return snapshot["id"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "id")
          }
        }

        public var name: String {
          get {
            return snapshot["name"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "name")
          }
        }

        public var images: [Image] {
          get {
            return (snapshot["images"] as! [Snapshot]).map { Image(snapshot: $0) }
          }
          set {
            snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "images")
          }
        }

        public var start: String {
          get {
            return snapshot["start"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "start")
          }
        }

        public var end: String {
          get {
            return snapshot["end"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "end")
          }
        }

        public var extraInfo: [ExtraInfo] {
          get {
            return (snapshot["extraInfo"] as! [Snapshot]).map { ExtraInfo(snapshot: $0) }
          }
          set {
            snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "extraInfo")
          }
        }

        public var userInfo: [UserInfo] {
          get {
            return (snapshot["userInfo"] as! [Snapshot]).map { UserInfo(snapshot: $0) }
          }
          set {
            snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "userInfo")
          }
        }

        public var recordTotal: String? {
          get {
            return snapshot["recordTotal"] as? String
          }
          set {
            snapshot.updateValue(newValue, forKey: "recordTotal")
          }
        }

        public var expenseTotal: String? {
          get {
            return snapshot["expenseTotal"] as? String
          }
          set {
            snapshot.updateValue(newValue, forKey: "expenseTotal")
          }
        }

        public var fragments: Fragments {
          get {
            return Fragments(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public struct Fragments {
          public var snapshot: Snapshot

          public var metaConventionFragment: MetaConventionFragment {
            get {
              return MetaConventionFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }

          public var conventionBasicInfoFragment: ConventionBasicInfoFragment {
            get {
              return ConventionBasicInfoFragment(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }
        }

        public struct Image: GraphQLSelectionSet {
          public static let possibleTypes = ["ConventionImage"]

          public static let selections: [GraphQLSelection] = [
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("id", type: .nonNull(.scalar(String.self))),
          ]

          public var snapshot: Snapshot

          public init(snapshot: Snapshot) {
            self.snapshot = snapshot
          }

          public init(id: String) {
            self.init(snapshot: ["__typename": "ConventionImage", "id": id])
          }

          public var __typename: String {
            get {
              return snapshot["__typename"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "__typename")
            }
          }

          public var id: String {
            get {
              return snapshot["id"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "id")
            }
          }

          public var fragments: Fragments {
            get {
              return Fragments(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }

          public struct Fragments {
            public var snapshot: Snapshot

            public var conventionImageFragment: ConventionImageFragment {
              get {
                return ConventionImageFragment(snapshot: snapshot)
              }
              set {
                snapshot += newValue.snapshot
              }
            }
          }
        }

        public struct ExtraInfo: GraphQLSelectionSet {
          public static let possibleTypes = ["ConventionExtraInfo"]

          public static let selections: [GraphQLSelection] = [
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("title", type: .nonNull(.scalar(String.self))),
            GraphQLField("info", type: .scalar(String.self)),
            GraphQLField("action", type: .scalar(String.self)),
            GraphQLField("actionText", type: .scalar(String.self)),
          ]

          public var snapshot: Snapshot

          public init(snapshot: Snapshot) {
            self.snapshot = snapshot
          }

          public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
            self.init(snapshot: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
          }

          public var __typename: String {
            get {
              return snapshot["__typename"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "__typename")
            }
          }

          public var title: String {
            get {
              return snapshot["title"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "title")
            }
          }

          public var info: String? {
            get {
              return snapshot["info"] as? String
            }
            set {
              snapshot.updateValue(newValue, forKey: "info")
            }
          }

          public var action: String? {
            get {
              return snapshot["action"] as? String
            }
            set {
              snapshot.updateValue(newValue, forKey: "action")
            }
          }

          public var actionText: String? {
            get {
              return snapshot["actionText"] as? String
            }
            set {
              snapshot.updateValue(newValue, forKey: "actionText")
            }
          }

          public var fragments: Fragments {
            get {
              return Fragments(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }

          public struct Fragments {
            public var snapshot: Snapshot

            public var extraInfoFragment: ExtraInfoFragment {
              get {
                return ExtraInfoFragment(snapshot: snapshot)
              }
              set {
                snapshot += newValue.snapshot
              }
            }
          }
        }

        public struct UserInfo: GraphQLSelectionSet {
          public static let possibleTypes = ["ConventionUserInfo"]

          public static let selections: [GraphQLSelection] = [
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("id", type: .nonNull(.scalar(Int.self))),
            GraphQLField("info", type: .nonNull(.scalar(String.self))),
            GraphQLField("vote", type: .nonNull(.scalar(Int.self))),
            GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
            GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
            GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
          ]

          public var snapshot: Snapshot

          public init(snapshot: Snapshot) {
            self.snapshot = snapshot
          }

          public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
            self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
          }

          public var __typename: String {
            get {
              return snapshot["__typename"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "__typename")
            }
          }

          public var id: Int {
            get {
              return snapshot["id"]! as! Int
            }
            set {
              snapshot.updateValue(newValue, forKey: "id")
            }
          }

          public var info: String {
            get {
              return snapshot["info"]! as! String
            }
            set {
              snapshot.updateValue(newValue, forKey: "info")
            }
          }

          public var vote: Int {
            get {
              return snapshot["vote"]! as! Int
            }
            set {
              snapshot.updateValue(newValue, forKey: "vote")
            }
          }

          public var upvotes: Int {
            get {
              return snapshot["upvotes"]! as! Int
            }
            set {
              snapshot.updateValue(newValue, forKey: "upvotes")
            }
          }

          public var downvotes: Int {
            get {
              return snapshot["downvotes"]! as! Int
            }
            set {
              snapshot.updateValue(newValue, forKey: "downvotes")
            }
          }

          public var fragments: Fragments {
            get {
              return Fragments(snapshot: snapshot)
            }
            set {
              snapshot += newValue.snapshot
            }
          }

          public struct Fragments {
            public var snapshot: Snapshot

            public var userInfoFragment: UserInfoFragment {
              get {
                return UserInfoFragment(snapshot: snapshot)
              }
              set {
                snapshot += newValue.snapshot
              }
            }

            public var votesFragment: VotesFragment {
              get {
                return VotesFragment(snapshot: snapshot)
              }
              set {
                snapshot += newValue.snapshot
              }
            }
          }
        }
      }
    }
  }
}

public struct ConventionBasicInfoFragment: GraphQLFragment {
  public static let fragmentString =
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

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: Int, name: String, images: [Image], start: String, end: String, extraInfo: [ExtraInfo], userInfo: [UserInfo]) {
    self.init(snapshot: ["__typename": "Convention", "id": id, "name": name, "images": images.map { $0.snapshot }, "start": start, "end": end, "extraInfo": extraInfo.map { $0.snapshot }, "userInfo": userInfo.map { $0.snapshot }])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return snapshot["id"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "id")
    }
  }

  public var name: String {
    get {
      return snapshot["name"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "name")
    }
  }

  public var images: [Image] {
    get {
      return (snapshot["images"] as! [Snapshot]).map { Image(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "images")
    }
  }

  public var start: String {
    get {
      return snapshot["start"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "start")
    }
  }

  public var end: String {
    get {
      return snapshot["end"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "end")
    }
  }

  public var extraInfo: [ExtraInfo] {
    get {
      return (snapshot["extraInfo"] as! [Snapshot]).map { ExtraInfo(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "extraInfo")
    }
  }

  public var userInfo: [UserInfo] {
    get {
      return (snapshot["userInfo"] as! [Snapshot]).map { UserInfo(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "userInfo")
    }
  }

  public struct Image: GraphQLSelectionSet {
    public static let possibleTypes = ["ConventionImage"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(String.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: String) {
      self.init(snapshot: ["__typename": "ConventionImage", "id": id])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: String {
      get {
        return snapshot["id"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var conventionImageFragment: ConventionImageFragment {
        get {
          return ConventionImageFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct ExtraInfo: GraphQLSelectionSet {
    public static let possibleTypes = ["ConventionExtraInfo"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("title", type: .nonNull(.scalar(String.self))),
      GraphQLField("info", type: .scalar(String.self)),
      GraphQLField("action", type: .scalar(String.self)),
      GraphQLField("actionText", type: .scalar(String.self)),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
      self.init(snapshot: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var title: String {
      get {
        return snapshot["title"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "title")
      }
    }

    public var info: String? {
      get {
        return snapshot["info"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "info")
      }
    }

    public var action: String? {
      get {
        return snapshot["action"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "action")
      }
    }

    public var actionText: String? {
      get {
        return snapshot["actionText"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "actionText")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var extraInfoFragment: ExtraInfoFragment {
        get {
          return ExtraInfoFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct UserInfo: GraphQLSelectionSet {
    public static let possibleTypes = ["ConventionUserInfo"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      GraphQLField("info", type: .nonNull(.scalar(String.self))),
      GraphQLField("vote", type: .nonNull(.scalar(Int.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
      GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
      self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: Int {
      get {
        return snapshot["id"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var info: String {
      get {
        return snapshot["info"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "info")
      }
    }

    public var vote: Int {
      get {
        return snapshot["vote"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "vote")
      }
    }

    public var upvotes: Int {
      get {
        return snapshot["upvotes"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "upvotes")
      }
    }

    public var downvotes: Int {
      get {
        return snapshot["downvotes"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "downvotes")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var userInfoFragment: UserInfoFragment {
        get {
          return UserInfoFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public var votesFragment: VotesFragment {
        get {
          return VotesFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }
}

public struct ConventionImageFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment ConventionImageFragment on ConventionImage {\n  __typename\n  id\n}"

  public static let possibleTypes = ["ConventionImage"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(String.self))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: String) {
    self.init(snapshot: ["__typename": "ConventionImage", "id": id])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: String {
    get {
      return snapshot["id"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "id")
    }
  }
}

public struct ExpenseFragment: GraphQLFragment {
  public static let fragmentString =
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

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: Int, uuid: String? = nil, category: String, description: String, price: String, time: String) {
    self.init(snapshot: ["__typename": "Expense", "id": id, "uuid": uuid, "category": category, "description": description, "price": price, "time": time])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return snapshot["id"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "id")
    }
  }

  public var uuid: String? {
    get {
      return snapshot["uuid"] as? String
    }
    set {
      snapshot.updateValue(newValue, forKey: "uuid")
    }
  }

  public var category: String {
    get {
      return snapshot["category"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "category")
    }
  }

  public var description: String {
    get {
      return snapshot["description"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "description")
    }
  }

  public var price: String {
    get {
      return snapshot["price"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "price")
    }
  }

  public var time: String {
    get {
      return snapshot["time"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "time")
    }
  }
}

public struct ExtraInfoFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment ExtraInfoFragment on ConventionExtraInfo {\n  __typename\n  title\n  info\n  action\n  actionText\n}"

  public static let possibleTypes = ["ConventionExtraInfo"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("title", type: .nonNull(.scalar(String.self))),
    GraphQLField("info", type: .scalar(String.self)),
    GraphQLField("action", type: .scalar(String.self)),
    GraphQLField("actionText", type: .scalar(String.self)),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
    self.init(snapshot: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var title: String {
    get {
      return snapshot["title"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "title")
    }
  }

  public var info: String? {
    get {
      return snapshot["info"] as? String
    }
    set {
      snapshot.updateValue(newValue, forKey: "info")
    }
  }

  public var action: String? {
    get {
      return snapshot["action"] as? String
    }
    set {
      snapshot.updateValue(newValue, forKey: "action")
    }
  }

  public var actionText: String? {
    get {
      return snapshot["actionText"] as? String
    }
    set {
      snapshot.updateValue(newValue, forKey: "actionText")
    }
  }
}

public struct FullConventionFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment FullConventionFragment on Convention {\n  __typename\n  ...MetaConventionFragment\n  products {\n    __typename\n    ...ProductFragment\n  }\n  productTypes {\n    __typename\n    ...ProductTypeFragment\n  }\n  prices {\n    __typename\n    ...PriceFragment\n  }\n  records {\n    __typename\n    ...RecordFragment\n  }\n  expenses {\n    __typename\n    ...ExpenseFragment\n  }\n}"

  public static let possibleTypes = ["Convention"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("name", type: .nonNull(.scalar(String.self))),
    GraphQLField("images", type: .nonNull(.list(.nonNull(.object(Image.selections))))),
    GraphQLField("start", type: .nonNull(.scalar(String.self))),
    GraphQLField("end", type: .nonNull(.scalar(String.self))),
    GraphQLField("extraInfo", type: .nonNull(.list(.nonNull(.object(ExtraInfo.selections))))),
    GraphQLField("userInfo", type: .nonNull(.list(.nonNull(.object(UserInfo.selections))))),
    GraphQLField("recordTotal", type: .scalar(String.self)),
    GraphQLField("expenseTotal", type: .scalar(String.self)),
    GraphQLField("products", type: .nonNull(.list(.nonNull(.object(Product.selections))))),
    GraphQLField("productTypes", type: .nonNull(.list(.nonNull(.object(ProductType.selections))))),
    GraphQLField("prices", type: .nonNull(.list(.nonNull(.object(Price.selections))))),
    GraphQLField("records", type: .nonNull(.list(.nonNull(.object(Record.selections))))),
    GraphQLField("expenses", type: .nonNull(.list(.nonNull(.object(Expense.selections))))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: Int, name: String, images: [Image], start: String, end: String, extraInfo: [ExtraInfo], userInfo: [UserInfo], recordTotal: String? = nil, expenseTotal: String? = nil, products: [Product], productTypes: [ProductType], prices: [Price], records: [Record], expenses: [Expense]) {
    self.init(snapshot: ["__typename": "Convention", "id": id, "name": name, "images": images.map { $0.snapshot }, "start": start, "end": end, "extraInfo": extraInfo.map { $0.snapshot }, "userInfo": userInfo.map { $0.snapshot }, "recordTotal": recordTotal, "expenseTotal": expenseTotal, "products": products.map { $0.snapshot }, "productTypes": productTypes.map { $0.snapshot }, "prices": prices.map { $0.snapshot }, "records": records.map { $0.snapshot }, "expenses": expenses.map { $0.snapshot }])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return snapshot["id"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "id")
    }
  }

  public var name: String {
    get {
      return snapshot["name"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "name")
    }
  }

  public var images: [Image] {
    get {
      return (snapshot["images"] as! [Snapshot]).map { Image(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "images")
    }
  }

  public var start: String {
    get {
      return snapshot["start"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "start")
    }
  }

  public var end: String {
    get {
      return snapshot["end"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "end")
    }
  }

  public var extraInfo: [ExtraInfo] {
    get {
      return (snapshot["extraInfo"] as! [Snapshot]).map { ExtraInfo(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "extraInfo")
    }
  }

  public var userInfo: [UserInfo] {
    get {
      return (snapshot["userInfo"] as! [Snapshot]).map { UserInfo(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "userInfo")
    }
  }

  public var recordTotal: String? {
    get {
      return snapshot["recordTotal"] as? String
    }
    set {
      snapshot.updateValue(newValue, forKey: "recordTotal")
    }
  }

  public var expenseTotal: String? {
    get {
      return snapshot["expenseTotal"] as? String
    }
    set {
      snapshot.updateValue(newValue, forKey: "expenseTotal")
    }
  }

  public var products: [Product] {
    get {
      return (snapshot["products"] as! [Snapshot]).map { Product(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "products")
    }
  }

  public var productTypes: [ProductType] {
    get {
      return (snapshot["productTypes"] as! [Snapshot]).map { ProductType(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "productTypes")
    }
  }

  public var prices: [Price] {
    get {
      return (snapshot["prices"] as! [Snapshot]).map { Price(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "prices")
    }
  }

  public var records: [Record] {
    get {
      return (snapshot["records"] as! [Snapshot]).map { Record(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "records")
    }
  }

  public var expenses: [Expense] {
    get {
      return (snapshot["expenses"] as! [Snapshot]).map { Expense(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "expenses")
    }
  }

  public var fragments: Fragments {
    get {
      return Fragments(snapshot: snapshot)
    }
    set {
      snapshot += newValue.snapshot
    }
  }

  public struct Fragments {
    public var snapshot: Snapshot

    public var metaConventionFragment: MetaConventionFragment {
      get {
        return MetaConventionFragment(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public var conventionBasicInfoFragment: ConventionBasicInfoFragment {
      get {
        return ConventionBasicInfoFragment(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }
  }

  public struct Image: GraphQLSelectionSet {
    public static let possibleTypes = ["ConventionImage"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(String.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: String) {
      self.init(snapshot: ["__typename": "ConventionImage", "id": id])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: String {
      get {
        return snapshot["id"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var conventionImageFragment: ConventionImageFragment {
        get {
          return ConventionImageFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct ExtraInfo: GraphQLSelectionSet {
    public static let possibleTypes = ["ConventionExtraInfo"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("title", type: .nonNull(.scalar(String.self))),
      GraphQLField("info", type: .scalar(String.self)),
      GraphQLField("action", type: .scalar(String.self)),
      GraphQLField("actionText", type: .scalar(String.self)),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
      self.init(snapshot: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var title: String {
      get {
        return snapshot["title"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "title")
      }
    }

    public var info: String? {
      get {
        return snapshot["info"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "info")
      }
    }

    public var action: String? {
      get {
        return snapshot["action"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "action")
      }
    }

    public var actionText: String? {
      get {
        return snapshot["actionText"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "actionText")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var extraInfoFragment: ExtraInfoFragment {
        get {
          return ExtraInfoFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct UserInfo: GraphQLSelectionSet {
    public static let possibleTypes = ["ConventionUserInfo"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      GraphQLField("info", type: .nonNull(.scalar(String.self))),
      GraphQLField("vote", type: .nonNull(.scalar(Int.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
      GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
      self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: Int {
      get {
        return snapshot["id"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var info: String {
      get {
        return snapshot["info"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "info")
      }
    }

    public var vote: Int {
      get {
        return snapshot["vote"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "vote")
      }
    }

    public var upvotes: Int {
      get {
        return snapshot["upvotes"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "upvotes")
      }
    }

    public var downvotes: Int {
      get {
        return snapshot["downvotes"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "downvotes")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var userInfoFragment: UserInfoFragment {
        get {
          return UserInfoFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public var votesFragment: VotesFragment {
        get {
          return VotesFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct Product: GraphQLSelectionSet {
    public static let possibleTypes = ["Product"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
      GraphQLField("name", type: .nonNull(.scalar(String.self))),
      GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
      GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
      GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool, sort: Int) {
      self.init(snapshot: ["__typename": "Product", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued, "sort": sort])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: Int {
      get {
        return snapshot["id"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var typeId: Int {
      get {
        return snapshot["typeId"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "typeId")
      }
    }

    public var name: String {
      get {
        return snapshot["name"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "name")
      }
    }

    public var quantity: Int {
      get {
        return snapshot["quantity"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "quantity")
      }
    }

    public var discontinued: Bool {
      get {
        return snapshot["discontinued"]! as! Bool
      }
      set {
        snapshot.updateValue(newValue, forKey: "discontinued")
      }
    }

    public var sort: Int {
      get {
        return snapshot["sort"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "sort")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var productFragment: ProductFragment {
        get {
          return ProductFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct ProductType: GraphQLSelectionSet {
    public static let possibleTypes = ["ProductType"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      GraphQLField("name", type: .nonNull(.scalar(String.self))),
      GraphQLField("color", type: .scalar(Int.self)),
      GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
      GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, name: String, color: Int? = nil, discontinued: Bool, sort: Int) {
      self.init(snapshot: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued, "sort": sort])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: Int {
      get {
        return snapshot["id"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var name: String {
      get {
        return snapshot["name"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "name")
      }
    }

    public var color: Int? {
      get {
        return snapshot["color"] as? Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "color")
      }
    }

    public var discontinued: Bool {
      get {
        return snapshot["discontinued"]! as! Bool
      }
      set {
        snapshot.updateValue(newValue, forKey: "discontinued")
      }
    }

    public var sort: Int {
      get {
        return snapshot["sort"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "sort")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var productTypeFragment: ProductTypeFragment {
        get {
          return ProductTypeFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct Price: GraphQLSelectionSet {
    public static let possibleTypes = ["Price"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
      GraphQLField("productId", type: .scalar(Int.self)),
      GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
      GraphQLField("price", type: .nonNull(.scalar(String.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(typeId: Int, productId: Int? = nil, quantity: Int, price: String) {
      self.init(snapshot: ["__typename": "Price", "typeId": typeId, "productId": productId, "quantity": quantity, "price": price])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var typeId: Int {
      get {
        return snapshot["typeId"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "typeId")
      }
    }

    public var productId: Int? {
      get {
        return snapshot["productId"] as? Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "productId")
      }
    }

    public var quantity: Int {
      get {
        return snapshot["quantity"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "quantity")
      }
    }

    public var price: String {
      get {
        return snapshot["price"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "price")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var priceFragment: PriceFragment {
        get {
          return PriceFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct Record: GraphQLSelectionSet {
    public static let possibleTypes = ["Record"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      GraphQLField("uuid", type: .scalar(String.self)),
      GraphQLField("products", type: .nonNull(.list(.nonNull(.scalar(Int.self))))),
      GraphQLField("price", type: .nonNull(.scalar(String.self))),
      GraphQLField("time", type: .nonNull(.scalar(String.self))),
      GraphQLField("info", type: .nonNull(.scalar(String.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, uuid: String? = nil, products: [Int], price: String, time: String, info: String) {
      self.init(snapshot: ["__typename": "Record", "id": id, "uuid": uuid, "products": products, "price": price, "time": time, "info": info])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: Int {
      get {
        return snapshot["id"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var uuid: String? {
      get {
        return snapshot["uuid"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "uuid")
      }
    }

    public var products: [Int] {
      get {
        return snapshot["products"]! as! [Int]
      }
      set {
        snapshot.updateValue(newValue, forKey: "products")
      }
    }

    public var price: String {
      get {
        return snapshot["price"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "price")
      }
    }

    public var time: String {
      get {
        return snapshot["time"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "time")
      }
    }

    public var info: String {
      get {
        return snapshot["info"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "info")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var recordFragment: RecordFragment {
        get {
          return RecordFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct Expense: GraphQLSelectionSet {
    public static let possibleTypes = ["Expense"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      GraphQLField("uuid", type: .scalar(String.self)),
      GraphQLField("category", type: .nonNull(.scalar(String.self))),
      GraphQLField("description", type: .nonNull(.scalar(String.self))),
      GraphQLField("price", type: .nonNull(.scalar(String.self))),
      GraphQLField("time", type: .nonNull(.scalar(String.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, uuid: String? = nil, category: String, description: String, price: String, time: String) {
      self.init(snapshot: ["__typename": "Expense", "id": id, "uuid": uuid, "category": category, "description": description, "price": price, "time": time])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: Int {
      get {
        return snapshot["id"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var uuid: String? {
      get {
        return snapshot["uuid"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "uuid")
      }
    }

    public var category: String {
      get {
        return snapshot["category"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "category")
      }
    }

    public var description: String {
      get {
        return snapshot["description"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "description")
      }
    }

    public var price: String {
      get {
        return snapshot["price"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "price")
      }
    }

    public var time: String {
      get {
        return snapshot["time"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "time")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var expenseFragment: ExpenseFragment {
        get {
          return ExpenseFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }
}

public struct FullUserFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment FullUserFragment on User {\n  __typename\n  ...UserFragment\n  clearance\n  products {\n    __typename\n    ...ProductFragment\n  }\n  productTypes {\n    __typename\n    ...ProductTypeFragment\n  }\n  prices {\n    __typename\n    ...PriceFragment\n  }\n}"

  public static let possibleTypes = ["User"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("name", type: .nonNull(.scalar(String.self))),
    GraphQLField("email", type: .nonNull(.scalar(String.self))),
    GraphQLField("settings", type: .nonNull(.object(Setting.selections))),
    GraphQLField("conventions", type: .nonNull(.list(.nonNull(.object(Convention.selections))))),
    GraphQLField("clearance", type: .nonNull(.scalar(Int.self))),
    GraphQLField("products", type: .nonNull(.list(.nonNull(.object(Product.selections))))),
    GraphQLField("productTypes", type: .nonNull(.list(.nonNull(.object(ProductType.selections))))),
    GraphQLField("prices", type: .nonNull(.list(.nonNull(.object(Price.selections))))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(name: String, email: String, settings: Setting, conventions: [Convention], clearance: Int, products: [Product], productTypes: [ProductType], prices: [Price]) {
    self.init(snapshot: ["__typename": "User", "name": name, "email": email, "settings": settings.snapshot, "conventions": conventions.map { $0.snapshot }, "clearance": clearance, "products": products.map { $0.snapshot }, "productTypes": productTypes.map { $0.snapshot }, "prices": prices.map { $0.snapshot }])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var name: String {
    get {
      return snapshot["name"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "name")
    }
  }

  public var email: String {
    get {
      return snapshot["email"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "email")
    }
  }

  public var settings: Setting {
    get {
      return Setting(snapshot: snapshot["settings"]! as! Snapshot)
    }
    set {
      snapshot.updateValue(newValue.snapshot, forKey: "settings")
    }
  }

  public var conventions: [Convention] {
    get {
      return (snapshot["conventions"] as! [Snapshot]).map { Convention(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "conventions")
    }
  }

  public var clearance: Int {
    get {
      return snapshot["clearance"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "clearance")
    }
  }

  public var products: [Product] {
    get {
      return (snapshot["products"] as! [Snapshot]).map { Product(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "products")
    }
  }

  public var productTypes: [ProductType] {
    get {
      return (snapshot["productTypes"] as! [Snapshot]).map { ProductType(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "productTypes")
    }
  }

  public var prices: [Price] {
    get {
      return (snapshot["prices"] as! [Snapshot]).map { Price(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "prices")
    }
  }

  public var fragments: Fragments {
    get {
      return Fragments(snapshot: snapshot)
    }
    set {
      snapshot += newValue.snapshot
    }
  }

  public struct Fragments {
    public var snapshot: Snapshot

    public var userFragment: UserFragment {
      get {
        return UserFragment(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }
  }

  public struct Setting: GraphQLSelectionSet {
    public static let possibleTypes = ["Settings"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("currency", type: .nonNull(.scalar(String.self))),
      GraphQLField("language", type: .nonNull(.scalar(String.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(currency: String, language: String) {
      self.init(snapshot: ["__typename": "Settings", "currency": currency, "language": language])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var currency: String {
      get {
        return snapshot["currency"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "currency")
      }
    }

    public var language: String {
      get {
        return snapshot["language"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "language")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var settingsFragment: SettingsFragment {
        get {
          return SettingsFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct Convention: GraphQLSelectionSet {
    public static let possibleTypes = ["Convention"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      GraphQLField("name", type: .nonNull(.scalar(String.self))),
      GraphQLField("images", type: .nonNull(.list(.nonNull(.object(Image.selections))))),
      GraphQLField("start", type: .nonNull(.scalar(String.self))),
      GraphQLField("end", type: .nonNull(.scalar(String.self))),
      GraphQLField("extraInfo", type: .nonNull(.list(.nonNull(.object(ExtraInfo.selections))))),
      GraphQLField("userInfo", type: .nonNull(.list(.nonNull(.object(UserInfo.selections))))),
      GraphQLField("recordTotal", type: .scalar(String.self)),
      GraphQLField("expenseTotal", type: .scalar(String.self)),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, name: String, images: [Image], start: String, end: String, extraInfo: [ExtraInfo], userInfo: [UserInfo], recordTotal: String? = nil, expenseTotal: String? = nil) {
      self.init(snapshot: ["__typename": "Convention", "id": id, "name": name, "images": images.map { $0.snapshot }, "start": start, "end": end, "extraInfo": extraInfo.map { $0.snapshot }, "userInfo": userInfo.map { $0.snapshot }, "recordTotal": recordTotal, "expenseTotal": expenseTotal])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: Int {
      get {
        return snapshot["id"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var name: String {
      get {
        return snapshot["name"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "name")
      }
    }

    public var images: [Image] {
      get {
        return (snapshot["images"] as! [Snapshot]).map { Image(snapshot: $0) }
      }
      set {
        snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "images")
      }
    }

    public var start: String {
      get {
        return snapshot["start"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "start")
      }
    }

    public var end: String {
      get {
        return snapshot["end"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "end")
      }
    }

    public var extraInfo: [ExtraInfo] {
      get {
        return (snapshot["extraInfo"] as! [Snapshot]).map { ExtraInfo(snapshot: $0) }
      }
      set {
        snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "extraInfo")
      }
    }

    public var userInfo: [UserInfo] {
      get {
        return (snapshot["userInfo"] as! [Snapshot]).map { UserInfo(snapshot: $0) }
      }
      set {
        snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "userInfo")
      }
    }

    public var recordTotal: String? {
      get {
        return snapshot["recordTotal"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "recordTotal")
      }
    }

    public var expenseTotal: String? {
      get {
        return snapshot["expenseTotal"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "expenseTotal")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var metaConventionFragment: MetaConventionFragment {
        get {
          return MetaConventionFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public var conventionBasicInfoFragment: ConventionBasicInfoFragment {
        get {
          return ConventionBasicInfoFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }

    public struct Image: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionImage"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(String.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: String) {
        self.init(snapshot: ["__typename": "ConventionImage", "id": id])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: String {
        get {
          return snapshot["id"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var conventionImageFragment: ConventionImageFragment {
          get {
            return ConventionImageFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }

    public struct ExtraInfo: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionExtraInfo"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("title", type: .nonNull(.scalar(String.self))),
        GraphQLField("info", type: .scalar(String.self)),
        GraphQLField("action", type: .scalar(String.self)),
        GraphQLField("actionText", type: .scalar(String.self)),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
        self.init(snapshot: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var title: String {
        get {
          return snapshot["title"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "title")
        }
      }

      public var info: String? {
        get {
          return snapshot["info"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "info")
        }
      }

      public var action: String? {
        get {
          return snapshot["action"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "action")
        }
      }

      public var actionText: String? {
        get {
          return snapshot["actionText"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "actionText")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var extraInfoFragment: ExtraInfoFragment {
          get {
            return ExtraInfoFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }

    public struct UserInfo: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionUserInfo"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("info", type: .nonNull(.scalar(String.self))),
        GraphQLField("vote", type: .nonNull(.scalar(Int.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
        GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
        self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var info: String {
        get {
          return snapshot["info"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "info")
        }
      }

      public var vote: Int {
        get {
          return snapshot["vote"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "vote")
        }
      }

      public var upvotes: Int {
        get {
          return snapshot["upvotes"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "upvotes")
        }
      }

      public var downvotes: Int {
        get {
          return snapshot["downvotes"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "downvotes")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var userInfoFragment: UserInfoFragment {
          get {
            return UserInfoFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public var votesFragment: VotesFragment {
          get {
            return VotesFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }

  public struct Product: GraphQLSelectionSet {
    public static let possibleTypes = ["Product"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
      GraphQLField("name", type: .nonNull(.scalar(String.self))),
      GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
      GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
      GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool, sort: Int) {
      self.init(snapshot: ["__typename": "Product", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued, "sort": sort])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: Int {
      get {
        return snapshot["id"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var typeId: Int {
      get {
        return snapshot["typeId"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "typeId")
      }
    }

    public var name: String {
      get {
        return snapshot["name"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "name")
      }
    }

    public var quantity: Int {
      get {
        return snapshot["quantity"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "quantity")
      }
    }

    public var discontinued: Bool {
      get {
        return snapshot["discontinued"]! as! Bool
      }
      set {
        snapshot.updateValue(newValue, forKey: "discontinued")
      }
    }

    public var sort: Int {
      get {
        return snapshot["sort"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "sort")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var productFragment: ProductFragment {
        get {
          return ProductFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct ProductType: GraphQLSelectionSet {
    public static let possibleTypes = ["ProductType"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      GraphQLField("name", type: .nonNull(.scalar(String.self))),
      GraphQLField("color", type: .scalar(Int.self)),
      GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
      GraphQLField("sort", type: .nonNull(.scalar(Int.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, name: String, color: Int? = nil, discontinued: Bool, sort: Int) {
      self.init(snapshot: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued, "sort": sort])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: Int {
      get {
        return snapshot["id"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var name: String {
      get {
        return snapshot["name"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "name")
      }
    }

    public var color: Int? {
      get {
        return snapshot["color"] as? Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "color")
      }
    }

    public var discontinued: Bool {
      get {
        return snapshot["discontinued"]! as! Bool
      }
      set {
        snapshot.updateValue(newValue, forKey: "discontinued")
      }
    }

    public var sort: Int {
      get {
        return snapshot["sort"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "sort")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var productTypeFragment: ProductTypeFragment {
        get {
          return ProductTypeFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct Price: GraphQLSelectionSet {
    public static let possibleTypes = ["Price"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
      GraphQLField("productId", type: .scalar(Int.self)),
      GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
      GraphQLField("price", type: .nonNull(.scalar(String.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(typeId: Int, productId: Int? = nil, quantity: Int, price: String) {
      self.init(snapshot: ["__typename": "Price", "typeId": typeId, "productId": productId, "quantity": quantity, "price": price])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var typeId: Int {
      get {
        return snapshot["typeId"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "typeId")
      }
    }

    public var productId: Int? {
      get {
        return snapshot["productId"] as? Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "productId")
      }
    }

    public var quantity: Int {
      get {
        return snapshot["quantity"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "quantity")
      }
    }

    public var price: String {
      get {
        return snapshot["price"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "price")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var priceFragment: PriceFragment {
        get {
          return PriceFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }
}

public struct MetaConventionFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment MetaConventionFragment on Convention {\n  __typename\n  ...ConventionBasicInfoFragment\n  recordTotal\n  expenseTotal\n}"

  public static let possibleTypes = ["Convention"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("name", type: .nonNull(.scalar(String.self))),
    GraphQLField("images", type: .nonNull(.list(.nonNull(.object(Image.selections))))),
    GraphQLField("start", type: .nonNull(.scalar(String.self))),
    GraphQLField("end", type: .nonNull(.scalar(String.self))),
    GraphQLField("extraInfo", type: .nonNull(.list(.nonNull(.object(ExtraInfo.selections))))),
    GraphQLField("userInfo", type: .nonNull(.list(.nonNull(.object(UserInfo.selections))))),
    GraphQLField("recordTotal", type: .scalar(String.self)),
    GraphQLField("expenseTotal", type: .scalar(String.self)),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: Int, name: String, images: [Image], start: String, end: String, extraInfo: [ExtraInfo], userInfo: [UserInfo], recordTotal: String? = nil, expenseTotal: String? = nil) {
    self.init(snapshot: ["__typename": "Convention", "id": id, "name": name, "images": images.map { $0.snapshot }, "start": start, "end": end, "extraInfo": extraInfo.map { $0.snapshot }, "userInfo": userInfo.map { $0.snapshot }, "recordTotal": recordTotal, "expenseTotal": expenseTotal])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return snapshot["id"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "id")
    }
  }

  public var name: String {
    get {
      return snapshot["name"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "name")
    }
  }

  public var images: [Image] {
    get {
      return (snapshot["images"] as! [Snapshot]).map { Image(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "images")
    }
  }

  public var start: String {
    get {
      return snapshot["start"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "start")
    }
  }

  public var end: String {
    get {
      return snapshot["end"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "end")
    }
  }

  public var extraInfo: [ExtraInfo] {
    get {
      return (snapshot["extraInfo"] as! [Snapshot]).map { ExtraInfo(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "extraInfo")
    }
  }

  public var userInfo: [UserInfo] {
    get {
      return (snapshot["userInfo"] as! [Snapshot]).map { UserInfo(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "userInfo")
    }
  }

  public var recordTotal: String? {
    get {
      return snapshot["recordTotal"] as? String
    }
    set {
      snapshot.updateValue(newValue, forKey: "recordTotal")
    }
  }

  public var expenseTotal: String? {
    get {
      return snapshot["expenseTotal"] as? String
    }
    set {
      snapshot.updateValue(newValue, forKey: "expenseTotal")
    }
  }

  public var fragments: Fragments {
    get {
      return Fragments(snapshot: snapshot)
    }
    set {
      snapshot += newValue.snapshot
    }
  }

  public struct Fragments {
    public var snapshot: Snapshot

    public var conventionBasicInfoFragment: ConventionBasicInfoFragment {
      get {
        return ConventionBasicInfoFragment(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }
  }

  public struct Image: GraphQLSelectionSet {
    public static let possibleTypes = ["ConventionImage"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(String.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: String) {
      self.init(snapshot: ["__typename": "ConventionImage", "id": id])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: String {
      get {
        return snapshot["id"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var conventionImageFragment: ConventionImageFragment {
        get {
          return ConventionImageFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct ExtraInfo: GraphQLSelectionSet {
    public static let possibleTypes = ["ConventionExtraInfo"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("title", type: .nonNull(.scalar(String.self))),
      GraphQLField("info", type: .scalar(String.self)),
      GraphQLField("action", type: .scalar(String.self)),
      GraphQLField("actionText", type: .scalar(String.self)),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
      self.init(snapshot: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var title: String {
      get {
        return snapshot["title"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "title")
      }
    }

    public var info: String? {
      get {
        return snapshot["info"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "info")
      }
    }

    public var action: String? {
      get {
        return snapshot["action"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "action")
      }
    }

    public var actionText: String? {
      get {
        return snapshot["actionText"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "actionText")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var extraInfoFragment: ExtraInfoFragment {
        get {
          return ExtraInfoFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct UserInfo: GraphQLSelectionSet {
    public static let possibleTypes = ["ConventionUserInfo"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      GraphQLField("info", type: .nonNull(.scalar(String.self))),
      GraphQLField("vote", type: .nonNull(.scalar(Int.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
      GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
      self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: Int {
      get {
        return snapshot["id"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var info: String {
      get {
        return snapshot["info"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "info")
      }
    }

    public var vote: Int {
      get {
        return snapshot["vote"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "vote")
      }
    }

    public var upvotes: Int {
      get {
        return snapshot["upvotes"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "upvotes")
      }
    }

    public var downvotes: Int {
      get {
        return snapshot["downvotes"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "downvotes")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var userInfoFragment: UserInfoFragment {
        get {
          return UserInfoFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public var votesFragment: VotesFragment {
        get {
          return VotesFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }
}

public struct PriceFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment PriceFragment on Price {\n  __typename\n  typeId\n  productId\n  quantity\n  price\n}"

  public static let possibleTypes = ["Price"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
    GraphQLField("productId", type: .scalar(Int.self)),
    GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
    GraphQLField("price", type: .nonNull(.scalar(String.self))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(typeId: Int, productId: Int? = nil, quantity: Int, price: String) {
    self.init(snapshot: ["__typename": "Price", "typeId": typeId, "productId": productId, "quantity": quantity, "price": price])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var typeId: Int {
    get {
      return snapshot["typeId"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "typeId")
    }
  }

  public var productId: Int? {
    get {
      return snapshot["productId"] as? Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "productId")
    }
  }

  public var quantity: Int {
    get {
      return snapshot["quantity"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "quantity")
    }
  }

  public var price: String {
    get {
      return snapshot["price"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "price")
    }
  }
}

public struct ProductTypeFragment: GraphQLFragment {
  public static let fragmentString =
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

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: Int, name: String, color: Int? = nil, discontinued: Bool, sort: Int) {
    self.init(snapshot: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued, "sort": sort])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return snapshot["id"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "id")
    }
  }

  public var name: String {
    get {
      return snapshot["name"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "name")
    }
  }

  public var color: Int? {
    get {
      return snapshot["color"] as? Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "color")
    }
  }

  public var discontinued: Bool {
    get {
      return snapshot["discontinued"]! as! Bool
    }
    set {
      snapshot.updateValue(newValue, forKey: "discontinued")
    }
  }

  public var sort: Int {
    get {
      return snapshot["sort"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "sort")
    }
  }
}

public struct ProductFragment: GraphQLFragment {
  public static let fragmentString =
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

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool, sort: Int) {
    self.init(snapshot: ["__typename": "Product", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued, "sort": sort])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return snapshot["id"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "id")
    }
  }

  public var typeId: Int {
    get {
      return snapshot["typeId"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "typeId")
    }
  }

  public var name: String {
    get {
      return snapshot["name"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "name")
    }
  }

  public var quantity: Int {
    get {
      return snapshot["quantity"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "quantity")
    }
  }

  public var discontinued: Bool {
    get {
      return snapshot["discontinued"]! as! Bool
    }
    set {
      snapshot.updateValue(newValue, forKey: "discontinued")
    }
  }

  public var sort: Int {
    get {
      return snapshot["sort"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "sort")
    }
  }
}

public struct RecordFragment: GraphQLFragment {
  public static let fragmentString =
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

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: Int, uuid: String? = nil, products: [Int], price: String, time: String, info: String) {
    self.init(snapshot: ["__typename": "Record", "id": id, "uuid": uuid, "products": products, "price": price, "time": time, "info": info])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return snapshot["id"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "id")
    }
  }

  public var uuid: String? {
    get {
      return snapshot["uuid"] as? String
    }
    set {
      snapshot.updateValue(newValue, forKey: "uuid")
    }
  }

  public var products: [Int] {
    get {
      return snapshot["products"]! as! [Int]
    }
    set {
      snapshot.updateValue(newValue, forKey: "products")
    }
  }

  public var price: String {
    get {
      return snapshot["price"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "price")
    }
  }

  public var time: String {
    get {
      return snapshot["time"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "time")
    }
  }

  public var info: String {
    get {
      return snapshot["info"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "info")
    }
  }
}

public struct SettingsFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment SettingsFragment on Settings {\n  __typename\n  currency\n  language\n}"

  public static let possibleTypes = ["Settings"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("currency", type: .nonNull(.scalar(String.self))),
    GraphQLField("language", type: .nonNull(.scalar(String.self))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(currency: String, language: String) {
    self.init(snapshot: ["__typename": "Settings", "currency": currency, "language": language])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var currency: String {
    get {
      return snapshot["currency"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "currency")
    }
  }

  public var language: String {
    get {
      return snapshot["language"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "language")
    }
  }
}

public struct UserInfoFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment UserInfoFragment on ConventionUserInfo {\n  __typename\n  id\n  info\n  vote\n  ...VotesFragment\n}"

  public static let possibleTypes = ["ConventionUserInfo"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("info", type: .nonNull(.scalar(String.self))),
    GraphQLField("vote", type: .nonNull(.scalar(Int.self))),
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
    GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
    self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var id: Int {
    get {
      return snapshot["id"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "id")
    }
  }

  public var info: String {
    get {
      return snapshot["info"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "info")
    }
  }

  public var vote: Int {
    get {
      return snapshot["vote"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "vote")
    }
  }

  public var upvotes: Int {
    get {
      return snapshot["upvotes"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "upvotes")
    }
  }

  public var downvotes: Int {
    get {
      return snapshot["downvotes"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "downvotes")
    }
  }

  public var fragments: Fragments {
    get {
      return Fragments(snapshot: snapshot)
    }
    set {
      snapshot += newValue.snapshot
    }
  }

  public struct Fragments {
    public var snapshot: Snapshot

    public var votesFragment: VotesFragment {
      get {
        return VotesFragment(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }
  }
}

public struct UserFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment UserFragment on User {\n  __typename\n  name\n  email\n  settings {\n    __typename\n    ...SettingsFragment\n  }\n  conventions {\n    __typename\n    ...MetaConventionFragment\n  }\n}"

  public static let possibleTypes = ["User"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("name", type: .nonNull(.scalar(String.self))),
    GraphQLField("email", type: .nonNull(.scalar(String.self))),
    GraphQLField("settings", type: .nonNull(.object(Setting.selections))),
    GraphQLField("conventions", type: .nonNull(.list(.nonNull(.object(Convention.selections))))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(name: String, email: String, settings: Setting, conventions: [Convention]) {
    self.init(snapshot: ["__typename": "User", "name": name, "email": email, "settings": settings.snapshot, "conventions": conventions.map { $0.snapshot }])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var name: String {
    get {
      return snapshot["name"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "name")
    }
  }

  public var email: String {
    get {
      return snapshot["email"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "email")
    }
  }

  public var settings: Setting {
    get {
      return Setting(snapshot: snapshot["settings"]! as! Snapshot)
    }
    set {
      snapshot.updateValue(newValue.snapshot, forKey: "settings")
    }
  }

  public var conventions: [Convention] {
    get {
      return (snapshot["conventions"] as! [Snapshot]).map { Convention(snapshot: $0) }
    }
    set {
      snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "conventions")
    }
  }

  public struct Setting: GraphQLSelectionSet {
    public static let possibleTypes = ["Settings"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("currency", type: .nonNull(.scalar(String.self))),
      GraphQLField("language", type: .nonNull(.scalar(String.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(currency: String, language: String) {
      self.init(snapshot: ["__typename": "Settings", "currency": currency, "language": language])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var currency: String {
      get {
        return snapshot["currency"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "currency")
      }
    }

    public var language: String {
      get {
        return snapshot["language"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "language")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var settingsFragment: SettingsFragment {
        get {
          return SettingsFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }
  }

  public struct Convention: GraphQLSelectionSet {
    public static let possibleTypes = ["Convention"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      GraphQLField("name", type: .nonNull(.scalar(String.self))),
      GraphQLField("images", type: .nonNull(.list(.nonNull(.object(Image.selections))))),
      GraphQLField("start", type: .nonNull(.scalar(String.self))),
      GraphQLField("end", type: .nonNull(.scalar(String.self))),
      GraphQLField("extraInfo", type: .nonNull(.list(.nonNull(.object(ExtraInfo.selections))))),
      GraphQLField("userInfo", type: .nonNull(.list(.nonNull(.object(UserInfo.selections))))),
      GraphQLField("recordTotal", type: .scalar(String.self)),
      GraphQLField("expenseTotal", type: .scalar(String.self)),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, name: String, images: [Image], start: String, end: String, extraInfo: [ExtraInfo], userInfo: [UserInfo], recordTotal: String? = nil, expenseTotal: String? = nil) {
      self.init(snapshot: ["__typename": "Convention", "id": id, "name": name, "images": images.map { $0.snapshot }, "start": start, "end": end, "extraInfo": extraInfo.map { $0.snapshot }, "userInfo": userInfo.map { $0.snapshot }, "recordTotal": recordTotal, "expenseTotal": expenseTotal])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var id: Int {
      get {
        return snapshot["id"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "id")
      }
    }

    public var name: String {
      get {
        return snapshot["name"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "name")
      }
    }

    public var images: [Image] {
      get {
        return (snapshot["images"] as! [Snapshot]).map { Image(snapshot: $0) }
      }
      set {
        snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "images")
      }
    }

    public var start: String {
      get {
        return snapshot["start"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "start")
      }
    }

    public var end: String {
      get {
        return snapshot["end"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "end")
      }
    }

    public var extraInfo: [ExtraInfo] {
      get {
        return (snapshot["extraInfo"] as! [Snapshot]).map { ExtraInfo(snapshot: $0) }
      }
      set {
        snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "extraInfo")
      }
    }

    public var userInfo: [UserInfo] {
      get {
        return (snapshot["userInfo"] as! [Snapshot]).map { UserInfo(snapshot: $0) }
      }
      set {
        snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "userInfo")
      }
    }

    public var recordTotal: String? {
      get {
        return snapshot["recordTotal"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "recordTotal")
      }
    }

    public var expenseTotal: String? {
      get {
        return snapshot["expenseTotal"] as? String
      }
      set {
        snapshot.updateValue(newValue, forKey: "expenseTotal")
      }
    }

    public var fragments: Fragments {
      get {
        return Fragments(snapshot: snapshot)
      }
      set {
        snapshot += newValue.snapshot
      }
    }

    public struct Fragments {
      public var snapshot: Snapshot

      public var metaConventionFragment: MetaConventionFragment {
        get {
          return MetaConventionFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public var conventionBasicInfoFragment: ConventionBasicInfoFragment {
        get {
          return ConventionBasicInfoFragment(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }
    }

    public struct Image: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionImage"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(String.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: String) {
        self.init(snapshot: ["__typename": "ConventionImage", "id": id])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: String {
        get {
          return snapshot["id"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var conventionImageFragment: ConventionImageFragment {
          get {
            return ConventionImageFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }

    public struct ExtraInfo: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionExtraInfo"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("title", type: .nonNull(.scalar(String.self))),
        GraphQLField("info", type: .scalar(String.self)),
        GraphQLField("action", type: .scalar(String.self)),
        GraphQLField("actionText", type: .scalar(String.self)),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(title: String, info: String? = nil, action: String? = nil, actionText: String? = nil) {
        self.init(snapshot: ["__typename": "ConventionExtraInfo", "title": title, "info": info, "action": action, "actionText": actionText])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var title: String {
        get {
          return snapshot["title"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "title")
        }
      }

      public var info: String? {
        get {
          return snapshot["info"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "info")
        }
      }

      public var action: String? {
        get {
          return snapshot["action"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "action")
        }
      }

      public var actionText: String? {
        get {
          return snapshot["actionText"] as? String
        }
        set {
          snapshot.updateValue(newValue, forKey: "actionText")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var extraInfoFragment: ExtraInfoFragment {
          get {
            return ExtraInfoFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }

    public struct UserInfo: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionUserInfo"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("info", type: .nonNull(.scalar(String.self))),
        GraphQLField("vote", type: .nonNull(.scalar(Int.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
        GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(id: Int, info: String, vote: Int, upvotes: Int, downvotes: Int) {
        self.init(snapshot: ["__typename": "ConventionUserInfo", "id": id, "info": info, "vote": vote, "upvotes": upvotes, "downvotes": downvotes])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var id: Int {
        get {
          return snapshot["id"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "id")
        }
      }

      public var info: String {
        get {
          return snapshot["info"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "info")
        }
      }

      public var vote: Int {
        get {
          return snapshot["vote"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "vote")
        }
      }

      public var upvotes: Int {
        get {
          return snapshot["upvotes"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "upvotes")
        }
      }

      public var downvotes: Int {
        get {
          return snapshot["downvotes"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "downvotes")
        }
      }

      public var fragments: Fragments {
        get {
          return Fragments(snapshot: snapshot)
        }
        set {
          snapshot += newValue.snapshot
        }
      }

      public struct Fragments {
        public var snapshot: Snapshot

        public var userInfoFragment: UserInfoFragment {
          get {
            return UserInfoFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }

        public var votesFragment: VotesFragment {
          get {
            return VotesFragment(snapshot: snapshot)
          }
          set {
            snapshot += newValue.snapshot
          }
        }
      }
    }
  }
}

public struct VotesFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment VotesFragment on ConventionUserInfo {\n  __typename\n  upvotes\n  downvotes\n}"

  public static let possibleTypes = ["ConventionUserInfo"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("upvotes", type: .nonNull(.scalar(Int.self))),
    GraphQLField("downvotes", type: .nonNull(.scalar(Int.self))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(upvotes: Int, downvotes: Int) {
    self.init(snapshot: ["__typename": "ConventionUserInfo", "upvotes": upvotes, "downvotes": downvotes])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var upvotes: Int {
    get {
      return snapshot["upvotes"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "upvotes")
    }
  }

  public var downvotes: Int {
    get {
      return snapshot["downvotes"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "downvotes")
    }
  }
}