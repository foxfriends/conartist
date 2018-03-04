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
    let images: [String]
    let extraInfo: [ConventionExtraInfo]
    let userInfo: Observable<[ConventionUserInfo]>

    let productTypes: Observable<[ProductType]>
    let products: Observable<[Product]>
    let prices: Observable<[Price]>
    let records: Observable<[Record]>
    let expenses: Observable<[Expense]>
    
    fileprivate let øaddedRecords = Variable<[Record]>([])
    fileprivate let øaddedExpenses = Variable<[Expense]>([])

    fileprivate let øconvention = Variable<FullConventionFragment?>(nil)

    fileprivate let disposeBag = DisposeBag()

    init?(graphQL con: MetaConventionFragment) {
        guard
            let startDate = con.start.toDate(),
            let endDate = con.end.toDate()
        else { return nil }
        id = con.id
        name = con.name
        start = startDate
        end = endDate
        images = con.images

        let øconvention = self.øconvention.asObservable().filterMap(identity)

        extraInfo = con.extraInfo
            .map { $0.fragments.extraInfoFragment }
            .filterMap(ConventionExtraInfo.init(graphQL:))

        userInfo = Observable.merge(
            Observable.just(
                con.userInfo
                    .map { $0.fragments.userInfoFragment }
                    .filterMap(ConventionUserInfo.init(graphQL:))
            ),
            øconvention
                .map {
                    $0.userInfo
                        .map{ $0.fragments.userInfoFragment }
                        .filterMap(ConventionUserInfo.init(graphQL:))
                }
        )

        productTypes = øconvention
            .map {
                $0.productTypes
                    .map { $0.fragments.productTypeFragment }
                    .filterMap(ProductType.init(graphQL:))
            }

        products = øconvention
            .map {
                $0.products
                    .map { $0.fragments.productFragment }
                    .filterMap(Product.init(graphQL:))
            }

        prices = øconvention
            .map {
                $0.prices
                    .map { $0.fragments.priceRowFragment }
                    .filterMap(Price.init(graphQL:))
            }

        records = Observable.combineLatest(
            øconvention
                .map {
                    $0.records
                        .map { $0.fragments.recordFragment }
                        .filterMap(Record.init(graphQL:))
                },
            øaddedRecords.asObservable()
        ).map({ ($0 + $1).sorted { $0.time < $1.time } })

        expenses = Observable.combineLatest(
            øconvention
                .map {
                    $0.expenses
                        .map { $0.fragments.expenseFragment }
                        .filterMap(Expense.init(graphQL:))
                },
            øaddedExpenses.asObservable()
        ).map({ ($0 + $1).sorted { $0.time < $1.time } })
    }
}

// MARK: - Date formatting
extension Convention {
    private static let DateFormat: String = "MMM dd, yyyy"
    var dateString: String {
        get { return "\(self.start.toString(Convention.DateFormat)) - \(self.end.toString(Convention.DateFormat))" }
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
    struct SaveErrors: Error {
        let errors: [Error]
    }

    private func full(_ force: Bool) -> Observable<FullConventionFragment> {
        return ConArtist.API.GraphQL
            .observe(query: FullConventionQuery(userId: nil, conId: id), cachePolicy: force ? .fetchIgnoringCacheData : .returnCacheDataElseFetch)
            .map { $0.userConvention.fragments.fullConventionFragment }
            .catchError(const(Observable.empty()))
    }

    func fill(_ force: Bool = false) -> Observable<Void> {
        if øconvention.value == nil || force {
            øconvention.value = nil
            let _ = full(force).bind(to: øconvention)
        }
        return øconvention.asObservable().filterMap(identity).discard()
    }

    func save() -> Observable<Bool> {
        let records: Observable<[Error?]> = øaddedRecords.value.isEmpty
            ? Observable.just([])
            : Observable.zip(
                øaddedRecords.value
                    .map { record in record.add(to: self) }
                    .map {
                        ConArtist.API.GraphQL.observe(mutation: AddRecordMutation(record: $0))
                            .map(const(nil as Error?))
                            .catchError { Observable.just($0) }
                    }
            )

        let expenses: Observable<[Error?]> = øaddedExpenses.value.isEmpty
            ? Observable.just([])
            : Observable.zip(
                øaddedExpenses.value
                    .map { expense in expense.add(to: self) }
                    .map {
                        ConArtist.API.GraphQL.observe(mutation: AddExpenseMutation(expense: $0))
                            .map(const(nil as Error?))
                            .catchError { Observable.just($0) }
                    }
            )

        return Observable.zip(records, expenses)
            .map { [weak self] errors in
                guard let `self` = self else { return }
                let (recordErrors, expenseErrors) = errors
                var allErrors: [Error] = []
                self.øaddedRecords.value = zip(self.øaddedRecords.value, recordErrors)
                    .filterMap { record, error in
                        if let error = error {
                            allErrors.append(error)
                            return record
                        }
                        return nil
                    }
                self.øaddedExpenses.value = zip(self.øaddedExpenses.value, expenseErrors).filterMap { expense, error in
                    if let error = error {
                        allErrors.append(error)
                        return expense
                    }
                    return nil
                }
                if !allErrors.isEmpty {
                    throw Convention.SaveErrors(errors: allErrors)
                }
            }
            .flatMap({ [weak self] in self?.fill(true) ?? Observable.empty() })
            .map(const(true))
    }
}
