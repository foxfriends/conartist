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
    @IBOutlet weak var emptyStateView: UIView!
    @IBOutlet weak var emptyStateLabel: UILabel!

    fileprivate let disposeBag = DisposeBag()
    fileprivate var convention: Convention!
    fileprivate let øinformation = Variable<[ConventionUserInfo]>([])
    fileprivate let refreshControl = UIRefreshControl()
}

// MARK: - Lifecycle
extension ConventionUserInfoListViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLocalization()
        setupSubscriptions()
        setupRefreshControl()
    }

    private func setupRefreshControl() {
        infoTableView.refreshControl = refreshControl
        refreshControl.addTarget(self, action: #selector(reloadConvention), for: .valueChanged)
    }

    @objc private func reloadConvention() {
        let _ = convention
            .fill(true)
            .subscribe { [refreshControl] _ in refreshControl.endRefreshing() }
    }
}

// MARK: - Localization
extension ConventionUserInfoListViewController {
    fileprivate func setupLocalization() {
        navBar.title = convention.name
        navBar.leftButtonTitle = "Back"¡
        navBar.rightButtonTitle = "Add"¡
        emptyStateLabel.text = "<No convention user info>"¡
    }
}

// MARK: - Subscriptions
extension ConventionUserInfoListViewController {
    fileprivate func setupSubscriptions() {
        øinformation
            .asDriver()
            .drive(onNext: reloadView)
            .disposed(by: disposeBag)

        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .flatMap { NewConventionUserInfoViewController.show() }
            .subscribe(onNext: { [convention] info in convention?.addUserInfo(info) })
            .disposed(by: disposeBag)
    }

    private func reloadView(infos: [ConventionUserInfo]) {
        if infos.isEmpty {
            emptyStateView.isHidden = false
            infoTableView.isHidden = true
        } else {
            emptyStateView.isHidden = true
            infoTableView.isHidden = false
            infoTableView.reloadData()
        }
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
        return 50
    }

    // TODO: the heights sometimes change randomly?? gotta fix that
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return UITableViewAutomaticDimension
    }
}

// MARK: - UITableViewDelegate
extension ConventionUserInfoListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, leadingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        let information = øinformation.value[indexPath.row]
        var actions: [UIContextualAction] = []
        if information.vote != .up {
            let upvoteAction = UIContextualAction(style: .normal, title: "Upvote"¡) { [convention] _, _, reset in
                convention?.setVote(for: information, to: .up)
                reset(true)
            }
            upvoteAction.backgroundColor = ConArtist.Color.Success
            actions.append(upvoteAction)
        }
        let config = UISwipeActionsConfiguration(actions: actions)
        config.performsFirstActionWithFullSwipe = true
        return config
    }

    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        let information = øinformation.value[indexPath.row]
        var actions: [UIContextualAction] = []
        if information.vote != .down {
            let downvoteAction = UIContextualAction(style: .normal, title: "Downvote"¡) { [convention] _, _, reset in
                convention?.setVote(for: information, to: .down)
                reset(true)
            }
            downvoteAction.backgroundColor = ConArtist.Color.Warn
            actions.append(downvoteAction)
        }
        let config = UISwipeActionsConfiguration(actions: actions)
        config.performsFirstActionWithFullSwipe = true
        return config
    }
}

// MARK: - Navigation
extension ConventionUserInfoListViewController {
    class func show(for convention: Convention) {
        let controller: ConventionUserInfoListViewController = ConventionUserInfoListViewController.instantiate(withId: ConventionUserInfoListViewController.ID)

        controller.convention = convention
        convention.userInfo
            .map { $0.sorted().reversed() }
            .bind(to: controller.øinformation)
            .disposed(by: controller.disposeBag)

        ConArtist.model.navigate(push: controller)
    }
}
