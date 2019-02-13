//
//  ManageProductsViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-10-30.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import RxCocoa
import SVGKit

class ManageProductsViewController : ConArtistViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var productsTableView: UITableView!
    @IBOutlet weak var addProductButton: UIButton!
    @IBOutlet weak var addProductImageView: SVGKFastImageView!

    fileprivate let refreshControl = UIRefreshControl()
    fileprivate var productType: ProductType!
    fileprivate let products = BehaviorRelay<[Product]>(value: [])
}

// MARK: - Lifecycle

extension ManageProductsViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        productsTableView.allowsSelectionDuringEditing = true
        productsTableView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: 88, right: 0)
        addProductImageView.image = .add
        addProductButton.addShadow()
        setupSubscriptions()
        setupLocalization()
        setupRefreshControl()
    }

    private func setupRefreshControl() {
        productsTableView.refreshControl = refreshControl
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

extension ManageProductsViewController {
    fileprivate func setupLocalization() {
        navBar.title = productType.name
        navBar.leftButtonTitle = "Back"¡
        navBar.rightButtonTitle = "Edit"¡
    }
}

// MARK: - Subscriptions

extension ManageProductsViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .subscribe(onNext: { [
                    navBar,
                    productsTableView = productsTableView!,
                    addProductButton
                ] _ in
                let editing = !productsTableView.isEditing
                productsTableView.setEditing(editing, animated: true)
                navBar?.rightButtonTitle = editing ? "Done"¡ : "Edit"¡
                navBar?.leftButton.isEnabled = !editing
                addProductButton?.isHidden = editing
            })
            .disposed(by: disposeBag)

        ConArtist.model.products
            .map { [productType] in $0.filter { $0.typeId == productType!.id } }
            .bind(to: products)
            .disposed(by: disposeBag)

        addProductButton.rx.tap
            .subscribe(onNext: { [productType = productType!] _ in
                EditProductViewController.createNewProduct(ofType: productType)
            })
            .disposed(by: disposeBag)

        products
            .asDriver()
            .drive(onNext: { [productsTableView] _ in productsTableView?.reloadData() })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource

extension ManageProductsViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return products.value.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ManageProductTableViewCell.ID, for: indexPath) as! ManageProductTableViewCell
        cell.setup(with: products.value[indexPath.row])
        return cell
    }
}

// MARK: - UITableViewDelegate

extension ManageProductsViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        EditProductViewController.show(for: products.value[indexPath.row])
    }

    func tableView(_ tableView: UITableView, didHighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = true
    }

    func tableView(_ tableView: UITableView, didUnhighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = false
    }

    func tableView(_ tableView: UITableView, shouldIndentWhileEditingRowAt indexPath: IndexPath) -> Bool {
        return false
    }

    func tableView(_ tableView: UITableView, editingStyleForRowAt indexPath: IndexPath) -> UITableViewCell.EditingStyle {
        return .none
    }

    func tableView(_ tableView: UITableView, moveRowAt sourceIndexPath: IndexPath, to destinationIndexPath: IndexPath) {
        var moved = products.value
        moved.insert(moved.remove(at: sourceIndexPath.row), at: destinationIndexPath.row)
        let low = min(sourceIndexPath.row, destinationIndexPath.row)
        let hi = max(sourceIndexPath.row, destinationIndexPath.row)
        Single
            .zip(
                moved
                    .enumerated()
                    .dropFirst(low)
                    .prefix(hi - low + 1)
                    .map { sort, type in
                        ModProductMutation(product: ProductMod.init(
                            productId: type.id,
                            name: nil,
                            quantity: nil,
                            discontinued: nil,
                            sort: sort
                        ))
                    }
                    .map { ConArtist.API.GraphQL.observe(mutation: $0) }
            )
            .flatMap { _ in ConArtist.API.GraphQL.observe(query: FullUserQuery()) }
            .subscribe(
                onSuccess: { user in
                    ConArtist.model.merge(graphQL: user.user.fragments.fullUserFragment)
                },
                onError: { [weak self] error in
                    self?.showAlert(
                        title: "An unknown error has occurred"¡,
                        message: "Some actions might not have been saved. Please try again later"¡
                    )
                }
            )
            .disposed(by: disposeBag)

        ConArtist.model.products.accept(moved)
    }
}

// MARK: - Navigation

extension ManageProductsViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .products
    static let ID = "ManageProducts"

    static func show(for productType: ProductType) {
        let controller = instantiate()
        controller.productType = productType
        ConArtist.model.navigate(push: controller)
    }
}
