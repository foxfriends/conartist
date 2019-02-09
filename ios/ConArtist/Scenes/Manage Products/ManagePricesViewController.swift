//
//  ManagePricesViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-05.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import SVGKit
import RxCocoa
import RxSwift

class ManagePricesViewController: ConArtistViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var pricesTableView: UITableView!
    @IBOutlet weak var addPriceButton: UIButton!
    @IBOutlet weak var addPriceButtonImageView: SVGKFastImageView!

    fileprivate var productType: ProductType!
    fileprivate let prices = BehaviorRelay<[Price]>(value: [])
    fileprivate let refreshControl = UIRefreshControl()
}

// MARK: - Lifecycle

extension ManagePricesViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        addPriceButtonImageView.image = .add
        addPriceButton.addShadow()
        setupLocalization()
        setupSubscriptions()
        setupRefreshControl()
    }

    private func setupRefreshControl() {
        pricesTableView.refreshControl = refreshControl
        refreshControl.rx.controlEvent([.valueChanged])
            .flatMapLatest { ConArtist.API.GraphQL.observe(query: FullUserQuery(), cachePolicy: .fetchIgnoringCacheData) }
            .observeOn(MainScheduler.instance)
            .map { $0.user.fragments.fullUserFragment }
            .subscribe(onNext: { [refreshControl] fragment in
                refreshControl.endRefreshing()
                ConArtist.model.merge(graphQL: fragment)
            })
            .disposed(by: disposeBag)
    }
}

// MARK: - Localization

extension ManagePricesViewController {
    fileprivate func setupLocalization() {
        navBar.title = productType.name
        navBar.leftButtonTitle = "Back"¡
    }
}

// MARK: - Subscriptions

extension ManagePricesViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        addPriceButton.rx.tap
            .subscribe(onNext: { [productType = productType!] _ in EditPriceViewController.createNewPrice(ofType: productType) })
            .disposed(by: disposeBag)

        ConArtist.model.prices
            .map { [productType = productType!] in $0.filter { $0.typeId == productType.id } }
            .map { $0.sorted() }
            .bind(to: prices)
            .disposed(by: disposeBag)

        prices.asDriver()
            .drive(onNext: { [pricesTableView] _ in pricesTableView?.reloadData() })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource

extension ManagePricesViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return prices.value.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ManagePriceTableViewCell.ID, for: indexPath) as! ManagePriceTableViewCell
        cell.setup(with: prices.value[indexPath.row])
        return cell
    }
}

// MARK: - UITableViewDelegate

extension ManagePricesViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        EditPriceViewController.show(for: prices.value[indexPath.row])
    }

    func tableView(_ tableView: UITableView, didHighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = true
    }

    func tableView(_ tableView: UITableView, didUnhighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = false
    }

    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        let delete = UIContextualAction(style: .destructive, title: "Delete"¡) { [prices] _, _, done in
            let price = prices.value[indexPath.row]

            _ = ConArtist.API.GraphQL
                .observe(mutation: DeletePriceMutation(price: PriceDel(
                    typeId: price.typeId,
                    productId: price.productId,
                    quantity: price.quantity
                )))
                .subscribe(onNext: { _ in
                    tableView.performBatchUpdates({
                        tableView.deleteRows(at: [indexPath], with: .automatic)
                        var removed = prices.value
                        removed.remove(at: indexPath.row)
                        prices.accept(removed)
                        done(true)
                    })
                })
        }
        delete.backgroundColor = .warn
        return UISwipeActionsConfiguration(actions: [delete])
    }
}

// MARK: - Navigation

extension ManagePricesViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .products
    static let ID: String = "ManagePrices"

    static func show(for type: ProductType) {
        let controller = instantiate()
        controller.productType = type
        ConArtist.model.navigate(push: controller)
    }
}
