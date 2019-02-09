//
//  AllConventionsListViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-05-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import RxCocoa

extension Convention {
    fileprivate var cellIdentifier: String {
        if start > Date() {
            return "FutureConventionCell"
        } else {
            return "PastConventionCell"
        }
    }
}


class AllConventionsListViewController : ConArtistViewController {
    fileprivate let conventions = BehaviorRelay<[Convention]>(value: [])

    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var conventionsTableView: UITableView!
}

// MARK: - Lifecycle
extension AllConventionsListViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        setupLocalization()
        setupSubscriptions()
    }
}

// MARK: - Localization
extension AllConventionsListViewController {
    fileprivate func setupLocalization() {
        navBar.title = "Conventions"¡
        navBar.leftButtonTitle = "Back"¡
        navBar.rightButtonTitle = "Search"¡
    }
}

// MARK: - Subscriptions
extension AllConventionsListViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .subscribe(onNext: { _ in ConventionSearchViewController.present() })
            .disposed(by: disposeBag)

        conventions
            .asObservable()
            .discard()
            .subscribe(onNext: { [conventionsTableView] in conventionsTableView?.reloadData() })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension AllConventionsListViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return conventions.value.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let convention = conventions.value.nth(indexPath.row) else {
            return UITableViewCell()
        }
        let cell = tableView.dequeueReusableCell(withIdentifier: convention.cellIdentifier, for: indexPath) as! ConventionTableViewCell
        cell.fill(with: convention)
        return cell
    }
}

// MARK: - UITableViewDelegate
extension AllConventionsListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard let convention = conventions.value.nth(indexPath.row) else {
            return
        }
        ConventionDetailsViewController.show(for: convention)
    }

    func tableView(_ tableView: UITableView, didHighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = true
    }

    func tableView(_ tableView: UITableView, didUnhighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = false
    }
}

// MARK: - Navigation
extension AllConventionsListViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .main
    static let ID = "AllConventionsList"

    static func show(conventions: Observable<[Convention]>) {
        let controller = instantiate()
        conventions
            .bind(to: controller.conventions)
            .disposed(by: controller.disposeBag)
        ConArtist.model.navigate(push: controller)
    }
}
