//
//  Convention.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation
import RxSwift

class Convention {
    let id: Int
    let code: String
    let name: String
    let start: Date
    let end: Date

    let productTypes: Observable<[ProductType]>
    let products: Observable<[Product]>
    let prices: Observable<[Price]>
    let records: Observable<[Record]>
    let expenses: Observable<[Expense]>

    fileprivate let øconvention = Variable<FullConventionQuery.Data.UserConvention?>(nil)
    fileprivate let disposeBag = DisposeBag()
    
    init?(graphQL con: UserQuery.Data.User.Convention?) {
        guard
            let con = con,
            let startDate = con.start.toDate(),
            let endDate = con.end.toDate()
        else { return nil }
        id = con.id
        code = con.code
        name = con.name
        start = startDate
        end = endDate
        
        productTypes = øconvention.asObservable().map { $0?.productTypes.filterMap(ProductType.from) ?? [] }
        products = øconvention.asObservable().map { $0?.products.filterMap(Product.from) ?? [] }
        prices = øconvention.asObservable().map { $0?.prices.filterMap(Price.from) ?? [] }
        records = øconvention.asObservable().map { $0?.records.filterMap(Record.from) ?? [] }
        expenses = øconvention.asObservable().map { $0?.expenses.filterMap(Expense.from) ?? [] }
    }
}

// MARK: - Date format
extension Convention {
    private static let DateFormat: String = "MMM dd, yyyy"
    var dateString: String {
        get {
            return "\(self.start.toString(Convention.DateFormat)) - \(self.end.toString(Convention.DateFormat))"
        }
    }
}

// MARK: - Filling
extension Convention {
    func fill() -> Observable<Void> {
        if øconvention.value == nil {
            return ConArtist.API.GraphQL
                .observe(query: FullConventionQuery(id: nil, code: code))
                .catchError { _ in Observable.empty() }
                .map { [weak self] con in self?.øconvention.value = con.userConvention }
        } else {
            return Observable.of(())
        }
    }
}
