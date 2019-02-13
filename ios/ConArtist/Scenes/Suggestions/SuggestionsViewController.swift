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
    fileprivate let refreshControl = UIRefreshControl()

    var loading = false
}

// MARK: - Lifecycle

extension SuggestionsViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
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
    fileprivate func setupLocalization() {
        navBar.title = "Suggestions"¡
        navBar.leftButtonTitle = "Back"¡
        navBar.rightButtonTitle = "Add"¡
    }
}

// MARK: - Subscriptions

extension SuggestionsViewController {
    fileprivate func setupSubscriptions() {
        if ConArtist.model.suggestions.value.isEmpty {
            _ = ConArtist.model.loadSuggestions().subscribe()
        }

        ConArtist.model.suggestions
            .asDriver()
            .drive(onNext: { [suggestionsTableView] _ in suggestionsTableView?.reloadData() })
            .disposed(by: disposeBag)

        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .flatMap { _ in NewSuggestionViewController.present() }
            .map(CreateSuggestionMutation.init(suggestion:))
            .flatMap { mutation in ConArtist.API.GraphQL.observe(mutation: mutation) }
            .map { $0.createSuggestion.fragments.suggestionFragment }
            .filterMap(Suggestion.init(graphQL:))
            .subscribe(onNext: ConArtist.model.addSuggestion)
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
        return 60
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        switch indexPath.section {
        case 0, 1: return UITableView.automaticDimension
        default: return 60
        }
    }

    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        if indexPath.section == 2 && !loading {
            loading = true
            _ = ConArtist.model.loadSuggestions()
                .subscribe(onSuccess: { [weak self] _ in self?.loading = false })
        }
    }

    func tableView(_ tableView: UITableView, leadingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        guard indexPath.section == 1 else { return nil }
        let suggestion = ConArtist.model.suggestions.value.nodes[indexPath.row]
        guard !suggestion.voted else { return nil }
        let upvote = UIContextualAction(style: .normal, title: "Recommend"¡) { _, _, complete in
            _ = ConArtist.API.GraphQL
                .observe(mutation: VoteForSuggestionMutation(suggestionId: suggestion.id))
                .map { $0.voteForSuggestion.fragments.suggestionFragment }
                .map(Suggestion.init(graphQL:))
                .do(onSuccess: { suggestion in suggestion.map(ConArtist.model.replaceSuggestion) })
                .subscribe(
                    onSuccess: { suggestion in complete(suggestion != nil) },
                    onError: { _ in complete(false) }
                )
        }
        upvote.backgroundColor = .success
        return UISwipeActionsConfiguration(actions: [upvote])
    }

    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        return UISwipeActionsConfiguration(actions: [])
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
