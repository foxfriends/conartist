//
//  RecordsOverviewViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-07.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class RecordsOverviewViewController: UIViewController {
    fileprivate struct Section {
        let date: Date
        let items: [Item]
        let expanded: Bool

        func toggleExpanded() -> Section {
            return Section(
                date: date,
                items: items,
                expanded: !expanded
            )
        }
    }

    fileprivate enum Item {
        case Expense(Expense)
        case Records([Record])

        var price: Money {
            switch self {
            case .Expense(let expense): return -expense.price
            case .Records(let records): return records.map { $0.price }.reduce(Money.zero, +)
            }
        }
    }

    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var recordsTableView: UITableView!
    @IBOutlet weak var netProfitLabel: UILabel!
    @IBOutlet weak var netProfitAmountLabel: UILabel!

    fileprivate var convention: Convention!
    fileprivate let øsections = Variable<[Section]>([])

    fileprivate let disposeBag = DisposeBag()
    fileprivate let refreshControl = UIRefreshControl()
}

// MARK: - Lifecycle
extension RecordsOverviewViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLocalization()
        setupSubscriptions()
        setupRefreshControl()
        navBar.title = convention.name
        netProfitAmountLabel.font = netProfitAmountLabel.font.usingFeatures([.tabularFigures])
    }

    private func setupRefreshControl() {
        recordsTableView.refreshControl = refreshControl
        refreshControl.addTarget(self, action: #selector(reloadConvention), for: .valueChanged)
    }

    @objc private func reloadConvention() {
        let _ = convention
            .fill(true)
            .subscribe { [refreshControl] _ in refreshControl.endRefreshing() }
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
        case Expense(Expense)
        case Record(Record)

        var isExpense: Bool {
            if case .Expense = self { return true }
            return false
        }

        var record: Record? {
            switch self {
            case .Record(let record): return record
            default: return nil
            }
        }

        var time: Date {
            switch self {
            case .Expense(let expense): return expense.time
            case .Record(let record):   return record.time
            }
        }

        var price: Money {
            switch self {
            case .Expense(let expense): return -expense.price
            case .Record(let record):   return record.price
            }
        }
    }

    fileprivate func setupSubscriptions() {
        // NOTE: this expression is 'very complex'... too much so for the Swift compiler to really work out sometimes,
        //       so I've put type annotations in to hopefully make it easier
        let øitems = Observable
            .combineLatest(
                convention.expenses.map { $0.map { ItemType.Expense($0) } },
                convention.records.map { $0.map { ItemType.Record($0) } }
            )
            .map { (expenses: [ItemType], records: [ItemType]) -> [ItemType] in expenses + records }

        øitems
            .map { (items: [ItemType]) -> [ItemType] in items.sorted { $0.time < $1.time } }
            .map { (items: [ItemType]) -> [[ItemType]] in items.split { $0.time.roundToDay() < $1.time.roundToDay() } }
            .map { (itemss: [[ItemType]]) -> [[[ItemType]]] in itemss.map { (items: [ItemType]) -> [[ItemType]] in items.split { $0.isExpense || $1.isExpense } } }
            .map { [øsections] (itemsss: [[[ItemType]]]) -> [Section] in
                itemsss.enumerated().map { (index: Int, itemss: [[ItemType]]) -> Section in
                    let date = itemss.first!.first!.time.roundToDay()
                    let items = itemss.map { (items: [ItemType]) -> Item in
                        switch items.first! {
                        case .Expense(let expense): return .Expense(expense)
                        case .Record: return .Records(items.map { $0.record! })
                        }
                    }
                    return Section(date: date, items: items, expanded: øsections.value.nth(index)?.expanded ?? true)
                }
            }
            .bind(to: øsections)
            .disposed(by: disposeBag)

        øitems
            .map { $0.map { $0.price } }
            .map { $0.reduce(Money.zero, +) }
            .map { $0.toString() }
            .asDriver(onErrorJustReturn: "")
            .drive(netProfitAmountLabel.rx.text)
            .disposed(by: disposeBag)

        øsections
            .asDriver()
            .drive(onNext: { [recordsTableView] _ in recordsTableView?.reloadData() })
            .disposed(by: disposeBag)

        navBar.leftButton.rx.tap
            .subscribe(onNext: { ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension RecordsOverviewViewController: UITableViewDataSource {
    fileprivate func section(at section: Int) -> Section? {
        return øsections.value.nth(section)
    }

    fileprivate func item(for indexPath: IndexPath) -> Item? {
        return section(at: indexPath.section)?.items.nth(indexPath.row)
    }

    func numberOfSections(in tableView: UITableView) -> Int {
        return øsections.value.count
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        guard let section = self.section(at: section) else { return 0 }
        return section.expanded ? section.items.count : 0
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let item = item(for: indexPath) else { fatalError("Item for records table is missing!") }
        switch item {
        case .Expense(let expense):
            let cell = tableView.dequeueReusableCell(withIdentifier: ExpenseTableViewCell.ID, for: indexPath) as! ExpenseTableViewCell
            cell.setup(for: expense)
            return cell
        case .Records(let records):
            let cell = tableView.dequeueReusableCell(withIdentifier: RecordSummaryTableViewCell.ID, for: indexPath) as! RecordSummaryTableViewCell
            cell.setup(for: item.price, and: records.count)
            return cell
        }
    }
}

// MARK: - UITableViewDelegate
extension RecordsOverviewViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard let item = item(for: indexPath) else { return }
        switch item {
        case .Records(let records):
            RecordListViewController.show(for: convention, after: records.first!.time, before: records.last!.time)
        case .Expense(let expense):
            ExpenseDetailsOverlayViewController.show(for: expense, in: convention)
        }
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

    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        guard case .Expense(let expense)? = item(for: indexPath) else { return UISwipeActionsConfiguration(actions: []) }
        var actions: [UIContextualAction] = []
        if !convention.isEnded {
            let deleteAction = UIContextualAction(style: .normal, title: "Delete"¡) { [convention] _, _, reset in
                let _ = convention?.deleteExpense(expense).subscribe()
                reset(true)
            }
            deleteAction.backgroundColor = ConArtist.Color.Warn
            actions.append(deleteAction)
        }
        let config = UISwipeActionsConfiguration(actions: actions)
        config.performsFirstActionWithFullSwipe = false
        return config
    }

    private func toggleSectionExpanded(_ index: Int) {
        øsections.value = øsections.value
            .enumerated()
            .map { i, section in i == index ? section.toggleExpanded() : section }
    }
}

// MARK: - Navigation
extension RecordsOverviewViewController: ViewControllerNavigation {
    static let StoryboardName = "Records"
    static let ID = "RecordsOverview"

    static func show(for convention: Convention) {
        let controller = instantiate()
        controller.convention = convention
        ConArtist.model.navigate(push: controller)
    }
}
