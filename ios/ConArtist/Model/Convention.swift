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
    let name: String
    let start: Date
    let end: Date
    let extraInfo: String

    let productTypes: Observable<[ProductType]>
    let products: Observable<[Product]>
    let prices: Observable<[Price]>
    let records: Observable<[Record]>
    let expenses: Observable<[Expense]>
    
    fileprivate let øaddedRecords = Variable<[Record]>([])
    fileprivate let øaddedExpenses = Variable<[Expense]>([])

    fileprivate let øconvention = Variable<FullConventionQuery.Data.UserConvention?>(nil)
    fileprivate let disposeBag = DisposeBag()
    
    init?(graphQL con: UserQuery.Data.User.Convention?) {
        guard
            let con = con,
            let startDate = con.start.toDate(),
            let endDate = con.end.toDate()
        else { return nil }
        id = con.id
        name = con.name
        start = startDate
        end = endDate
        extraInfo = con.extraInfo
        
        productTypes = øconvention.asObservable().map { $0?.productTypes.filterMap(ProductType.from) ?? [] }
        products = øconvention.asObservable().map { $0?.products.filterMap(Product.from) ?? [] }
        prices = øconvention.asObservable().map { $0?.prices.filterMap(Price.from) ?? [] }
        records = Observable.combineLatest(
            øconvention.asObservable().map { $0?.records.filterMap(Record.from) ?? [] },
            øaddedRecords.asObservable()
        ).map({ ($0 + $1).sorted { $0.time < $1.time } })
        expenses = Observable.combineLatest(
            øconvention.asObservable().map { $0?.expenses.filterMap(Expense.from) ?? [] },
            øaddedExpenses.asObservable()
        ).map({ ($0 + $1).sorted { $0.time < $1.time } })
    }
}

// MARK: - Date formatting
extension Convention {
    private static let DateFormat: String = "MMM dd, yyyy"
    var dateString: String {
        get {
            return "\(self.start.toString(Convention.DateFormat)) - \(self.end.toString(Convention.DateFormat))"
        }
    }
}

// MARK: - Modifications
extension Convention {
    func addRecord(_ record: Record) {
        øaddedRecords.value.append(record)
    }
    
    func addExpense(_ expense: Expense) {
        øaddedExpenses.value.append(expense)
    }
}

// MARK: - API
extension Convention {
    func fill(_ force: Bool = false) -> Observable<Void> {
        if øconvention.value == nil || force {
            return ConArtist.API.GraphQL
                .observe(query: FullConventionQuery(userId: nil, conId: id), cachePolicy: force ? .fetchIgnoringCacheData : .returnCacheDataElseFetch)
                .catchError { _ in Observable.empty() }
                .map { [weak self] data in self?.øconvention.value = data.userConvention }
        } else {
            return Observable.of(())
        }
    }
    
    func save() -> Observable<Void> {
        let records = øaddedRecords.value.isEmpty
            ? Observable.just([])
            : Observable.zip(
                øaddedRecords.value.map { record in
                    ConArtist.API.GraphQL.observe(mutation: AddRecordMutation(id: nil, record: record.add(to: self)))
                        .map { _ in nil as Error? }
                        .catchError { Observable.just($0) }
                }
            )
        let expenses = øaddedExpenses.value.isEmpty
            ? Observable.just([])
            : Observable.zip(
                øaddedExpenses.value.map { expense in
                    ConArtist.API.GraphQL.observe(mutation: AddExpenseMutation(id: nil, expense: expense.add(to: self)))
                        .map { _ in nil as Error? }
                        .catchError { Observable.just($0) }
                }
            )
        return Observable.zip(records, expenses)
            .map { [weak self] re in
                guard let `self` = self else { return }
                let (records, expenses) = re
                self.øaddedRecords.value = zip(self.øaddedRecords.value, records).filterMap { record, error in
                    guard error == nil else { return record }
                    return nil
                }
                self.øaddedExpenses.value = zip(self.øaddedExpenses.value, expenses).filterMap { expense, error in
                    guard error == nil else { return expense }
                    return nil
                }
            }
            .flatMap({ [weak self] in self?.fill(true) ?? Observable.empty() })
    }
}
