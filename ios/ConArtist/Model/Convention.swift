//
//  Convention.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation
import RxSwift
import RxCocoa

class Convention: Codable {
    private enum CodingKeys: String, CodingKey {
        case id
        case name
        case start
        case end
        case images
        case extraInfo
        case userInfo
        case recordTotal
        case expenseTotal

        case productTypes
        case products
        case prices
        case records
        case expenses

        case addedRecords
        case addedExpenses
        case removedRecords
        case removedExpenses
        case modifiedRecords
        case modifiedExpenses
    }

    let id: Int
    var name: String
    var start: Date
    var end: Date
    var images: [String]
    var extraInfo: [ConventionExtraInfo]
    var userInfo: Observable<[ConventionUserInfo]>

    let productTypes: Observable<[ProductType]>
    let products: Observable<[Product]>
    let prices: Observable<[Price]>
    let records: Observable<[Record]>
    let expenses: Observable<[Expense]>

    fileprivate let øproductTypes = BehaviorRelay<[ProductType]>(value: [])
    fileprivate let øproducts = BehaviorRelay<[Product]>(value: [])
    fileprivate let øprices = BehaviorRelay<[Price]>(value: [])
    fileprivate let ørecords = BehaviorRelay<[Record]>(value: [])
    fileprivate let øexpenses = BehaviorRelay<[Expense]>(value: [])

    var recordTotal: Money?
    var expenseTotal: Money?

    fileprivate let øaddedRecords = BehaviorRelay<[Record]>(value: [])
    fileprivate let ømodifiedRecords = BehaviorRelay<[Record]>(value: [])
    fileprivate let øremovedRecords = BehaviorRelay<[Id]>(value: [])
    fileprivate let øaddedExpenses = BehaviorRelay<[Expense]>(value: [])
    fileprivate let ømodifiedExpenses = BehaviorRelay<[Expense]>(value: [])
    fileprivate let øremovedExpenses = BehaviorRelay<[Id]>(value: [])
    fileprivate let øuserInfo = BehaviorRelay<[ConventionUserInfo]>(value: [])

    fileprivate let øconvention = BehaviorRelay<FullConventionFragment?>(value: nil)

    fileprivate let disposeBag = DisposeBag()

    fileprivate init?(graphQL info: ConventionBasicInfoFragment) {
        guard
            let startDate = info.start.toDate(),
            let endDate = info.end.toDate()
        else { return nil }
        id = info.id
        name = info.name
        start = startDate
        end = endDate
        images = info.images.map { $0.fragments.conventionImageFragment.id }

        productTypes = .empty()
        products = .empty()
        prices = .empty()
        expenses = .empty()
        records = .empty()
        userInfo = øuserInfo.asObservable()

        extraInfo = [.Dates(start, end)] + info.extraInfo
            .map { $0.fragments.extraInfoFragment }
            .compactMap(ConventionExtraInfo.init(graphQL:))

        øuserInfo.accept(info.userInfo
            .map { $0.fragments.userInfoFragment }
            .compactMap(ConventionUserInfo.init(graphQL:)))
    }

    init?(graphQL con: MetaConventionFragment) {
        let info = con.fragments.conventionBasicInfoFragment
        guard
            let startDate = info.start.toDate(),
            let endDate = info.end.toDate()
        else { return nil }
        id = info.id
        name = info.name
        start = startDate
        end = endDate
        images = info.images.map { $0.fragments.conventionImageFragment.id }
        recordTotal = con.recordTotal?.toMoney()
        expenseTotal = con.expenseTotal?.toMoney()
        
        productTypes = øproductTypes.asObservable()
        products = øproducts.asObservable()
        prices = øprices.asObservable()
        userInfo = øuserInfo.asObservable()

        extraInfo = [.Dates(start, end)] + info.extraInfo
            .map { $0.fragments.extraInfoFragment }
            .compactMap(ConventionExtraInfo.init(graphQL:))

        records = Observable
            .combineLatest(
                ørecords.asObservable(),
                øaddedRecords.asObservable(),
                ømodifiedRecords.asObservable()
            )
            .map { records, added, modified in
                (records + added + modified)
                    .sorted { $0.time < $1.time }
            }

        expenses = Observable
            .combineLatest(
                øexpenses.asObservable(),
                øaddedExpenses.asObservable(),
                ømodifiedExpenses.asObservable()
            )
            .map { expenses, added, modified in
                (expenses + added + modified)
                    .sorted { $0.time < $1.time }
            }

        bindObservables()
    }

    private func bindObservables() {
        øconvention
            .asObservable()
            .filterMap(identity)
            .subscribe(onNext: { [
                    øuserInfo,
                    øproductTypes,
                    øproducts,
                    øprices,
                    ørecords,
                    øexpenses,
                    øaddedRecords,
                    øaddedExpenses
                ] convention in
                let info = convention.fragments.metaConventionFragment.fragments.conventionBasicInfoFragment
                øuserInfo.accept(info.userInfo
                    .map{ $0.fragments.userInfoFragment }
                    .compactMap(ConventionUserInfo.init(graphQL:)))

                øproductTypes.accept(convention.productTypes
                    .map { $0.fragments.productTypeFragment }
                    .compactMap(ProductType.init(graphQL:)))

                øproducts.accept(convention.products
                    .map { $0.fragments.productFragment }
                    .compactMap(Product.init(graphQL:)))

                øprices.accept(convention.prices
                    .map { $0.fragments.priceFragment }
                    .compactMap(Price.init(graphQL:)))

                ørecords.accept(convention.records
                    .map { $0.fragments.recordFragment }
                    .compactMap(Record.init(graphQL:)))

                øexpenses.accept(convention.expenses
                    .map { $0.fragments.expenseFragment }
                    .compactMap(Expense.init(graphQL:)))

                let rids = convention.records.map { Id.id($0.fragments.recordFragment.id) }
                øaddedRecords.accept(øaddedRecords.value.filter { !rids.contains($0.id) })
                let eids = convention.expenses.map { Id.id($0.fragments.expenseFragment.id) }
                øaddedExpenses.accept(øaddedExpenses.value.filter { !eids.contains($0.id) })

                ConArtist.Persist.persist()
            })
            .disposed(by: disposeBag)
    }

    func merge(_ con: MetaConventionFragment) {
        guard
            let startDate = con.fragments.conventionBasicInfoFragment.start.toDate(),
            let endDate = con.fragments.conventionBasicInfoFragment.end.toDate()
        else { return }
        name = con.fragments.conventionBasicInfoFragment.name
        start = startDate
        end = endDate
        images = con.fragments.conventionBasicInfoFragment.images
            .map { $0.fragments.conventionImageFragment.id }
        recordTotal = con.recordTotal?.toMoney()
        expenseTotal = con.expenseTotal?.toMoney()
        extraInfo = [.Dates(start, end)] + con.fragments.conventionBasicInfoFragment.extraInfo
            .map { $0.fragments.extraInfoFragment }
            .compactMap(ConventionExtraInfo.init(graphQL:))
        øuserInfo.accept(con.fragments.conventionBasicInfoFragment.userInfo
            .map { $0.fragments.userInfoFragment }
            .compactMap(ConventionUserInfo.init(graphQL:)))
    }

    // MARK: Decodable
    required init(from decoder: Decoder) throws {
        let json = try decoder.container(keyedBy: CodingKeys.self)
        id = try json.decode(Int.self, forKey: .id)
        name = try json.decode(String.self, forKey: .name)
        start = try json.decode(Date.self, forKey: .start)
        end = try json.decode(Date.self, forKey: .end)
        images = try json.decode([String].self, forKey: .images)
        recordTotal = try json.decode(Money?.self, forKey: .recordTotal)
        expenseTotal = try json.decode(Money?.self, forKey: .expenseTotal)
        extraInfo = try json.decode([ConventionExtraInfo].self, forKey: .extraInfo)
        øuserInfo.accept(try json.decode([ConventionUserInfo].self, forKey: .userInfo))
        øproductTypes.accept(try json.decode([ProductType].self, forKey: .productTypes))
        øproducts.accept(try json.decode([Product].self, forKey: .products))
        øprices.accept(try json.decode([Price].self, forKey: .prices))
        ørecords.accept(try json.decode([Record].self, forKey: .records))
        øexpenses.accept(try json.decode([Expense].self, forKey: .expenses))

        productTypes = øproductTypes.asObservable()
        products = øproducts.asObservable()
        prices = øprices.asObservable()
        userInfo = øuserInfo.asObservable()

        records = Observable
            .combineLatest(
                ørecords.asObservable(),
                øaddedRecords.asObservable(),
                øremovedRecords.asObservable()
            )
            .map { records, added, removed in
                (records.filter { record in !removed.contains(record.id) } + added)
                    .sorted { $0.time < $1.time }
            }

        expenses = Observable
            .combineLatest(
                øexpenses.asObservable(),
                øaddedExpenses.asObservable(),
                øremovedExpenses.asObservable()
            )
            .map { expenses, added, removed in
                (expenses.filter { expense in !removed.contains(expense.id) } + added)
                    .sorted { $0.time < $1.time }
            }

        bindObservables()

        let addedRecords = try json.decode([Record].self, forKey: .addedRecords)
        for record in addedRecords {
            _ = addRecord(record, save: false).subscribe()
        }
        let addedExpenses = try json.decode([Expense].self, forKey: .addedExpenses)
        for expense in addedExpenses {
            _ = addExpense(expense, save: false).subscribe()
        }

        let removedRecords = try json.decode([Id].self, forKey: .removedRecords)
        for recordId in removedRecords {
            _ = deleteRecordById(recordId, save: false).subscribe()
        }
        let removedExpenses = try json.decode([Id].self, forKey: .removedExpenses)
        for expenseId in removedExpenses {
            _ = deleteExpenseById(expenseId, save: false).subscribe()
        }

        let modifiedRecords = try json.decode([Record].self, forKey: .modifiedRecords)
        for record in modifiedRecords {
            _ = updateRecord(record, save: false).subscribe()
        }
        let modifiedExpenses = try json.decode([Expense].self, forKey: .modifiedExpenses)
        for expense in modifiedExpenses {
            _ = updateExpense(expense, save: false).subscribe()
        }

        if !addedRecords.isEmpty
            || !addedExpenses.isEmpty
            || !removedRecords.isEmpty
            || !removedExpenses.isEmpty
            || !modifiedRecords.isEmpty
            || !modifiedExpenses.isEmpty {
            _ = fill().subscribe()
        }
    }

    // MARK: Encodable
    func encode(to encoder: Encoder) throws {
        var json = encoder.container(keyedBy: CodingKeys.self)
        try json.encode(id, forKey: .id)
        try json.encode(name, forKey: .name)
        try json.encode(start, forKey: .start)
        try json.encode(end, forKey: .end)
        try json.encode(images, forKey: .images)
        try json.encode(recordTotal, forKey: .recordTotal)
        try json.encode(expenseTotal, forKey: .expenseTotal)
        try json.encode(extraInfo, forKey: .extraInfo)
        try json.encode(øuserInfo.value, forKey: .userInfo)

        try json.encode(øproductTypes.value, forKey: .productTypes)
        try json.encode(øproducts.value, forKey: .products)
        try json.encode(øprices.value, forKey: .prices)
        try json.encode(ørecords.value, forKey: .records)
        try json.encode(øexpenses.value, forKey: .expenses)

        try json.encode(øaddedRecords.value, forKey: .addedRecords)
        try json.encode(øaddedExpenses.value, forKey: .addedExpenses)
        try json.encode(øremovedRecords.value, forKey: .removedRecords)
        try json.encode(øremovedExpenses.value, forKey: .removedExpenses)
        try json.encode(ømodifiedRecords.value, forKey: .modifiedRecords)
        try json.encode(ømodifiedExpenses.value, forKey: .modifiedExpenses)
    }

    // NOTE: moved here so it can be overridden
    func fill(_ force: Bool = false) -> Observable<Void> {
        let doLoad = øconvention.value == nil || force
        if doLoad {
            øconvention.accept(nil)
            return full(force)
                .do(onNext: { [weak self] value in
                    self?.attemptSaveEverything()
                    self?.øconvention.accept(value)
                })
                .asObservable()
                .map { _ in }
        }
        return øconvention
            .asObservable()
            .skip(doLoad ? 1 : 0)
            .filterMap(identity)
            .do(onNext: { [weak self] _ in self?.attemptSaveEverything() })
            .map { _ in }
    }
}

// MARK: - Getters
extension Convention {
    func product(withId id: Int) -> Product? {
        return øconvention
            .value?
            .products
            .first { $0.fragments.productFragment.id == id }
            .map { $0.fragments.productFragment }
            .flatMap(Product.init)
    }

    func productType(withId id: Int) -> ProductType? {
        return øconvention
            .value?
            .productTypes
            .first { $0.fragments.productTypeFragment.id == id }
            .map { $0.fragments.productTypeFragment }
            .flatMap(ProductType.init)
    }

    var isStarted: Bool {
        return start.changeTimeZone(from: TimeZone.UTC, to: .current) <= Date().roundToDay()
    }

    var isEnded: Bool {
        return end.changeTimeZone(from: TimeZone.UTC, to: .current) < Date().roundToDay()
    }
}

// MARK: - Date formatting
extension Convention {
    static var DateFormat: String { return "MMM. d, yyyy"¡ }

    var dateString: String {
        get { return Convention.formatDateRange(start: self.start, end: self.end) }
    }

    static func formatDateRange(start: Date, end: Date) -> String {
        return "{} - {}"¡ % start.toString(Convention.DateFormat, timeZone: .UTC) % end.toString(Convention.DateFormat, timeZone: .UTC)
    }
}

// MARK: - Modifications
extension Convention {
    func addRecord(_ record: Record, save: Bool = true) -> Maybe<Void> {
        guard let recordAdd = record.add(to: self) else {
            return .just(())
        }
        if !øaddedRecords.value.contains(where: { $0.id == record.id }) {
            øaddedRecords.accept(øaddedRecords.value + [record])
        }
        if save {
            ConArtist.Persist.persist()
        }
        return øconvention
            .asObservable()
            .filter { $0 != nil }
            .take(1)
            .asSingle()
            .flatMap { _ in
                ConArtist.API.GraphQL
                    .observe(mutation: AddRecordMutation(record: recordAdd))
            }
            .map { $0.addUserRecord.fragments.recordFragment }
            .filterMap(Record.init(graphQL:))
            .do(onNext: { [øaddedRecords, ørecords] newRecord in
                øaddedRecords.accept(øaddedRecords.value.removingFirst { rec in rec.id == record.id })
                if !ørecords.value.contains(where: { $0.id == newRecord.id }) {
                    ørecords.accept(ørecords.value + [newRecord])
                }
                ConArtist.Persist.persist()
            })
            .map { _ in }
    }

    func updateRecord(_ record: Record, save: Bool = true) -> Maybe<Void> {
        if let existingIndex = øaddedRecords.value.firstIndex(where: { $0.id == record.id }) {
            øaddedRecords.accept(øaddedRecords.value.replace(index: existingIndex, with: record))
            return .just(())
        }
        if let existingIndex = ørecords.value.firstIndex(where: { $0.id == record.id }) {
            ørecords.accept(ørecords.value.removing(at: existingIndex))
        }
        if let existingIndex = ømodifiedRecords.value.firstIndex(where: { $0.id == record.id }) {
            ømodifiedRecords.accept(ømodifiedRecords.value.removing(at: existingIndex))
        }
        ømodifiedRecords.accept(ømodifiedRecords.value + [record])
        if save {
            ConArtist.Persist.persist()
        }

        let request =
            record.modifications == nil
                ? ConArtist.API.GraphQL
                    .observe(mutation: AddRecordMutation(record: record.add(to: self)!))
                    .map { $0.addUserRecord.fragments.recordFragment }
                : ConArtist.API.GraphQL
                    .observe(mutation: UpdateRecordMutation(record: record.modifications!))
                    .map { $0.modUserRecord.fragments.recordFragment }

        return request
            .filterMap(Record.init(graphQL:))
            .map { [ømodifiedRecords, ørecords] updatedRecord in
                ømodifiedRecords.accept(ømodifiedRecords.value.removingFirst(where: { $0.id == record.id }))
                if !ørecords.value.contains(where: { $0.id == updatedRecord.id }) {
                    ørecords.accept(ørecords.value + [updatedRecord])
                }
                ConArtist.Persist.persist()
            }
    }

    func deleteRecord(_ record: Record) -> Maybe<Void> {
        return deleteRecordById(record.id)
    }

    fileprivate func deleteRecordById(_ id: Id, save: Bool = true) -> Maybe<Void> {
        if !øremovedRecords.value.contains(id) {
            øremovedRecords.accept(øremovedRecords.value + [id])
        }
        if øaddedRecords.value.contains(where: { $0.id == id }) {
            øaddedRecords.accept(øaddedRecords.value.removingFirst { $0.id == id })
            // try to not send it. If it already sent and was added that's ok, it will get deleted eventually
            return .just(())
        } else {
            // hide it now... it's probably going to work
            ørecords.accept(ørecords.value.removingFirst { $0.id == id })
        }
        if save {
            ConArtist.Persist.persist()
        }
        return ConArtist.API.GraphQL
            .observe(mutation: DeleteRecordMutation(record: RecordDel(recordId: id.id, uuid: id.uuid?.uuidString)))
            .filterMap { $0.delUserRecord }
            .do(onNext: { [øremovedRecords] _ in
                øremovedRecords.accept(øremovedRecords.value.filter { $0 != id })
                ConArtist.Persist.persist()
            })
            .map { _ in }
    }

    func addExpense(_ expense: Expense, save: Bool = true) -> Maybe<Void> {
        guard let expenseAdd = expense.add(to: self) else {
            return .just(())
        }
        if !øaddedExpenses.value.contains(where: { $0.id == expense.id }) {
            øaddedExpenses.accept(øaddedExpenses.value + [expense])
        }
        if save {
            ConArtist.Persist.persist()
        }
        return øconvention
            .asObservable()
            .filter { $0 != nil }
            .take(1)
            .asSingle()
            .flatMap { _ in
                ConArtist.API.GraphQL
                    .observe(mutation: AddExpenseMutation(expense: expenseAdd))
            }
            .map { $0.addUserExpense.fragments.expenseFragment }
            .filterMap(Expense.init(graphQL:))
            .do(onNext: { [øaddedExpenses, øexpenses] newExpense in
                øaddedExpenses.accept(øaddedExpenses.value.removingFirst { exp in exp.id == expense.id })
                if !øexpenses.value.contains(where: { $0.id == newExpense.id }) {
                    øexpenses.accept(øexpenses.value + [newExpense])
                }
                ConArtist.Persist.persist()
            })
            .map { _ in }
    }

    func updateExpense(_ expense: Expense, save: Bool = true) -> Maybe<Void> {
        if let existingIndex = øaddedExpenses.value.firstIndex(where: { $0.id == expense.id }) {
            øaddedExpenses.accept(øaddedExpenses.value.replace(index: existingIndex, with: expense))
            return .just(())
        }
        if let existingIndex = øexpenses.value.firstIndex(where: { $0.id == expense.id }) {
            øexpenses.accept(øexpenses.value.removing(at: existingIndex))
        }
        if let existingIndex = ømodifiedExpenses.value.firstIndex(where: { $0.id == expense.id }) {
            ømodifiedExpenses.accept(ømodifiedExpenses.value.removing(at: existingIndex))
        }
        ømodifiedExpenses.accept(ømodifiedExpenses.value + [expense])
        if save {
            ConArtist.Persist.persist()
        }
        let request =
            expense.modifications == nil
                ? ConArtist.API.GraphQL
                    .observe(mutation: AddExpenseMutation(expense: expense.add(to: self)!))
                    .map { $0.addUserExpense.fragments.expenseFragment }
                : ConArtist.API.GraphQL
                    .observe(mutation: UpdateExpenseMutation(expense: expense.modifications!))
                    .map { $0.modUserExpense.fragments.expenseFragment }

        return request
            .filterMap(Expense.init(graphQL:))
            .map { [ømodifiedExpenses, øexpenses] updatedExpense in
                ømodifiedExpenses.accept(ømodifiedExpenses.value.removingFirst(where: { $0.id == expense.id }))
                if !øexpenses.value.contains(where: { $0.id == updatedExpense.id }) {
                    øexpenses.accept(øexpenses.value + [updatedExpense])
                }
                ConArtist.Persist.persist()
            }
    }

    func deleteExpense(_ expense: Expense) -> Maybe<Void> {
        return deleteExpenseById(expense.id)
    }

    fileprivate func deleteExpenseById(_ id: Id, save: Bool = true) -> Maybe<Void> {
        if !øremovedExpenses.value.contains(id) {
            øremovedExpenses.accept(øremovedExpenses.value + [id])
        }
        if øaddedExpenses.value.contains(where: { $0.id == id }) {
            øaddedExpenses.accept(øaddedExpenses.value.removingFirst { $0.id == id })
            // try to not send it. If it already sent and was added that's ok, it will get deleted eventually
            return .just(())
        } else {
            // hide it now... it's probably going to work
            øexpenses.accept(øexpenses.value.removingFirst { $0.id == id })
        }
        if save {
            ConArtist.Persist.persist()
        }
        return ConArtist.API.GraphQL
            .observe(mutation: DeleteExpenseMutation(expense: ExpenseDel(expenseId: id.id, uuid: id.uuid?.uuidString)))
            .filterMap { $0.delUserExpense }
            .do(onNext: { [øremovedExpenses] _ in
                øremovedExpenses.accept(øremovedExpenses.value.filter { $0 != id })
                ConArtist.Persist.persist()
            })
            .map { _ in }
    }

    func addUserInfo(_ info: String) {
        guard !øuserInfo.value.contains(where: { $0.info == info }) else { return }
        let newInfo = ConventionUserInfo(info: info)
        let index = øuserInfo.value.count
        øuserInfo.accept(øuserInfo.value + [newInfo])
        _ = ConArtist.API.GraphQL
            .observe(mutation: ContributeConventionInfoMutation(conId: id, info: info))
            .map { $0.addConventionInfo.fragments.userInfoFragment }
            .filterMap(ConventionUserInfo.init(graphQL:))
            .catchError { _ in .empty() }
            .subscribe(onSuccess: { [øuserInfo] info in øuserInfo.accept(øuserInfo.value.replace(index: index, with: info)) })
    }

    func setVote(for info: ConventionUserInfo, to vote: ConventionUserInfo.Vote) {
        let updatedInfo = info.setVote(to: vote)
        let request: Maybe<VotesFragment>
        switch vote {
        case .up:
            request = ConArtist.API.GraphQL
                .observe(mutation: UpvoteConventionInfoMutation(infoId: info.id))
                .map { $0.upvoteConventionInfo.fragments.votesFragment }
                .asMaybe()
        case .down:
            request = ConArtist.API.GraphQL
                .observe(mutation: DownvoteConventionInfoMutation(infoId: info.id))
                .map { $0.downvoteConventionInfo.fragments.votesFragment }
                .asMaybe()
        // should not be able to set vote to .none
        case .none: request = .empty()
        }
        øuserInfo.accept(øuserInfo.value.replace(with: updatedInfo) { $0.id == info.id })
        _ = request
            .catchError { _ in .empty() }
            .subscribe(onSuccess: { [øuserInfo] votes in
                øuserInfo.accept(øuserInfo.value
                    .map { info in
                        info.id == updatedInfo.id
                            ? updatedInfo.adjustVotes(votes)
                            : info
                    })
            })
    }
}

// MARK: - API
extension Convention {
    private func full(_ force: Bool) -> Maybe<FullConventionFragment> {
        return ConArtist.API.GraphQL
            .observe(
                query: FullConventionQuery(userId: nil, conId: id),
                cachePolicy: force ? .fetchIgnoringCacheData : .returnCacheDataElseFetch
            )
            .map { $0.convention.fragments.fullConventionFragment }
            .asMaybe()
            .catchError { _ in .empty() }
    }

    private func attemptSaveEverything() {
        for record in øaddedRecords.value {
            _ = addRecord(record, save: false)
                .subscribe()
        }
        for expense in øaddedExpenses.value {
            _ = addExpense(expense, save: false)
                .subscribe()
        }
        for record in øremovedRecords.value {
            _ = deleteRecordById(record, save: false)
                .subscribe()
        }
        for expense in øremovedExpenses.value {
            _ = deleteExpenseById(expense, save: false)
                .subscribe()
        }
        for record in ømodifiedRecords.value {
            _ = updateRecord(record, save: false)
                .subscribe()
        }
        for expense in ømodifiedExpenses.value {
            _ = updateExpense(expense, save: false)
                .subscribe()
        }
    }
}

class BasicConvention: Convention {
    override init?(graphQL: ConventionBasicInfoFragment) {
        super.init(graphQL: graphQL)
    }

    required init(from decoder: Decoder) throws {
        try super.init(from: decoder)
    }

    override func fill(_ force: Bool) -> Observable<Void> {
        return .just(())
    }
}
