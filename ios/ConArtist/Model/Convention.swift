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

    let recordTotal: Money?
    let expenseTotal: Money?

    fileprivate let øaddedRecords = Variable<[Record]>([])
    fileprivate let øremovedRecords = Variable<[Int]>([])
    fileprivate let øaddedExpenses = Variable<[Expense]>([])
    fileprivate let øremovedExpenses = Variable<[Int]>([])
    fileprivate let øuserInfo = Variable<[ConventionUserInfo]>([])

    fileprivate let øconvention = Variable<FullConventionFragment?>(nil)

    fileprivate let disposeBag = DisposeBag()

    init?(graphQL con: MetaConventionFragment) {
        guard
            let startDate = con.start.toDate(),
            let endDate = con.end.toDate()
        else { return nil }
        print(con)
        id = con.id
        name = con.name
        start = startDate
        end = endDate
        images = con.images.map { $0.fragments.conventionImageFragment.id }
        recordTotal = con.recordTotal?.toMoney()
        expenseTotal = con.expenseTotal?.toMoney()

        let øconvention = self.øconvention.asObservable().filterMap(identity)

        extraInfo = [.Dates(start, end)] + con.extraInfo
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
                    .map { $0.fragments.priceFragment }
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
                øaddedRecords.asObservable(),
                øremovedRecords.asObservable()
            )
            .map { records, added, removed in
                (records.filter { record in !removed.contains(record.id) } + added)
                    .sorted { $0.time < $1.time }
            }

        expenses = Observable
            .combineLatest(
                øconvention
                    .map {
                        $0.expenses
                            .map { $0.fragments.expenseFragment }
                            .filterMap(Expense.init(graphQL:))
                    },
                øaddedExpenses.asObservable(),
                øremovedExpenses.asObservable()
            )
            .map { expenses, added, removed in
                (expenses.filter { expense in !removed.contains(expense.id) } + added)
                    .sorted { $0.time < $1.time }
            }
    }
}

// MARK: - Getters
extension Convention {
    func product(withId id: Int) -> Product? {
        return øconvention
            .value?
            .products
            .first { $0.id == id }
            .map { $0.fragments.productFragment }
            .flatMap(Product.init)
    }

    func productType(withId id: Int) -> ProductType? {
        return øconvention
            .value?
            .productTypes
            .first { $0.id == id }
            .map { $0.fragments.productTypeFragment }
            .flatMap(ProductType.init)
    }

    var isStarted: Bool {
        return start.roundToDay() <= Date().roundToDay()
    }

    var isEnded: Bool {
        return end.roundToDay() < Date().roundToDay()
    }
}

// MARK: - Date formatting
extension Convention {
    static var DateFormat: String { return "MMM. d, yyyy"¡ }

    var dateString: String {
        get { return Convention.formatDateRange(start: self.start, end: self.end) }
    }

    static func formatDateRange(start: Date, end: Date) -> String {
        return "{} - {}"¡ % start.toString(Convention.DateFormat) % end.toString(Convention.DateFormat)
    }
}

// MARK: - Modifications
extension Convention {
    func addRecord(_ record: Record) -> Observable<Void> {
        let index = øaddedRecords.value.count
        øaddedRecords.value.append(record)
        return ConArtist.API.GraphQL
            .observe(mutation: AddRecordMutation(record: record.add(to: self)))
            .map { $0.addUserRecord.fragments.recordFragment }
            .filterMap(Record.init(graphQL:))
            .map { [øaddedRecords] in øaddedRecords.value[index] = $0 }
    }

    func updateRecord(_ record: Record) -> Observable<Void> {
        øremovedRecords.value.append(record.id)
        let index: Int
        if let existingIndex = øaddedRecords.value.index(where: { $0.id == record.id }) {
            index = existingIndex
            øaddedRecords.value[index] = record
        } else {
            index = øaddedRecords.value.count
            øaddedRecords.value.append(record)
        }
        return ConArtist.API.GraphQL
            .observe(mutation: UpdateRecordMutation(record: record.modifications))
            .map { $0.modUserRecord.fragments.recordFragment }
            .filterMap(Record.init(graphQL:))
            .map { [øaddedRecords] in øaddedRecords.value[index] = $0 }
    }

    func deleteRecord(_ record: Record) -> Observable<Void> {
        if øaddedRecords.value.contains(where: { $0.id == record.id }) {
            øaddedRecords.value.removeFirst { $0.id == record.id }
            return Observable.just(())
        } else {
            øremovedRecords.value.append(record.id)
            return ConArtist.API.GraphQL
                .observe(mutation: DeleteRecordMutation(record: RecordDel(recordId: record.id)))
                .map { $0.delUserRecord }
                .filter(identity)
                .discard()
        }
    }

    func addExpense(_ expense: Expense) -> Observable<Void> {
        let index = øaddedExpenses.value.count
        øaddedExpenses.value.append(expense)
        return ConArtist.API.GraphQL
            .observe(mutation: AddExpenseMutation(expense: expense.add(to: self)))
            .map { $0.addUserExpense.fragments.expenseFragment }
            .filterMap(Expense.init(graphQL:))
            .map { [øaddedExpenses] in øaddedExpenses.value[index] = $0 }
    }

    func updateExpense(_ expense: Expense) -> Observable<Void> {
        øremovedExpenses.value.append(expense.id)
        let index: Int
        if let existingIndex = øaddedExpenses.value.index(where: { $0.id == expense.id }) {
            index = existingIndex
            øaddedExpenses.value[index] = expense
        } else {
            index = øaddedExpenses.value.count
            øaddedExpenses.value.append(expense)
        }
        return ConArtist.API.GraphQL
            .observe(mutation: UpdateExpenseMutation(expense: expense.modifications))
            .map { $0.modUserExpense.fragments.expenseFragment }
            .filterMap(Expense.init(graphQL:))
            .map { [øaddedExpenses] in øaddedExpenses.value[index] = $0 }
    }

    func deleteExpense(_ expense: Expense) -> Observable<Void> {
        if øaddedExpenses.value.contains(where: { $0.id == expense.id }) {
            øaddedExpenses.value.removeFirst { $0.id == expense.id }
            return Observable.just(())
        } else {
            øremovedExpenses.value.append(expense.id)
            return ConArtist.API.GraphQL
                .observe(mutation: DeleteExpenseMutation(expense: ExpenseDel(expenseId: expense.id)))
                .map { $0.delUserExpense }
                .filter(identity)
                .discard()
        }
    }

    func addUserInfo(_ info: String) {
        guard !øuserInfo.value.contains(where: { $0.info == info }) else { return }
        let newInfo = ConventionUserInfo(info: info)
        let index = øuserInfo.value.count
        øuserInfo.value.append(newInfo)
        let _ = ConArtist.API.GraphQL
            .observe(mutation: ContributeConventionInfoMutation(conId: id, info: info))
            .map { $0.addConventionInfo.fragments.userInfoFragment }
            .filterMap(ConventionUserInfo.init(graphQL:))
            .catchError { _ in Observable.empty() }
            .subscribe(onNext: { [øuserInfo] info in øuserInfo.value[index] = info })
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

//    func save() -> Observable<Bool> {
//        let records: Observable<[Error?]> = øaddedRecords.value.isEmpty
//            ? Observable.just([])
//            : Observable.zip(
//                øaddedRecords.value
//                    .map { record in record.add(to: self) }
//                    .map {
//                        ConArtist.API.GraphQL.observe(mutation: AddRecordMutation(record: $0))
//                            .map(const(nil as Error?))
//                            .catchError { Observable.just($0) }
//                    }
//            )
//
//        let deletedRecords: Observable<[Error?]> = øremovedRecords.value.isEmpty
//            ? Observable.just([])
//            : Observable.zip(
//                øremovedRecords.value
//                    .map(RecordDel.init)
//                    .map {
//                        ConArtist.API.GraphQL.observe(mutation: DeleteRecordMutation(record: $0))
//                            .map(const(nil as Error?))
//                            .catchError { Observable.just($0) }
//                    }
//            )
//
//        let expenses: Observable<[Error?]> = øaddedExpenses.value.isEmpty
//            ? Observable.just([])
//            : Observable.zip(
//                øaddedExpenses.value
//                    .map { expense in expense.add(to: self) }
//                    .map {
//                        ConArtist.API.GraphQL.observe(mutation: AddExpenseMutation(expense: $0))
//                            .map(const(nil as Error?))
//                            .catchError { Observable.just($0) }
//                    }
//            )
//
//        return Observable.zip(records, expenses)
//            .map { [weak self] errors in
//                guard let `self` = self else { return }
//                let (recordErrors, expenseErrors) = errors
//                var allErrors: [Error] = []
//                self.øaddedRecords.value = zip(self.øaddedRecords.value, recordErrors)
//                    .filterMap { record, error in
//                        if let error = error {
//                            allErrors.append(error)
//                            return record
//                        }
//                        return nil
//                    }
//                self.øaddedExpenses.value = zip(self.øaddedExpenses.value, expenseErrors).filterMap { expense, error in
//                    if let error = error {
//                        allErrors.append(error)
//                        return expense
//                    }
//                    return nil
//                }
//                if !allErrors.isEmpty {
//                    throw Convention.SaveErrors(errors: allErrors)
//                }
//            }
//            .flatMap({ [weak self] in self?.fill(true) ?? Observable.empty() })
//            .map(const(true))
//    }
}
