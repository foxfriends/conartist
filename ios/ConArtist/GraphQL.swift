//  This file was automatically generated and should not be edited.

import Apollo

public final class UserQuery: GraphQLQuery {
  public static let operationString =
    "query User($id: Int) {\n  user(id: $id) {\n    __typename\n    name\n    email\n    conventions {\n      __typename\n      ...MetaConventionFragment\n    }\n  }\n}"

  public static var requestString: String { return operationString.appending(MetaConventionFragment.fragmentString) }

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
        GraphQLField("name", type: .nonNull(.scalar(String.self))),
        GraphQLField("email", type: .nonNull(.scalar(String.self))),
        GraphQLField("conventions", type: .nonNull(.list(.nonNull(.object(Convention.selections))))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(name: String, email: String, conventions: [Convention]) {
        self.init(snapshot: ["__typename": "User", "name": name, "email": email, "conventions": conventions.map { $0.snapshot }])
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

      public var conventions: [Convention] {
        get {
          return (snapshot["conventions"] as! [Snapshot]).map { Convention(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "conventions")
        }
      }

      public struct Convention: GraphQLSelectionSet {
        public static let possibleTypes = ["FullUserConvention"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("code", type: .nonNull(.scalar(String.self))),
          GraphQLField("name", type: .nonNull(.scalar(String.self))),
          GraphQLField("start", type: .nonNull(.scalar(String.self))),
          GraphQLField("end", type: .nonNull(.scalar(String.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, code: String, name: String, start: String, end: String) {
          self.init(snapshot: ["__typename": "FullUserConvention", "id": id, "code": code, "name": name, "start": start, "end": end])
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

        public var code: String {
          get {
            return snapshot["code"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "code")
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
        }
      }
    }
  }
}

public final class FullConventionQuery: GraphQLQuery {
  public static let operationString =
    "query FullConvention($id: Int, $code: String!) {\n  userConvention(id: $id, code: $code) {\n    __typename\n    ...FullConventionFragment\n  }\n}"

  public static var requestString: String { return operationString.appending(FullConventionFragment.fragmentString).appending(MetaConventionFragment.fragmentString).appending(ProductFragment.fragmentString).appending(ProductTypeFragment.fragmentString).appending(PriceRowFragment.fragmentString).appending(RecordFragment.fragmentString).appending(ExpenseFragment.fragmentString) }

  public var id: Int?
  public var code: String

  public init(id: Int? = nil, code: String) {
    self.id = id
    self.code = code
  }

  public var variables: GraphQLMap? {
    return ["id": id, "code": code]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Query"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("userConvention", arguments: ["id": GraphQLVariable("id"), "code": GraphQLVariable("code")], type: .nonNull(.object(UserConvention.selections))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(userConvention: UserConvention) {
      self.init(snapshot: ["__typename": "Query", "userConvention": userConvention.snapshot])
    }

    /// Retrieves the full information of one user's convention
    public var userConvention: UserConvention {
      get {
        return UserConvention(snapshot: snapshot["userConvention"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "userConvention")
      }
    }

    public struct UserConvention: GraphQLSelectionSet {
      public static let possibleTypes = ["FullUserConvention"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("id", type: .nonNull(.scalar(Int.self))),
        GraphQLField("code", type: .nonNull(.scalar(String.self))),
        GraphQLField("name", type: .nonNull(.scalar(String.self))),
        GraphQLField("start", type: .nonNull(.scalar(String.self))),
        GraphQLField("end", type: .nonNull(.scalar(String.self))),
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

      public init(id: Int, code: String, name: String, start: String, end: String, products: [Product], productTypes: [ProductType], prices: [Price], records: [Record], expenses: [Expense]) {
        self.init(snapshot: ["__typename": "FullUserConvention", "id": id, "code": code, "name": name, "start": start, "end": end, "products": products.map { $0.snapshot }, "productTypes": productTypes.map { $0.snapshot }, "prices": prices.map { $0.snapshot }, "records": records.map { $0.snapshot }, "expenses": expenses.map { $0.snapshot }])
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

      public var code: String {
        get {
          return snapshot["code"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "code")
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
      }

      public struct Product: GraphQLSelectionSet {
        public static let possibleTypes = ["ProductInInventory"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
          GraphQLField("name", type: .nonNull(.scalar(String.self))),
          GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
          GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool) {
          self.init(snapshot: ["__typename": "ProductInInventory", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued])
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
          GraphQLField("color", type: .nonNull(.scalar(Int.self))),
          GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, name: String, color: Int, discontinued: Bool) {
          self.init(snapshot: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued])
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

        public var color: Int {
          get {
            return snapshot["color"]! as! Int
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
        public static let possibleTypes = ["PriceRow"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("index", type: .nonNull(.scalar(Int.self))),
          GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
          GraphQLField("productId", type: .scalar(Int.self)),
          GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
          GraphQLField("price", type: .nonNull(.scalar(String.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(index: Int, typeId: Int, productId: Int? = nil, quantity: Int, price: String) {
          self.init(snapshot: ["__typename": "PriceRow", "index": index, "typeId": typeId, "productId": productId, "quantity": quantity, "price": price])
        }

        public var __typename: String {
          get {
            return snapshot["__typename"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "__typename")
          }
        }

        public var index: Int {
          get {
            return snapshot["index"]! as! Int
          }
          set {
            snapshot.updateValue(newValue, forKey: "index")
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

          public var priceRowFragment: PriceRowFragment {
            get {
              return PriceRowFragment(snapshot: snapshot)
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
          GraphQLField("products", type: .nonNull(.list(.nonNull(.scalar(Int.self))))),
          GraphQLField("price", type: .nonNull(.scalar(String.self))),
          GraphQLField("time", type: .nonNull(.scalar(String.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, products: [Int], price: String, time: String) {
          self.init(snapshot: ["__typename": "Record", "id": id, "products": products, "price": price, "time": time])
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
          GraphQLField("category", type: .nonNull(.scalar(String.self))),
          GraphQLField("description", type: .nonNull(.scalar(String.self))),
          GraphQLField("price", type: .nonNull(.scalar(String.self))),
          GraphQLField("time", type: .nonNull(.scalar(String.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, category: String, description: String, price: String, time: String) {
          self.init(snapshot: ["__typename": "Expense", "id": id, "category": category, "description": description, "price": price, "time": time])
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

public final class ConventionPageQuery: GraphQLQuery {
  public static let operationString =
    "query ConventionPage($date: DateTimeFixedOffset, $limit: Int, $page: Int) {\n  convention(date: $date, limit: $limit, page: $page) {\n    __typename\n    page\n    pages\n    data {\n      __typename\n      id\n      name\n      code\n      start\n      end\n    }\n  }\n}"

  public var date: String?
  public var limit: Int?
  public var page: Int?

  public init(date: String? = nil, limit: Int? = nil, page: Int? = nil) {
    self.date = date
    self.limit = limit
    self.page = page
  }

  public var variables: GraphQLMap? {
    return ["date": date, "limit": limit, "page": page]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Query"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("convention", arguments: ["date": GraphQLVariable("date"), "limit": GraphQLVariable("limit"), "page": GraphQLVariable("page")], type: .nonNull(.object(Convention.selections))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(convention: Convention) {
      self.init(snapshot: ["__typename": "Query", "convention": convention.snapshot])
    }

    /// Retrieves one page of conventions which start after a given date
    public var convention: Convention {
      get {
        return Convention(snapshot: snapshot["convention"]! as! Snapshot)
      }
      set {
        snapshot.updateValue(newValue.snapshot, forKey: "convention")
      }
    }

    public struct Convention: GraphQLSelectionSet {
      public static let possibleTypes = ["ConventionPages"]

      public static let selections: [GraphQLSelection] = [
        GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
        GraphQLField("page", type: .nonNull(.scalar(Int.self))),
        GraphQLField("pages", type: .nonNull(.scalar(Int.self))),
        GraphQLField("data", type: .nonNull(.list(.nonNull(.object(Datum.selections))))),
      ]

      public var snapshot: Snapshot

      public init(snapshot: Snapshot) {
        self.snapshot = snapshot
      }

      public init(page: Int, pages: Int, data: [Datum]) {
        self.init(snapshot: ["__typename": "ConventionPages", "page": page, "pages": pages, "data": data.map { $0.snapshot }])
      }

      public var __typename: String {
        get {
          return snapshot["__typename"]! as! String
        }
        set {
          snapshot.updateValue(newValue, forKey: "__typename")
        }
      }

      public var page: Int {
        get {
          return snapshot["page"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "page")
        }
      }

      public var pages: Int {
        get {
          return snapshot["pages"]! as! Int
        }
        set {
          snapshot.updateValue(newValue, forKey: "pages")
        }
      }

      public var data: [Datum] {
        get {
          return (snapshot["data"] as! [Snapshot]).map { Datum(snapshot: $0) }
        }
        set {
          snapshot.updateValue(newValue.map { $0.snapshot }, forKey: "data")
        }
      }

      public struct Datum: GraphQLSelectionSet {
        public static let possibleTypes = ["Convention"]

        public static let selections: [GraphQLSelection] = [
          GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
          GraphQLField("id", type: .nonNull(.scalar(Int.self))),
          GraphQLField("name", type: .nonNull(.scalar(String.self))),
          GraphQLField("code", type: .nonNull(.scalar(String.self))),
          GraphQLField("start", type: .nonNull(.scalar(String.self))),
          GraphQLField("end", type: .nonNull(.scalar(String.self))),
        ]

        public var snapshot: Snapshot

        public init(snapshot: Snapshot) {
          self.snapshot = snapshot
        }

        public init(id: Int, name: String, code: String, start: String, end: String) {
          self.init(snapshot: ["__typename": "Convention", "id": id, "name": name, "code": code, "start": start, "end": end])
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

        public var code: String {
          get {
            return snapshot["code"]! as! String
          }
          set {
            snapshot.updateValue(newValue, forKey: "code")
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
      }
    }
  }
}

public struct ProductTypeFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment ProductTypeFragment on ProductType {\n  __typename\n  id\n  name\n  color\n  discontinued\n}"

  public static let possibleTypes = ["ProductType"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("name", type: .nonNull(.scalar(String.self))),
    GraphQLField("color", type: .nonNull(.scalar(Int.self))),
    GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: Int, name: String, color: Int, discontinued: Bool) {
    self.init(snapshot: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued])
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

  public var color: Int {
    get {
      return snapshot["color"]! as! Int
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
}

public struct ProductFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment ProductFragment on ProductInInventory {\n  __typename\n  id\n  typeId\n  name\n  quantity\n  discontinued\n}"

  public static let possibleTypes = ["ProductInInventory"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
    GraphQLField("name", type: .nonNull(.scalar(String.self))),
    GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
    GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool) {
    self.init(snapshot: ["__typename": "ProductInInventory", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued])
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
}

public struct PriceRowFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment PriceRowFragment on PriceRow {\n  __typename\n  index\n  typeId\n  productId\n  quantity\n  price\n}"

  public static let possibleTypes = ["PriceRow"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("index", type: .nonNull(.scalar(Int.self))),
    GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
    GraphQLField("productId", type: .scalar(Int.self)),
    GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
    GraphQLField("price", type: .nonNull(.scalar(String.self))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(index: Int, typeId: Int, productId: Int? = nil, quantity: Int, price: String) {
    self.init(snapshot: ["__typename": "PriceRow", "index": index, "typeId": typeId, "productId": productId, "quantity": quantity, "price": price])
  }

  public var __typename: String {
    get {
      return snapshot["__typename"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "__typename")
    }
  }

  public var index: Int {
    get {
      return snapshot["index"]! as! Int
    }
    set {
      snapshot.updateValue(newValue, forKey: "index")
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

public struct MetaConventionFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment MetaConventionFragment on FullUserConvention {\n  __typename\n  id\n  code\n  name\n  start\n  end\n}"

  public static let possibleTypes = ["FullUserConvention"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("code", type: .nonNull(.scalar(String.self))),
    GraphQLField("name", type: .nonNull(.scalar(String.self))),
    GraphQLField("start", type: .nonNull(.scalar(String.self))),
    GraphQLField("end", type: .nonNull(.scalar(String.self))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: Int, code: String, name: String, start: String, end: String) {
    self.init(snapshot: ["__typename": "FullUserConvention", "id": id, "code": code, "name": name, "start": start, "end": end])
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

  public var code: String {
    get {
      return snapshot["code"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "code")
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
}

public struct RecordFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment RecordFragment on Record {\n  __typename\n  id\n  products\n  price\n  time\n}"

  public static let possibleTypes = ["Record"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("products", type: .nonNull(.list(.nonNull(.scalar(Int.self))))),
    GraphQLField("price", type: .nonNull(.scalar(String.self))),
    GraphQLField("time", type: .nonNull(.scalar(String.self))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: Int, products: [Int], price: String, time: String) {
    self.init(snapshot: ["__typename": "Record", "id": id, "products": products, "price": price, "time": time])
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
}

public struct ExpenseFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment ExpenseFragment on Expense {\n  __typename\n  id\n  category\n  description\n  price\n  time\n}"

  public static let possibleTypes = ["Expense"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("category", type: .nonNull(.scalar(String.self))),
    GraphQLField("description", type: .nonNull(.scalar(String.self))),
    GraphQLField("price", type: .nonNull(.scalar(String.self))),
    GraphQLField("time", type: .nonNull(.scalar(String.self))),
  ]

  public var snapshot: Snapshot

  public init(snapshot: Snapshot) {
    self.snapshot = snapshot
  }

  public init(id: Int, category: String, description: String, price: String, time: String) {
    self.init(snapshot: ["__typename": "Expense", "id": id, "category": category, "description": description, "price": price, "time": time])
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

public struct FullConventionFragment: GraphQLFragment {
  public static let fragmentString =
    "fragment FullConventionFragment on FullUserConvention {\n  __typename\n  ...MetaConventionFragment\n  products {\n    __typename\n    ...ProductFragment\n  }\n  productTypes {\n    __typename\n    ...ProductTypeFragment\n  }\n  prices {\n    __typename\n    ...PriceRowFragment\n  }\n  records {\n    __typename\n    ...RecordFragment\n  }\n  expenses {\n    __typename\n    ...ExpenseFragment\n  }\n}"

  public static let possibleTypes = ["FullUserConvention"]

  public static let selections: [GraphQLSelection] = [
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
    GraphQLField("id", type: .nonNull(.scalar(Int.self))),
    GraphQLField("code", type: .nonNull(.scalar(String.self))),
    GraphQLField("name", type: .nonNull(.scalar(String.self))),
    GraphQLField("start", type: .nonNull(.scalar(String.self))),
    GraphQLField("end", type: .nonNull(.scalar(String.self))),
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

  public init(id: Int, code: String, name: String, start: String, end: String, products: [Product], productTypes: [ProductType], prices: [Price], records: [Record], expenses: [Expense]) {
    self.init(snapshot: ["__typename": "FullUserConvention", "id": id, "code": code, "name": name, "start": start, "end": end, "products": products.map { $0.snapshot }, "productTypes": productTypes.map { $0.snapshot }, "prices": prices.map { $0.snapshot }, "records": records.map { $0.snapshot }, "expenses": expenses.map { $0.snapshot }])
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

  public var code: String {
    get {
      return snapshot["code"]! as! String
    }
    set {
      snapshot.updateValue(newValue, forKey: "code")
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
  }

  public struct Product: GraphQLSelectionSet {
    public static let possibleTypes = ["ProductInInventory"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("id", type: .nonNull(.scalar(Int.self))),
      GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
      GraphQLField("name", type: .nonNull(.scalar(String.self))),
      GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
      GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, typeId: Int, name: String, quantity: Int, discontinued: Bool) {
      self.init(snapshot: ["__typename": "ProductInInventory", "id": id, "typeId": typeId, "name": name, "quantity": quantity, "discontinued": discontinued])
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
      GraphQLField("color", type: .nonNull(.scalar(Int.self))),
      GraphQLField("discontinued", type: .nonNull(.scalar(Bool.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, name: String, color: Int, discontinued: Bool) {
      self.init(snapshot: ["__typename": "ProductType", "id": id, "name": name, "color": color, "discontinued": discontinued])
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

    public var color: Int {
      get {
        return snapshot["color"]! as! Int
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
    public static let possibleTypes = ["PriceRow"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("__typename", type: .nonNull(.scalar(String.self))),
      GraphQLField("index", type: .nonNull(.scalar(Int.self))),
      GraphQLField("typeId", type: .nonNull(.scalar(Int.self))),
      GraphQLField("productId", type: .scalar(Int.self)),
      GraphQLField("quantity", type: .nonNull(.scalar(Int.self))),
      GraphQLField("price", type: .nonNull(.scalar(String.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(index: Int, typeId: Int, productId: Int? = nil, quantity: Int, price: String) {
      self.init(snapshot: ["__typename": "PriceRow", "index": index, "typeId": typeId, "productId": productId, "quantity": quantity, "price": price])
    }

    public var __typename: String {
      get {
        return snapshot["__typename"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "__typename")
      }
    }

    public var index: Int {
      get {
        return snapshot["index"]! as! Int
      }
      set {
        snapshot.updateValue(newValue, forKey: "index")
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

      public var priceRowFragment: PriceRowFragment {
        get {
          return PriceRowFragment(snapshot: snapshot)
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
      GraphQLField("products", type: .nonNull(.list(.nonNull(.scalar(Int.self))))),
      GraphQLField("price", type: .nonNull(.scalar(String.self))),
      GraphQLField("time", type: .nonNull(.scalar(String.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, products: [Int], price: String, time: String) {
      self.init(snapshot: ["__typename": "Record", "id": id, "products": products, "price": price, "time": time])
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
      GraphQLField("category", type: .nonNull(.scalar(String.self))),
      GraphQLField("description", type: .nonNull(.scalar(String.self))),
      GraphQLField("price", type: .nonNull(.scalar(String.self))),
      GraphQLField("time", type: .nonNull(.scalar(String.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(id: Int, category: String, description: String, price: String, time: String) {
      self.init(snapshot: ["__typename": "Expense", "id": id, "category": category, "description": description, "price": price, "time": time])
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
