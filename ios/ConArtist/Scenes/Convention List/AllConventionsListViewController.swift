//
//  AllConventionsListViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-05-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

extension Convention {
    fileprivate var cellIdentifier: String {
        if start > Date() {
            return "FutureConventionCell"
        } else {
            return "PastConventionCell"
        }
    }
}


class AllConventionsListViewController: UIViewController {
    fileprivate let øconventions = Variable<[Convention]>([])
    fileprivate let disposeBag = DisposeBag()

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
    }
}

// MARK: - Subscriptions
extension AllConventionsListViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .discard()
            .subscribe(onNext: { ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        øconventions
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
        return øconventions.value.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let convention = øconventions.value.nth(indexPath.row) else {
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
        guard let convention = øconventions.value.nth(indexPath.row) else {
            return
        }
        ConventionDetailsViewController.show(for: convention)
    }
}

// MARK: - Navigation
extension AllConventionsListViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .Main
    static let ID = "AllConventionsList"

    static func show(conventions: Observable<[Convention]>) {
        let controller = instantiate()
        conventions
            .bind(to: controller.øconventions)
            .disposed(by: controller.disposeBag)
        ConArtist.model.navigate(push: controller)
    }
}
