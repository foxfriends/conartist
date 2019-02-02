//
//  RecordsOverviewViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-07.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import RxCocoa

// TODO: this scene needs to be able to load more records when it's in no-convention records mode and at the bottom

class RecordsOverviewViewController : ConArtistViewController {
    fileprivate class Section {
        let date: Date
        let items: [Item]
        var expanded: Bool

        init(date: Date, items: [Item], expanded: Bool) {
            self.date = date
            self.items = items
            self.expanded = expanded
        }

        func toggleExpanded() {
            expanded = !expanded
        }
    }

    fileprivate enum Item {
        case expense(Expense)
        case records([Record])

        var price: Money {
            switch self {
            case .expense(let expense): return -expense.price
            case .records(let records): return records.map { $0.price }.reduce(Money.zero, +)
            }
        }
    }

    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var recordsTableView: UITableView!
    @IBOutlet weak var netProfitLabel: UILabel!
    @IBOutlet weak var netProfitAmountLabel: UILabel!
    @IBOutlet weak var netProfitContainer: UIView!

    fileprivate var convention: Convention?
    fileprivate let sections = BehaviorRelay<[Section]>(value: [])
    var loading = false

    fileprivate let disposeBag = DisposeBag()
    fileprivate let refreshControl = UIRefreshControl()

    var moreToLoad: Bool {
        return convention == nil && (!ConArtist.model.records.value.isEmpty && !ConArtist.model.records.value.isFull)
    }
}

// MARK: - Lifecycle
extension RecordsOverviewViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLocalization()
        setupSubscriptions()
        setupRefreshControl()
        _ = ConArtist.model.loadRecords(fresh: true).subscribe()
        navBar.title = convention?.name ?? "Sales"¡
        netProfitAmountLabel.font = netProfitAmountLabel.font.usingFeatures([.tabularFigures])
    }

    private func setupRefreshControl() {
        recordsTableView.refreshControl = refreshControl
        refreshControl.rx.controlEvent([.valueChanged])
            .flatMapLatest { [convention] _ -> Observable<Void> in
                if let convention = convention {
                    return convention.fill(true).discard()
                } else {
                    return ConArtist.model.loadRecords(fresh: true).discard()
                }
            }
            .subscribe(onNext: { [refreshControl] in refreshControl.endRefreshing() })
            .disposed(by: disposeBag)
    }
}

// MARK: - Localization
extension RecordsOverviewViewController {
    fileprivate func setupLocalization() {
        navBar.leftButtonTitle = "Back"¡
        netProfitLabel.text = "Net profit"¡
    }
}

// MARK: - Subscriptions
extension RecordsOverviewViewController {
    fileprivate enum ItemType {
        case expense(Expense)
        case record(Record)

        var isExpense: Bool {
            if case .expense = self { return true }
            return false
        }

        var record: Record? {
            switch self {
            case .record(let record): return record
            default: return nil
            }
        }

        var time: Date {
            switch self {
            case .expense(let expense): return expense.time
            case .record(let record):   return record.time
            }
        }

        var price: Money {
            switch self {
            case .expense(let expense): return -expense.price
            case .record(let record):   return record.price
            }
        }
    }

    fileprivate func setupSubscriptions() {
        let items: Observable<[ItemType]>
        if let convention = convention {
            items = Observable
                .combineLatest(
                    convention.expenses.map { $0.map { .expense($0) } },
                    convention.records.map { $0.map { .record($0) } }
                )
                .map { (expenses: [ItemType], records: [ItemType]) -> [ItemType] in expenses + records }
                .share()
        } else {
            items = ConArtist.model.records
                .map { $0.nodes.map { .record($0) } }
                .share()
        }

        items
            .map { [sections] (items: [ItemType]) -> [Section] in
                items
                    .sorted { $0.time < $1.time }
                    .split { $0.time.roundToDay() < $1.time.roundToDay() }
                    .map { items in items.split { $0.isExpense || $1.isExpense } }
                    .enumerated()
                    .map { (index: Int, itemss: [[ItemType]]) -> Section in
                        let date = itemss.first!.first!.time.roundToDay()
                        let items = itemss.map { (items: [ItemType]) -> Item in
                            switch items.first! {
                            case .expense(let expense): return .expense(expense)
                            case .record: return .records(items.map { $0.record! })
                            }
                        }
                        return Section(
                            date: date,
                            items: items,
                            expanded: sections.value.nth(index)?.expanded ?? true
                        )
                    }
            }
            .bind(to: sections)
            .disposed(by: disposeBag)

        items
            .map { $0.map { $0.price } }
            .map { $0.reduce(Money.zero, +) }
            .map { $0.toString() }
            .asDriver(onErrorJustReturn: "")
            .drive(netProfitAmountLabel.rx.text)
            .disposed(by: disposeBag)

        sections
            .asDriver()
            .drive(onNext: { [recordsTableView] sections in recordsTableView?.reloadData() })
            .disposed(by: disposeBag)

        sections.asDriver()
            .map { $0.isEmpty }
            .drive(netProfitContainer.rx.isHidden)
            .disposed(by: disposeBag)

        navBar.leftButton.rx.tap
            .subscribe(onNext: { ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension RecordsOverviewViewController: UITableViewDataSource {
    fileprivate func section(at section: Int) -> Section? {
        return sections.value.nth(section)
    }

    fileprivate func item(for indexPath: IndexPath) -> Item? {
        return section(at: indexPath.section)?.items.nth(indexPath.row)
    }

    func numberOfSections(in tableView: UITableView) -> Int {
        return max(sections.value.count, 1) + (moreToLoad ? 1 : 0)
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        guard let section = self.section(at: section) else { return 1 }
        return section.expanded ? section.items.count : 0
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let item = item(for: indexPath) else {
            if sections.value.isEmpty {
                let cell = tableView.dequeueReusableCell(withIdentifier: EmptyStateTableViewCell.ID, for: indexPath) as! EmptyStateTableViewCell
                if convention == nil {
                    cell.setup(text: "<Empty no-con records list message>"¡)
                } else {
                    cell.setup(text: "<Empty records list message>"¡)
                }
                return cell
            } else {
                return tableView.dequeueReusableCell(withIdentifier: LoadingTableViewCell.ID, for: indexPath)
            }
        }
        switch item {
        case .expense(let expense):
            let cell = tableView.dequeueReusableCell(withIdentifier: ExpenseTableViewCell.ID, for: indexPath) as! ExpenseTableViewCell
            cell.setup(for: expense)
            return cell
        case .records(let records):
            let cell = tableView.dequeueReusableCell(withIdentifier: RecordSummaryTableViewCell.ID, for: indexPath) as! RecordSummaryTableViewCell
            cell.setup(for: item.price, and: records.count)
            return cell
        }
    }

    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        if cell is LoadingTableViewCell && !loading {
            loading = true
            ConArtist.model.loadRecords()
                .subscribe(onNext: { [unowned self] _ in self.loading = false })
                .disposed(by: disposeBag)
        }
    }
}

// MARK: - UITableViewDelegate
extension RecordsOverviewViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard let item = item(for: indexPath) else { return }
        switch item {
        case .records(let records):
            RecordListViewController.show(for: convention, after: records.first!.time, before: records.last!.time)
        case .expense(let expense):
            // NOTE: expenses only occur in conventions, so this unwrap should be safe
            // Remember to deal with it if expenses are ever allowed in non-conventions
            ExpenseDetailsOverlayViewController.show(for: expense, in: convention!)
        }
    }

    func tableView(_ tableView: UITableView, didHighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = true
    }

    func tableView(_ tableView: UITableView, didUnhighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = false
    }

    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 50
    }

    func tableView(_ tableView: UITableView, viewForHeaderInSection sectionNumber: Int) -> UIView? {
        guard let section = self.section(at: sectionNumber) else { return nil }
        let view = RecordsOverviewDateHeaderView()
        view.setup(for: section.date, expanded: section.expanded) { [weak self] in
            self?.toggleSectionExpanded(sectionNumber)
        }
        return view
    }

    func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return 50
    }

    func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {
        guard let total = self.section(at: section)?.items.map({ $0.price }).reduce(Money.zero, +) else { return nil }
        let view = RecordsOverviewTotalFooterView()
        view.setup(with: total)
        return view
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        guard !sections.value.isEmpty else { // empty state cell is auto
            return UITableView.automaticDimension
        }
        // the rest all 50
        return 50
    }

    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        guard case .expense(let expense)? = item(for: indexPath) else { return UISwipeActionsConfiguration(actions: []) }
        var actions: [UIContextualAction] = []
        if convention?.isEnded != true {
            let deleteAction = UIContextualAction(style: .normal, title: "Delete"¡) { [convention] _, _, reset in
                let _ = convention?.deleteExpense(expense).subscribe()
                reset(true)
            }
            deleteAction.backgroundColor = .warn
            actions.append(deleteAction)
        }
        let config = UISwipeActionsConfiguration(actions: actions)
        config.performsFirstActionWithFullSwipe = false
        return config
    }

    private func toggleSectionExpanded(_ index: Int) {
        sections.value[index].toggleExpanded()
        recordsTableView.reloadSections(IndexSet(integer: index), with: .automatic)
    }
}

// MARK: - Navigation
extension RecordsOverviewViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .records
    static let ID = "RecordsOverview"

    static func show(for convention: Convention? = nil) {
        let controller = instantiate()
        controller.convention = convention
        ConArtist.model.navigate(push: controller)
    }
}
