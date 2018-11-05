//
//  ConventionListViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Strongbox
import Foundation
import RxSwift
import RxCocoa

class ConventionListViewController : ConArtistViewController {
    static let MaxConventionsPerSection = 2
    enum Section {
        case past
        case pastEmpty
        case present
        case presentEmpty
        case future
        case futureEmpty

        var cellIdentifier: String {
            switch self {
            case .presentEmpty: return "NothingTodayConventionCell"
            case .pastEmpty:    return "NothingCompletedConventionCell"
            case .futureEmpty:  return "NothingUpcomingConventionCell"
            case .past:         return "ConventionCell"
            case .present:      return "TodayConventionCell"
            case .future:       return "FutureConventionCell"
            }
        }

        var title: String {
            switch self {
            case .present, .presentEmpty:   return "Today"¡
            case .past, .pastEmpty:         return "Completed"¡
            case .future, .futureEmpty:     return "Upcoming"¡
            }
        }

        var cellHeight: CGFloat {
            switch self {
            case .present,
                 .presentEmpty,
                 .pastEmpty,
                 .futureEmpty:  return 90
            case .past,
                 .future:       return 60
            }
        }

        var empty: Section {
            switch self {
            case .past, .pastEmpty:         return .pastEmpty
            case .present, .presentEmpty:   return .presentEmpty
            case .future, .futureEmpty:     return .futureEmpty
            }
        }
    }

    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var conventionsTableView: UITableView!

    fileprivate let conventions = ConArtist.model.conventions
    fileprivate let sections = BehaviorRelay<[Section]>(value: [])
    fileprivate let disposeBag = DisposeBag()

    fileprivate var present: [Convention] = []
    fileprivate var past: [Convention] = []
    fileprivate var future: [Convention] = []
    fileprivate var sectionTitles: [String] = []

    fileprivate let refreshControl = UIRefreshControl()
}

// MARK: - Settings
extension ConventionListViewController {
    fileprivate func openSettings() {
        SettingsViewController.show()
    }
}

// MARK: - Lifecycle
extension ConventionListViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLocalization()
        setupSubscriptions()
        setupRefreshControl()
    }

    private func setupRefreshControl() {
        conventionsTableView.refreshControl = refreshControl
        refreshControl.rx.controlEvent([.valueChanged])
            .flatMapLatest { ConArtist.API.GraphQL.observe(query: FullUserQuery(), cachePolicy: .fetchIgnoringCacheData) }
            .observeOn(MainScheduler.instance)
            .map{ $0.user.fragments.fullUserFragment }
            .subscribe(onNext: { [refreshControl] fragment in
                refreshControl.endRefreshing()
                ConArtist.model.merge(graphQL: fragment)
            })
            .disposed(by: disposeBag)
    }
}

// MARK: - Localization
extension ConventionListViewController {
    fileprivate func setupLocalization() {
        navBar.title = "Conventions"¡
        navBar.rightButtonTitle = "Settings"¡
    }
}

// MARK: - Subscriptions
extension ConventionListViewController {
    fileprivate func setupSubscriptions() {
        let conventions = self.conventions
            .asObservable()
            .share(replay: 1)
        let past = conventions
            .map { cons in cons.filter { $0.end < Date.today() } }
            .map { cons in cons.sorted { $0.start > $1.start } }
        let present = conventions
            .map { cons in cons.filter { $0.start <= Date.today() && $0.end >= Date.today() } }
        let future = conventions
            .map { cons in cons.filter { $0.start > Date.today() } }
            .map { cons in cons.sorted { $0.start < $1.start } }

        past.subscribe(onNext: { [weak self] in self?.past = $0 }).disposed(by: disposeBag)
        future.subscribe(onNext: { [weak self] in self?.future = $0 }).disposed(by: disposeBag)
        present.subscribe(onNext: { [weak self] in self?.present = $0 }).disposed(by: disposeBag)

        // Always fill today's conventions
        present
            .subscribe(onNext: { cons in cons.forEach { let _ = $0.fill() } })
            .disposed(by: disposeBag)

        Observable.combineLatest([present, future, past])
            .map { $0.map { conventions in conventions.isEmpty } }
            .map { empty in zip(empty, [Section.present, .future, .past]) }
            .map { sections in sections.map { empty, section in empty ? section.empty : section } }
            .bind(to: sections)
            .disposed(by: disposeBag)

        sections
            .asDriver()
            .drive(onNext: { [weak self] sections in
                self?.sectionTitles = sections.map { $0.title }
                self?.conventionsTableView.reloadData()
            })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .subscribe(onNext: { [unowned self] _ in self.openSettings() })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension ConventionListViewController: UITableViewDataSource {
    fileprivate func conventions(for section: Section) -> [Convention] {
        switch section {
        case .presentEmpty,
             .pastEmpty,
             .futureEmpty:  return []
        case .present:      return present
        case .past:         return past
        case .future:       return future
        }
    }

    func numberOfSections(in tableView: UITableView) -> Int {
        return sectionTitles.count
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        guard let section = sections.value.nth(section) else { return 0 }
        return min(ConventionListViewController.MaxConventionsPerSection, max(conventions(for: section).count, 1))
    }

    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return sectionTitles.nth(section)
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if let section = sections.value.nth(indexPath.section) {
            let cell = tableView.dequeueReusableCell(withIdentifier: section.cellIdentifier, for: indexPath) as! ConventionTableViewCell
            if let convention = conventions(for: section).nth(indexPath.row) {
                cell.fill(with: convention)
            } else {
                cell.emptyState(for: section)
            }
            return cell
        }
        return UITableViewCell()
    }
}

// MARK: - UITableViewDelegate
extension ConventionListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard
            let section = sections.value.nth(indexPath.section),
            let convention = conventions(for: section).nth(indexPath.row)
        else { return }
        ConventionDetailsViewController.show(for: convention)
    }

    func tableView(_ tableView: UITableView, didHighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = true
    }

    func tableView(_ tableView: UITableView, didUnhighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = false
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        guard let section = sections.value.nth(indexPath.section) else { return 0 }
        return section.cellHeight
    }

    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        guard let title = self.tableView(tableView, titleForHeaderInSection: section) else { return nil }
        let conCount = sections.value.nth(section).map(conventions(for:))?.count ?? 0
        let conventions = sections.asObservable()
            .map { sections in sections.nth(section) }
            .map { [unowned self] section in self.conventions(for: section!) }
        let showMore = conCount > ConventionListViewController.MaxConventionsPerSection
        let headerView = TableHeaderView(title: title, showBar: section != 0, showMore: showMore)
        headerView.rx.seeAll
            .subscribe(onNext: { _ in
                AllConventionsListViewController.show(conventions: conventions)
            })
            .disposed(by: headerView.disposeBag)
        return headerView
    }
}

// MARK: - Navigation
extension ConventionListViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .main
    static let ID = "ConventionList"

    static func show(animated: Bool = true) {
        let controller = instantiate()
        if animated {
            ConArtist.model.navigate(push: controller)
        } else {
            ConArtist.model.navigate(replace: controller)
        }
    }
}
