//
//  ConventionSearchViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-29.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import RxCocoa

class ConventionSearchViewController: ConArtistViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var conventionsTableView: UITableView!
    @IBOutlet weak var searchBarTextField: UITextField!

    fileprivate let conventions = BehaviorRelay<Connection<Convention>>(value: .empty)
    fileprivate var reloadRequest: Disposable?
    fileprivate let disposeBag = DisposeBag()
    fileprivate let refreshControl = UIRefreshControl()

    deinit {
        reloadRequest?.dispose()
    }
}

// MARK: - Lifecycle

extension ConventionSearchViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupSubscriptions()
        setupRefreshControl()
    }

    private func setupRefreshControl() {
        conventionsTableView.refreshControl = refreshControl
        refreshControl.rx.controlEvent([.valueChanged])
            .withLatestFrom(searchBarTextField.rx.text)
            .map { $0 ?? "" }
            .do(onNext: { [weak self] _ in
                self?.reloadRequest?.dispose()
                self?.reloadRequest = nil
            })
            .flatMapLatest { filter in
                ConArtist.API.GraphQL.observe(query: ConventionsConnectionQuery(
                    search: filter.isEmpty ? nil : filter
                ))
            }
            .map { $0.conventionsConnection }
            .filterMap(Connection<Convention>.init(graphQL:))
            .subscribe(onNext: { [refreshControl, conventions] connection in
                refreshControl.endRefreshing()
                conventions.accept(connection)
            })
            .disposed(by: disposeBag)
    }
}

// MARK: - UI

extension ConventionSearchViewController {
    fileprivate func setupUI() {
        searchBarTextField.attributedPlaceholder = "Search"¡.withColor(.textPlaceholder)
    }
}

// MARK: - Subscriptions

extension ConventionSearchViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        conventions
            .asDriver()
            .drive(onNext: { [conventionsTableView] _ in conventionsTableView.reloadData() })
            .disposed(by: disposeBag)

        searchBarTextField.rx.text
            .map { $0 ?? "" }
            .distinctUntilChanged()
            .do(onNext: { [weak self] _ in
                self?.conventions.accept(.empty)
                self?.reloadRequest?.dispose()
                self?.reloadRequest = nil
            })
            .flatMapLatest { [conventions] filter in
                ConArtist.API.GraphQL.observe(query: ConventionsConnectionQuery(
                    search: filter.isEmpty ? nil : filter,
                    after: conventions.value.endCursor
                ))
            }
            .map { $0.conventionsConnection }
            .filterMap(Connection<Convention>.init(graphQL:))
            .map { [conventions] new in conventions.value.extend(new) }
            .bind(to: conventions)
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource

extension ConventionSearchViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 3
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0 where conventions.value.isEmpty: return 1
        case 1: return conventions.value.nodes.count
        case 2 where !conventions.value.isFull && !conventions.value.isEmpty: return 1
        default: return 0
        }
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        switch indexPath.section {
        case 0:
            let cell = tableView.dequeueReusableCell(withIdentifier: EmptyStateTableViewCell.ID, for: indexPath) as! EmptyStateTableViewCell
            cell.setup(text: (searchBarTextField.text ?? "").isEmpty
                ? "There are no conventions right now"¡
                : "<Convention search empty>"¡
            )
            return cell
        case 1:
            let cell = tableView.dequeueReusableCell(withIdentifier: ConventionSearchTableViewCell.ID, for: indexPath) as! ConventionSearchTableViewCell
            cell.setup(convention: conventions.value.nodes[indexPath.row])
            return cell
        case 2:
            return tableView.dequeueReusableCell(withIdentifier: LoadingTableViewCell.ID, for: indexPath)
        default: fatalError("Unreachable case")
        }
    }
}

// MARK: - UITableViewDelegate

extension ConventionSearchViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard indexPath.section == 1 else { return }
        ConventionDetailsViewController.show(for: conventions.value.nodes[indexPath.row])
    }

    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        guard indexPath.section == 2, reloadRequest == nil else { return }
        let filter = searchBarTextField.text ?? ""
        reloadRequest = ConArtist.API.GraphQL
            .observe(query: ConventionsConnectionQuery(
                search: filter.isEmpty ? nil : filter,
                after: conventions.value.endCursor
            ))
            .map { $0.conventionsConnection }
            .filterMap(Connection<Convention>.init(graphQL:))
            .map { [conventions] new in conventions.value.extend(new) }
            .do(onNext: { [weak self] _ in self?.reloadRequest = nil })
            .bind(to: conventions)
    }
}

// MARK: - Navigation

extension ConventionSearchViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .main
    static let ID = "ConventionSearch"

    static func present() {
        ConArtist.model.navigate(push: instantiate())
    }
}
