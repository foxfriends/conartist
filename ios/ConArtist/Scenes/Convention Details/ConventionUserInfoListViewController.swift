//
//  ConventionUserInfoListViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-05.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class ConventionUserInfoListViewController: UIViewController {
    static let ID = "ConventionUserInfoList"
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var infoTableView: UITableView!

    fileprivate let disposeBag = DisposeBag()
    fileprivate var convention: Convention!
    fileprivate let øinformation = Variable<[ConventionUserInfo]>([])
}

// MARK: - Lifecycle
extension ConventionUserInfoListViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLocalization()
        setupSubscriptions()
    }
}

// MARK: - Localization
extension ConventionUserInfoListViewController {
    fileprivate func setupLocalization() {
        navBar.title = convention.name
        navBar.leftButtonTitle = "Back"¡
        navBar.rightButtonTitle = "Add"¡
    }
}

// MARK: - Subscriptions
extension ConventionUserInfoListViewController {
    fileprivate func setupSubscriptions() {
        øinformation
            .asDriver()
            .drive(onNext: { [infoTableView] _ in infoTableView?.reloadData() })
            .disposed(by: disposeBag)

        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .subscribe(onNext: { _ in /* todo */ })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension ConventionUserInfoListViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? øinformation.value.count : 0
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ConventionUserInfoTableViewCell.ID, for: indexPath) as! ConventionUserInfoTableViewCell
        cell.setup(for: øinformation.value[indexPath.row])
        return cell
    }

    func tableView(_ tableView: UITableView, estimatedHeightForRowAt indexPath: IndexPath) -> CGFloat {
        return 1
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return UITableViewAutomaticDimension
    }
}

// MARK: - UITableViewDelegate
extension ConventionUserInfoListViewController: UITableViewDelegate {
    @available(iOS 11.0, *)
    func tableView(_ tableView: UITableView, leadingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        return nil
    }

    @available(iOS 11.0, *)
    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        return nil
    }
}

// MARK: - Navigation
extension ConventionUserInfoListViewController {
    class func show(for convention: Convention) {
        let controller: ConventionUserInfoListViewController = ConventionUserInfoListViewController.instantiate(withId: ConventionUserInfoListViewController.ID)

        controller.convention = convention
        convention.userInfo
            .map { $0.sorted() }
            .bind(to: controller.øinformation)
            .disposed(by: controller.disposeBag)

        ConArtist.model.navigate(push: controller)
    }
}
