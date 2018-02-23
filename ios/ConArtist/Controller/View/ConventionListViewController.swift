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
    fileprivate enum Section {
        // TODO: localized strings? here?
        case Past
        case Present
        case PresentEmpty
        case Future

        var cellIdentifier: String {
            switch self {
            case .PresentEmpty: return "NothingTodayConventionCell"
            case .Past:         return "ConventionCell"
            case .Present:      return "TodayConventionCell"
            case .Future:       return "FutureConventionCell"
            }
        }

        var title: String {
            switch self {
            case .Present, .PresentEmpty:   return "Today"
            case .Past:                     return "Completed"
            case .Future:                   return "Upcoming"
            }
        }

        var cellHeight: CGFloat {
            switch self {
            case .Present, .PresentEmpty:   return 90
            case .Past, .Future:            return 60
            }
        }
    }

    fileprivate static let ID = "ConventionList"

    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var conventionsTableView: UITableView!
    weak var settingsButton: UIButton!
    
    fileprivate let øconventions = ConArtist.model.conventions
    fileprivate let øsections = Variable<[Section]>([])
    fileprivate let disposeBag = DisposeBag()

    fileprivate var present: [Convention] = []
    fileprivate var past: [Convention] = []
    fileprivate var future: [Convention] = []
    fileprivate var sectionTitles: [String] = []
}

// MARK: - Settings
extension ConventionListViewController {
    fileprivate func openSettings() {
        let settings = [
            SettingsViewController.Group(
                // TODO: localized strings
                title: "General",
                items: [
                    .Action("Sign out", { [weak self] in self?.signOut() }),
                    .Action("Report a bug/Request a feature", { [weak self] in self?.contactSupport() }),
                    .Action("Help", { [weak self] in self?.showHelp() })
                ]
            ),
        ]
        SettingsViewController.show(for: settings)
    }
    
    private func signOut() {
        ConArtist.model.navigate(backTo: SignInViewController.self)
        ConArtist.API.authToken = ConArtist.API.Unauthorized
    }

    private func contactSupport() {

    }

    private func showHelp() {

    }
}

// MARK: - Lifecycle
extension ConventionListViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        settingsButton = navBar.rightButton

        let øpast = øconventions.asObservable().map { cons in cons.filter { $0.end < Date.today() } }
        let øpresent = øconventions.asObservable().map { cons in cons.filter { $0.start <= Date.today() && $0.end >= Date.today() } }
        let øfuture = øconventions.asObservable().map { cons in cons.filter { $0.start > Date.today() } }
        
        øpast.subscribe(onNext: { [weak self] in self?.past = $0 }).disposed(by: disposeBag)
        øfuture.subscribe(onNext: { [weak self] in self?.future = $0 }).disposed(by: disposeBag)
        øpresent.subscribe(onNext: { [weak self] in self?.present = $0 }).disposed(by: disposeBag)
        
        Observable.combineLatest([øpresent, øfuture, øpast])
            .map { $0.map { $0.count > 0 } }
            .map { zip($0, [Section.Present, .Future, .Past]) }
            .map { $0.filter { $0.0 }.map { $0.1 } }
            // if there is no Today section, add the empty Today section
            .map { $0.contains(.Present) ? $0 : [.PresentEmpty] + $0 }
            .bind(to: øsections)
            .disposed(by: disposeBag)

        øsections
            .asDriver()
            .drive(onNext: { [weak self] sections in
                self?.sectionTitles = sections.map { $0.title }
                self?.conventionsTableView.reloadData()
            })
            .disposed(by: disposeBag)
        
        settingsButton.rx.tap
            .subscribe(onNext: { [unowned self] _ in self.openSettings() })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension ConventionListViewController: UITableViewDataSource {
    fileprivate func conventions(for section: Section) -> [Convention] {
        switch section {
        case .PresentEmpty: return []
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
                cell.emptyState()
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
        ConventionDetailsTabBarController.show(for: convention)
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        guard let section = øsections.value.nth(indexPath.section) else { return 0 }
        return section.cellHeight
    }

    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        guard let title = self.tableView(tableView, titleForHeaderInSection: section) else { return nil }
        let conCount = øsections.value.nth(section).map(conventions(for:))?.count ?? 0
        let showMore = conCount > ConventionListViewController.MaxConventionsPerSection
        return TableHeaderView(title: title, showBar: section != 0, showMore: showMore)
    }
}

// MARK: - Navigation
extension ConventionListViewController {
    class func show(animated: Bool = true) {
        let controller = ConventionListViewController.instantiate(withId: ConventionListViewController.ID)
        if animated {
            ConArtist.model.navigate(push: controller)
        } else {
            ConArtist.model.navigate(replace: controller)
        }
    }
}
