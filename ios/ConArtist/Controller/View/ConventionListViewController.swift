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

extension ConventionListViewController {
    fileprivate func openSettings() {
        let settings = [
            SettingsViewController.Group(
                title: "General",
                items: [
                    .Action("Sign out", { [weak self] in self?.signOut() })
                ]
            ),
        ]
        ConArtist.model.navigateTo(page: .Settings(settings))
    }
    
    fileprivate func signOut() {
        ConArtist.model.page.value = [.SignIn]
        ConArtist.API.authToken = ConArtist.API.Unauthorized
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
        return max(conventions(for: section).count, 1)
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
        ConArtist.model.navigateTo(page: .Convention(convention))
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        guard let section = øsections.value.nth(indexPath.section) else { return 0 }
        return section.cellHeight
    }

    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        guard let title = self.tableView(tableView, titleForHeaderInSection: section) else { return nil }
        // TODO: this could be moved into another class
        let view = UIView()
        let titleLabel = UILabel().customizable()
        let hbar = HighlightableView().customizable()
        let seeAllButton = UIButton().customizable().conArtistStyle()

        view.addSubview(titleLabel)

        titleLabel.text = title
        titleLabel.font = UIFont.systemFont(ofSize: 12).usingFeatures([.smallCaps])
        titleLabel.textColor = ConArtist.Color.Text

        // TODO: hide see all button and adjust constraints when there are no more to see
        view.addConstraints([
            NSLayoutConstraint(item: titleLabel, attribute: .leading, relatedBy: .equal, toItem: view, attribute: .leading, multiplier: 1, constant: 20),
            NSLayoutConstraint(item: view, attribute: .centerY, relatedBy: .equal, toItem: titleLabel, attribute: .centerY, multiplier: 1, constant: 0)
        ])

        // if it's not the top section, it gets a bar and maybe the "See all" button
        if section != 0 {
            view.addSubview(seeAllButton)
            seeAllButton.titleLabel?.font = UIFont.systemFont(ofSize: 12)
            seeAllButton.setTitle("See all", for: .normal) // TODO: localized string
            view.addConstraints([
                NSLayoutConstraint(item: view, attribute: .trailing, relatedBy: .equal, toItem: seeAllButton, attribute: .trailing, multiplier: 1, constant: 20),
                NSLayoutConstraint(item: view, attribute: .centerY, relatedBy: .equal, toItem: seeAllButton, attribute: .centerY, multiplier: 1, constant: 0)
            ])

            view.addSubview(hbar)
            view.addConstraints([
                NSLayoutConstraint(item: hbar, attribute: .leading, relatedBy: .equal, toItem: titleLabel, attribute: .trailing, multiplier: 1, constant: 10),
                NSLayoutConstraint(item: seeAllButton, attribute: .leading, relatedBy: .equal, toItem: hbar, attribute: .trailing, multiplier: 1, constant: 10),
                NSLayoutConstraint(item: hbar, attribute: .height, relatedBy: .equal, toItem: nil, attribute: .notAnAttribute, multiplier: 1, constant: 1),
                NSLayoutConstraint(item: view, attribute: .centerY, relatedBy: .equal, toItem: hbar, attribute: .centerY, multiplier: 1, constant: 0)
            ])
        }
        return view
    }
}

// MARK: - Navigation
extension ConventionListViewController {
    class func create() -> ConventionListViewController {
        return ConventionListViewController.instantiate(withId: ConventionListViewController.ID)
    }
}
