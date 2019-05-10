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
import SVGKit

class ConventionSearchViewController: ConArtistViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var conventionsTableView: UITableView!
    @IBOutlet weak var searchBarTextField: UITextField!
    @IBOutlet weak var filtersButton: UIButton!

    @IBOutlet weak var countryField: FancyTextField!
    @IBOutlet weak var cityField: FancyTextField!

    @IBOutlet weak var filterSheet: UIView!
    @IBOutlet weak var filterBacking: UIButton!
    @IBOutlet weak var filterSheetConstraint: NSLayoutConstraint!

    fileprivate let conventions = BehaviorRelay<Connection<Convention>>(value: .empty)
    fileprivate let filterSheetVisible = BehaviorRelay(value: false)
    fileprivate var reloadRequest: Disposable?
    fileprivate let refreshControl = UIRefreshControl()

    fileprivate let filter = BehaviorRelay<String?>(value: nil)

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
            .withLatestFrom(filter)
            .do(onNext: { [weak self] _ in
                self?.reloadRequest?.dispose()
                self?.reloadRequest = nil
            })
            .flatMapLatest { filter in
                ConArtist.API.GraphQL.observe(query: ConventionsConnectionQuery(
                    search: filter
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
        filtersButton.setImage(SVGKImage.tune.uiImage.withRenderingMode(.alwaysTemplate), for: .normal)
        filtersButton.setTitleColor(.text, for: .normal)
        filtersButton.tintColor = .text
        filterBacking.alpha = 0
        filterBacking.isHidden = false
        filterBacking.isUserInteractionEnabled = false
        filterSheetConstraint.constant = filterSheet.frame.height
        filterSheet.layer.cornerRadius = 35
        filterSheet.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
        view.layoutIfNeeded()
        countryField.title = "Country"¡
        countryField.placeholder = countryField.title
        cityField.title = "City"¡
        cityField.placeholder = cityField.title
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
            .drive(onNext: { [conventionsTableView] _ in conventionsTableView?.reloadData() })
            .disposed(by: disposeBag)

        Observable
            .merge(
                filterBacking.rx.tap
                    .map { _ in false },
                filtersButton.rx.tap
                    .map { _ in true }
            )
            .do(onNext: { [view] _ in view?.endEditing(true) })
            .bind(to: filterSheetVisible)
            .disposed(by: disposeBag)

        Driver
            .combineLatest(
                filterSheetVisible.asDriver(),
                rx.keyboardFrame
            )
            .debounce(.seconds(0))
            .drive(onNext: { [filterSheetConstraint, filterBacking, view, filterSheet] visible, keyboard in
                if visible {
                    filterSheetConstraint?.constant = keyboard.frame.map { -$0.height } ?? 0
                    UIView.animate(
                        withDuration: keyboard.duration,
                        delay: 0,
                        options: keyboard.curve.asAnimationOptions,
                        animations: {
                            view?.layoutIfNeeded()
                            filterBacking?.alpha = 1
                        },
                        completion: { _ in
                            filterBacking?.isUserInteractionEnabled = true
                        }
                    )
                } else {
                    filterSheetConstraint?.constant = filterSheet!.frame.height
                    filterBacking?.isUserInteractionEnabled = false
                    UIView.animate(
                        withDuration: keyboard.duration,
                        delay: 0,
                        options: keyboard.curve.asAnimationOptions,
                        animations: {
                            filterBacking?.alpha = 0
                            view?.layoutIfNeeded()
                        }
                    )
                }
            })
            .disposed(by: disposeBag)

        Observable
            .combineLatest(
                searchBarTextField.rx.text
                    .map { $0 ?? "" }
                    .distinctUntilChanged(),
                countryField.rx.text
                    .map { ($0?.trimmingCharacters(in: .whitespacesAndNewlines)).filter { !$0.isEmpty } }
                    .distinctUntilChanged(),
                cityField.rx.text
                    .map { ($0?.trimmingCharacters(in: .whitespacesAndNewlines)).filter { !$0.isEmpty } }
                    .distinctUntilChanged()
            )
            .map { (filter, country, city) -> String? in
                var query = filter
                if let country = country {
                    query.append("{country:\(country)}")
                }
                if let city = city {
                    query.append("{city:\(city)}")
                }
                return query.isEmpty ? nil : query
            }
            .bind(to: filter)
            .disposed(by: disposeBag)

        filter
            .throttle(.milliseconds(500), scheduler: MainScheduler.asyncInstance)
            .do(onNext: { [weak self] _ in
                self?.reloadRequest?.dispose()
                self?.reloadRequest = nil
            })
            .flatMapLatest { query in
                ConArtist.API.GraphQL.observe(query: ConventionsConnectionQuery(
                    search: query
                ))
            }
            .map { $0.conventionsConnection }
            .filterMap(Connection<Convention>.init(graphQL:))
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

    func tableView(_ tableView: UITableView, didHighlightRowAt indexPath: IndexPath) {
        guard indexPath.section == 1 else { return }
        tableView.cellForRow(at: indexPath)?.isHighlighted = true
    }

    func tableView(_ tableView: UITableView, didUnhighlightRowAt indexPath: IndexPath) {
        guard indexPath.section == 1 else { return }
        tableView.cellForRow(at: indexPath)?.isHighlighted = false
    }


    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        guard indexPath.section == 2, reloadRequest == nil else { return }
        reloadRequest = filter
            .take(1)
            .flatMap { filter in
                ConArtist.API.GraphQL
                    .observe(query: ConventionsConnectionQuery(
                        search: filter,
                        after: self.conventions.value.endCursor
                    ))
            }
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
