//
//  Convention.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation
import PromiseKit

enum Convention {
    case Meta(
        id: Int,
        code: String,
        name: String,
        start: Date,
        end: Date
    )
    case Full(
        id: Int,
        code: String,
        name: String,
        start: Date,
        end: Date,
        types: [ProductType],
        products: [Product],
        prices: [Price],
        records: [Record],
        expenses: [Expense]
    )
    
    // MARK: - Accessors
    
    var id: Int {
        get {
            switch self {
            case .Meta(let id, _, _, _, _):
                return id
            case .Full(let id, _, _, _, _, _, _, _, _, _):
                return id
            }
        }
    }
    
    var name: String {
        get {
            switch self {
            case .Meta(_, _, let name, _, _):
                return name
            case .Full(_, _, let name, _, _, _, _, _, _, _):
                return name
            }
        }
    }
    
    var start: Date {
        get {
            switch self {
            case .Meta(_, _, _, let start, _):
                return start
            case .Full(_, _, _, let start, _, _, _, _, _, _):
                return start
            }
        }
    }
    
    var end: Date {
        get {
            switch self {
            case .Meta(_, _, _, _, let end):
                return end
            case .Full(_, _, _, _, let end, _, _, _, _, _):
                return end
            }
        }
    }
    
    private static let DateFormat: String = "MMM dd, yyyy"
    var dateString: String {
        get {
            return "\(self.start.toString(Convention.DateFormat)) - \(self.end.toString(Convention.DateFormat))"
        }
    }
    
    var productTypes: [ProductType]? {
        get {
            switch self {
            case .Meta:
                return nil
            case .Full(_, _, _, _, _, let types, _, _, _, _):
                return types
            }
        }
    }
    
    var products: [Product]? {
        get {
            switch self {
            case .Meta:
                return nil
            case .Full(_, _, _, _, _, _, let products, _, _, _):
                return products
            }
        }
    }
    
    var prices: [Price]? {
        get {
            switch self {
            case .Meta:
                return nil
            case .Full(_, _, _, _, _, _, _, let prices, _, _):
                return prices
            }
        }
    }
    
    var records: [Record]? {
        get {
            switch self {
            case .Meta:
                return nil
            case .Full(_, _, _, _, _, _, _, _, let records, _):
                return records
            }
        }
    }
    
    var expenses: [Expense]? {
        get {
            switch self {
            case .Meta:
                return nil
            case .Full(_, _, _, _, _, _, _, _, _, let expenses):
                return expenses
            }
        }
    }
    
    func productType(for id: Int) -> ProductType? {
        return productTypes?.first { $0.id == id }
    }
    
    func product(for id: Int) -> Product? {
        return products?.first { $0.id == id }
    }
    
    func price(for product: Product? = nil, of type: ProductType) -> [Price]? {
        return prices?.filter { $0.typeId == type.id && $0.productId == product?.id }
    }
    
    // MARK: - Initializers
    
    static func from(graphQL maybeCon: UserQuery.Data.User.Convention?) -> Convention? {
        guard let con = maybeCon else { return nil }
        return Convention.Meta(
            id: con.id,
            code: con.code, 
            name: con.name, 
            start: con.start.toDate()!,
            end: con.end.toDate()!
        )
    }
    
    static func from(graphQL maybeCon: FullConventionQuery.Data.UserConvention?) -> Convention? {
        guard let con = maybeCon else { return nil }
        return Convention.Full(
            id: con.id,
            code: con.code,
            name: con.name,
            start: con.start.toDate()!,
            end: con.end.toDate()!,
            types: con.productTypes.map(ProductType.from).filter { $0 != nil } as! [ProductType],
            products: con.products.map(Product.from).filter { $0 != nil } as! [Product],
            prices: con.prices.map(Price.from).filter { $0 != nil } as! [Price],
            records: con.records.map(Record.from).filter { $0 != nil } as! [Record],
            expenses: con.expenses.map(Expense.from).filter { $0 != nil } as! [Expense]
        )
    }
    
    func fill() -> Promise<Convention> {
        switch self {
        case .Meta(_, let code, _, _, _):
            return Promise { (resolve, reject) in
                ConArtist.API.GraphQL.fetch(query: FullConventionQuery(id: nil, code: code)) { (result, error) in
                    guard let con = Convention.from(graphQL: result?.data?.userConvention) else {
                        reject(error ?? ConArtist.Error(msg: "Invalid convention details"))
                        return
                    }
                    resolve(con)
                }
            }.then { (filled: Convention) -> Convention in
                ConArtist.model?.update(convention: filled)
                return filled
            }
        case .Full:
            return Promise { (resolve, reject) in resolve(self) }
        }
    }
}
