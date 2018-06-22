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

class ConventionListViewController: UIViewController {
    static let MaxConventionsPerSection = 2
    enum Section {
        case Past
        case PastEmpty
        case Present
        case PresentEmpty
        case Future
        case FutureEmpty

        var cellIdentifier: String {
            switch self {
            case .PresentEmpty: return "NothingTodayConventionCell"
            case .PastEmpty:    return "NothingCompletedConventionCell"
            case .FutureEmpty:  return "NothingUpcomingConventionCell"
            case .Past:         return "ConventionCell"
            case .Present:      return "TodayConventionCell"
            case .Future:       return "FutureConventionCell"
            }
        }

        var title: String {
            switch self {
            case .Present, .PresentEmpty:   return "Today"¡
            case .Past, .PastEmpty:         return "Completed"¡
            case .Future, .FutureEmpty:     return "Upcoming"¡
            }
        }

        var cellHeight: CGFloat {
            switch self {
            case .Present,
                 .PresentEmpty,
                 .PastEmpty,
                 .FutureEmpty:  return 90
            case .Past,
                 .Future:       return 60
            }
        }

        var empty: Section {
            switch self {
            case .Past, .PastEmpty:         return .PastEmpty
            case .Present, .PresentEmpty:   return .PresentEmpty
            case .Future, .FutureEmpty:     return .FutureEmpty
            }
        }
    }

    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var conventionsTableView: UITableView!

    fileprivate let øconventions = ConArtist.model.conventions
    fileprivate let øsections = Variable<[Section]>([])
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
        let øcurrency = Variable(ConArtist.model.settings.value.currency.rawValue)
        let settings = [
            SettingsViewController.Group(
                title: "General"¡,
                items: [
                    .Select("Currency"¡, øcurrency, CurrencyCode.variants.map { $0.rawValue })
                ]
            ),
            SettingsViewController.Group(
                title: "Support"¡,
                items: [
                    .Action("Sign out"¡, signOut),
                    .Action("Report a bug/Request a feature"¡, contactSupport),
                    .Action("Help"¡, showHelp)
                ]
            ),
        ]
        SettingsViewController.show(for: settings)
    }

    private func signOut() {
        ConArtist.model.navigate(backTo: SignInViewController.self)
        ConArtist.API.Auth.authToken = ConArtist.API.Auth.Unauthorized
        ConArtist.model.clear()
    }

    private func contactSupport() {
        // TODO: make a contact page
    }

    private func showHelp() {
        // TODO: make a help page
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
        self.conventionsTableView.refreshControl = refreshControl
        refreshControl.addTarget(self, action: #selector(reloadModel), for: .valueChanged)
    }

    @objc private func reloadModel() {
        let _ = ConArtist.API.GraphQL
            .observe(query: UserQuery(), cachePolicy: .fetchIgnoringCacheData)
            .map{ $0.user.fragments.userFragment }
            .do { [weak self] in self?.refreshControl.endRefreshing() }
            .subscribe(onNext: ConArtist.model.merge)
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
        let øpast = øconventions.asObservable().map { cons in cons.filter { $0.end < Date.today() } }
        let øpresent = øconventions.asObservable().map { cons in cons.filter { $0.start <= Date.today() && $0.end >= Date.today() } }
        let øfuture = øconventions.asObservable().map { cons in cons.filter { $0.start > Date.today() } }

        øpast.subscribe(onNext: { [weak self] in self?.past = $0 }).disposed(by: disposeBag)
        øfuture.subscribe(onNext: { [weak self] in self?.future = $0 }).disposed(by: disposeBag)
        øpresent.subscribe(onNext: { [weak self] in self?.present = $0 }).disposed(by: disposeBag)

        // Always fill today's conventions
        øpresent.subscribe(onNext: { cons in cons.forEach { let _ = $0.fill() } }).disposed(by: disposeBag)

        Observable.combineLatest([øpresent, øfuture, øpast])
            .map { conventionss in conventionss.map { conventions in conventions.isEmpty } }
            .map { empty in zip(empty, [Section.Present, .Future, .Past]) }
            .map { sections in sections.map { empty, section in empty ? section.empty : section } }
            .bind(to: øsections)
            .disposed(by: disposeBag)

        øsections
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
        case .PresentEmpty,
             .PastEmpty,
             .FutureEmpty:  return []
        case .Present:      return present
        case .Past:         return past
        case .Future:       return future
        }
    }

    func numberOfSections(in tableView: UITableView) -> Int {
        return sectionTitles.count
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        guard let section = øsections.value.nth(section) else { return 0 }
        return min(ConventionListViewController.MaxConventionsPerSection, max(conventions(for: section).count, 1))
    }

    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return sectionTitles.nth(section)
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if let section = øsections.value.nth(indexPath.section) {
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
            let section = øsections.value.nth(indexPath.section),
            let convention = conventions(for: section).nth(indexPath.row)
        else { return }
        ConventionDetailsViewController.show(for: convention)
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        guard let section = øsections.value.nth(indexPath.section) else { return 0 }
        return section.cellHeight
    }

    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        guard let title = self.tableView(tableView, titleForHeaderInSection: section) else { return nil }
        let conCount = øsections.value.nth(section).map(conventions(for:))?.count ?? 0
        let conventions = øsections.asObservable()
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
    static let Storyboard: Storyboard = .Main
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
