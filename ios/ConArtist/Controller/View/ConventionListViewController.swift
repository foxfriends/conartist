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
    fileprivate enum Section: String {
        // TODO: localized strings? here?
        case Past = "Previous"
        case Present = "Today"
        case Future = "Upcoming"
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
            .map { zip($0, [Section.Present, .Past, .Future]) }
            .map { $0.filter { $0.0 }.map { $0.1 } }
            .bind(to: øsections)
            .disposed(by: disposeBag)

        øsections
            .asDriver()
            .drive(onNext: { [weak self] sections in
                self?.sectionTitles = sections.map { $0.rawValue }
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
        case .Present:
            return present
        case .Past:
            return past
        case .Future:
            return future
        }
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return sectionTitles.count
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        guard let section = øsections.value.nth(section) else { return 0 }
        return conventions(for: section).count
    }
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return sectionTitles.nth(section)
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ConventionTableViewCell.ID, for: indexPath) as! ConventionTableViewCell
        if  let section = øsections.value.nth(indexPath.section),
            let convention = conventions(for: section).nth(indexPath.row) {
            cell.fill(with: convention)
        }
        return cell
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

    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        guard let title = self.tableView(tableView, titleForHeaderInSection: section) else { return nil }
        let view = UIView()
        let titleLabel = UILabel().customizable()
        let hbar = HighlightableView().customizable()
        let seeAllButton = UIButton().customizable().conArtistStyle()

        view.addSubview(titleLabel)
        view.addSubview(hbar)
        view.addSubview(seeAllButton)

        titleLabel.text = title
        titleLabel.font = UIFont.systemFont(ofSize: 12).usingFeatures([.smallCaps])
        titleLabel.textColor = ConArtist.Color.Text
        seeAllButton.titleLabel?.font = UIFont.systemFont(ofSize: 12)
        seeAllButton.setTitle("See all", for: .normal) // TODO: localized string

        // TODO: hide see all button and adjust constraints when there are no more to see
        view.addConstraints([
            NSLayoutConstraint(item: titleLabel, attribute: .leading, relatedBy: .equal, toItem: view, attribute: .leading, multiplier: 1, constant: 20),
            NSLayoutConstraint(item: view, attribute: .centerY, relatedBy: .equal, toItem: titleLabel, attribute: .centerY, multiplier: 1, constant: 0),
            NSLayoutConstraint(item: view, attribute: .trailing, relatedBy: .equal, toItem: seeAllButton, attribute: .trailing, multiplier: 1, constant: 20),
            NSLayoutConstraint(item: view, attribute: .centerY, relatedBy: .equal, toItem: seeAllButton, attribute: .centerY, multiplier: 1, constant: 0),
            NSLayoutConstraint(item: hbar, attribute: .leading, relatedBy: .equal, toItem: titleLabel, attribute: .trailing, multiplier: 1, constant: 10),
            NSLayoutConstraint(item: seeAllButton, attribute: .leading, relatedBy: .equal, toItem: hbar, attribute: .trailing, multiplier: 1, constant: 10),
            NSLayoutConstraint(item: hbar, attribute: .height, relatedBy: .equal, toItem: nil, attribute: .notAnAttribute, multiplier: 1, constant: 1),
            NSLayoutConstraint(item: view, attribute: .centerY, relatedBy: .equal, toItem: hbar, attribute: .centerY, multiplier: 1, constant: 0)
        ])

        return view
    }
}

// MARK: - Navigation
extension ConventionListViewController {
    class func create() -> ConventionListViewController {
        return ConventionListViewController.instantiate(withId: ConventionListViewController.ID)
    }
}
