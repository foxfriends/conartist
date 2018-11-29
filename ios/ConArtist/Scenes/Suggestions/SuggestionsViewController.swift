//
//  SuggestionsViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class SuggestionsViewController: ConArtistViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var suggestionsTableView: UITableView!
    fileprivate let disposeBag = DisposeBag()
    fileprivate let refreshControl = UIRefreshControl()

    var loading = false
}

// MARK: - Lifecycle

extension SuggestionsViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupLocalization()
        setupSubscriptions()
        setupRefreshControl()
    }

    private func setupRefreshControl() {
        suggestionsTableView.refreshControl = refreshControl
        refreshControl.rx.controlEvent([.valueChanged])
            .flatMapLatest { _ in ConArtist.model.loadSuggestions(fresh: true) }
            .subscribe(onNext: { [refreshControl] _ in refreshControl.endRefreshing() })
            .disposed(by: disposeBag)
    }
}

// MARK: - UI

extension SuggestionsViewController {
    fileprivate func setupUI() {
    }

    fileprivate func setupLocalization() {
        navBar.title = "Suggestions"¡
        navBar.leftButtonTitle = "Back"¡
        navBar.rightButtonTitle = "Add"¡
    }
}

// MARK: - Subscriptions

extension SuggestionsViewController {
    fileprivate func setupSubscriptions() {
        ConArtist.model.suggestions
            .asDriver()
            .drive(onNext: { [suggestionsTableView] _ in suggestionsTableView?.reloadData() })
            .disposed(by: disposeBag)

        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .subscribe(onNext: { _ in }) // TODO
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource

extension SuggestionsViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 3
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        let connection = ConArtist.model.suggestions.value
        switch section {
        case 0 where connection.isEmpty: return 1
        case 1: return connection.nodes.count
        case 2 where !connection.isFull && !connection.isEmpty: return 1
        default: return 0
        }
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        switch indexPath.section {
        case 0:
            let cell = tableView.dequeueReusableCell(withIdentifier: EmptyStateTableViewCell.ID, for: indexPath) as! EmptyStateTableViewCell
            cell.setup(text: "There are no suggestions yet. Feel free to make a request!"¡)
            return cell
        case 1:
            let cell = tableView.dequeueReusableCell(withIdentifier: SuggestionTableViewCell.ID, for: indexPath) as! SuggestionTableViewCell
            cell.setup(suggestion: ConArtist.model.suggestions.value.nodes[indexPath.row])
            return cell
        case 2:
            return tableView.dequeueReusableCell(withIdentifier: LoadingTableViewCell.ID, for: indexPath)
        default: fatalError("Unreachable case")
        }
    }
}

// MARK: - UITableViewDelegate

extension SuggestionsViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, estimatedHeightForRowAt indexPath: IndexPath) -> CGFloat {
        switch indexPath.section {
        case 0: return 60
        default: return self.tableView(tableView, heightForRowAt: indexPath)
        }
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        switch indexPath.section {
        case 0: return UITableView.automaticDimension
        default: return 50
        }
    }

    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        if indexPath.section == 2 && !loading {
            loading = true
            _ = ConArtist.model.loadSuggestions()
                .subscribe(onNext: { [weak self] _ in self?.loading = false })
        }
    }
}

// MARK: - Navigation

extension SuggestionsViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .suggestions
    static let ID = "Suggestions"

    static func present() {
        ConArtist.model.navigate(push: instantiate())
    }
}
