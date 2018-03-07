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
    var userInfo: Observable<[ConventionUserInfo]> { return øuserInfo.asObservable() }

    let productTypes: Observable<[ProductType]>
    let products: Observable<[Product]>
    let prices: Observable<[Price]>
    let records: Observable<[Record]>
    let expenses: Observable<[Expense]>
    
    fileprivate let øaddedRecords = Variable<[Record]>([])
    fileprivate let øaddedExpenses = Variable<[Expense]>([])
    fileprivate let øuserInfo = Variable<[ConventionUserInfo]>([])

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

        Observable
            .merge(
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
            .bind(to: øuserInfo)
            .disposed(by: disposeBag)

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

        records = Observable
            .combineLatest(
                øconvention
                    .map {
                        $0.records
                            .map { $0.fragments.recordFragment }
                            .filterMap(Record.init(graphQL:))
                    },
                øaddedRecords.asObservable()
            )
            .map { ($0 + $1).sorted { $0.time < $1.time } }

        expenses = Observable
            .combineLatest(
                øconvention
                    .map {
                        $0.expenses
                            .map { $0.fragments.expenseFragment }
                            .filterMap(Expense.init(graphQL:))
                    },
                øaddedExpenses.asObservable()
            )
            .map { ($0 + $1).sorted { $0.time < $1.time } }
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

    func addUserInfo(_ info: String) {
        guard !øuserInfo.value.contains(where: { $0.info == info }) else { return }
        let newInfo = ConventionUserInfo(info: info)
        øuserInfo.value.append(newInfo)
        let _ = ConArtist.API.GraphQL
            .observe(mutation: ContributeConventionInfoMutation(conId: id, info: info))
            .map { $0.addConventionInfo.fragments.userInfoFragment }
            .filterMap(ConventionUserInfo.init(graphQL:))
            .catchError { _ in Observable.empty() }
            .subscribe(onNext: { [øuserInfo] info in
                øuserInfo.value = øuserInfo.value.replace(with: info) { $0.info == info.info }
            })
    }

    func setVote(for info: ConventionUserInfo, to vote: ConventionUserInfo.Vote) {
        let updatedInfo = info.setVote(to: vote)
        let request: Observable<VotesFragment>
        switch vote {
        case .up:
            request = ConArtist.API.GraphQL
                .observe(mutation: UpvoteConventionInfoMutation(infoId: info.id))
                .map { $0.upvoteConventionInfo.fragments.votesFragment }
        case .down:
            request = ConArtist.API.GraphQL
                .observe(mutation: DownvoteConventionInfoMutation(infoId: info.id))
                .map { $0.downvoteConventionInfo.fragments.votesFragment }
        // should not be able to set vote to .none
        case .none: request = Observable.empty()
        }
        øuserInfo.value = øuserInfo.value.replace(with: updatedInfo) { $0.id == info.id }
        let _ = request
            .catchError { _ in Observable.empty() }
            .subscribe(onNext: { [øuserInfo] votes in
                øuserInfo.value = øuserInfo.value.map { info in info.id == updatedInfo.id ? info.adjustVotes(votes) : info }
            })
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
            .catchError { _ in Observable.empty() }
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
