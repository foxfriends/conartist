//
//  ConventionUserInfoListViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-05.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxCocoa
import RxSwift

class ConventionUserInfoListViewController: UIViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var infoTableView: UITableView!
    @IBOutlet weak var emptyStateView: UIView!
    @IBOutlet weak var emptyStateLabel: UILabel!

    fileprivate let disposeBag = DisposeBag()
    fileprivate var convention: Convention!
    fileprivate let information = BehaviorRelay<[ConventionUserInfo]>(value: [])
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
        refreshControl.rx.controlEvent([.valueChanged])
            .flatMapLatest { [convention] _ in convention!.fill(true) }
            .subscribe(onNext: { [refreshControl] in refreshControl.endRefreshing() })
            .disposed(by: disposeBag)
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
        information
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
        return section == 0 ? information.value.count : 0
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ConventionUserInfoTableViewCell.ID, for: indexPath) as! ConventionUserInfoTableViewCell
        cell.setup(for: information.value[indexPath.row])
        return cell
    }

    func tableView(_ tableView: UITableView, estimatedHeightForRowAt indexPath: IndexPath) -> CGFloat {
        return 50
    }

    // TODO: the heights sometimes change randomly?? gotta fix that
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return UITableView.automaticDimension
    }
}

// MARK: - UITableViewDelegate
extension ConventionUserInfoListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, leadingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        let information = self.information.value[indexPath.row]
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
        let information = self.information.value[indexPath.row]
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
extension ConventionUserInfoListViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .Convention
    static let ID = "ConventionUserInfoList"

    static func show(for convention: Convention) {
        let controller = instantiate()

        controller.convention = convention
        convention.userInfo
            .map { $0.sorted().reversed() }
            .bind(to: controller.information)
            .disposed(by: controller.disposeBag)

        ConArtist.model.navigate(push: controller)
    }
}
