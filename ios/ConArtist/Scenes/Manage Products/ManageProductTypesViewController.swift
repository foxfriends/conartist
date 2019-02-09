//
//  ManageProductTypesViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-10-30.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import SVGKit

enum Mode {
    case products
    case prices
}

class ManageProductTypesViewController : ConArtistViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var productTypesTableView: UITableView!
    @IBOutlet weak var newProductTypeButton: UIButton!
    @IBOutlet weak var newProductTypeImageView: SVGKFastImageView!

    fileprivate var mode: Mode!
    fileprivate let refreshControl = UIRefreshControl()
}

// MARK: - Lifecycle

extension ManageProductTypesViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupSubscriptions()
        setupLocalization()
        setupRefreshControl()
    }

    private func setupRefreshControl() {
        productTypesTableView.refreshControl = refreshControl
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

// MARK: - UI

extension ManageProductTypesViewController {
    fileprivate func setupUI() {
        switch mode! {
        case .products:
            productTypesTableView.allowsSelectionDuringEditing = true
            productTypesTableView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: 88, right: 0)
            newProductTypeImageView.image = .add
            newProductTypeButton.addShadow()
        case .prices:
            newProductTypeButton.isHidden = true
            newProductTypeImageView.isHidden = true
        }
    }
}

// MARK: - Localization

extension ManageProductTypesViewController {
    fileprivate func setupLocalization() {
        switch mode! {
        case .products:
            navBar.title = "Manage Products"¡
            navBar.leftButtonTitle = "Back"¡
            navBar.rightButtonTitle = "Edit"¡
        case .prices:
            navBar.title = "Manage Prices"¡
            navBar.leftButtonTitle = "Back"¡
            navBar.rightButtonTitle = nil
        }
    }
}

// MARK: - Subscriptions

extension ManageProductTypesViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        if case .products = mode! {
            navBar.rightButton.rx.tap
                .subscribe(onNext: { [navBar, productTypesTableView = productTypesTableView!, newProductTypeButton] _ in
                    let editing = !productTypesTableView.isEditing
                    productTypesTableView.setEditing(editing, animated: true)
                    navBar?.rightButtonTitle = editing ? "Done"¡ : "Edit"¡
                    navBar?.leftButton.isEnabled = !editing
                    newProductTypeButton?.isHidden = editing
                })
                .disposed(by: disposeBag)

            newProductTypeButton.rx.tap
                .subscribe(onNext: { _ in EditProductTypeViewController.createNewProductType() })
                .disposed(by: disposeBag)
        }

        ConArtist.model.productTypes
            .subscribe(onNext: { [productTypesTableView] _ in productTypesTableView?.reloadData() })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource

extension ManageProductTypesViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return ConArtist.model.productTypes.value.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ManageProductTypeTableViewCell.ID, for: indexPath) as! ManageProductTypeTableViewCell
        cell.setup(with: ConArtist.model.productTypes.value[indexPath.row])
        return cell
    }
}

// MARK: - UITableViewDelegate

extension ManageProductTypesViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let type = ConArtist.model.productTypes.value[indexPath.row]
        if tableView.isEditing {
            EditProductTypeViewController.show(for: type)
        } else {
            switch mode! {
            case .products:
                ManageProductsViewController.show(for: type)
            case .prices:
                ManagePricesViewController.show(for: type)
            }
        }
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
        var moved = ConArtist.model.productTypes.value
        moved.insert(moved.remove(at: sourceIndexPath.row), at: destinationIndexPath.row)
        let low = min(sourceIndexPath.row, destinationIndexPath.row)
        let hi = max(sourceIndexPath.row, destinationIndexPath.row)
        Observable
            .zip(
                moved
                    .enumerated()
                    .dropFirst(low)
                    .prefix(hi - low + 1)
                    .map { sort, type in
                        ModProductTypeMutation(productType: ProductTypeMod(
                            typeId: type.id,
                            name: nil,
                            color: nil,
                            discontinued: nil,
                            sort: sort
                        ))
                    }
                    .map { ConArtist.API.GraphQL.observe(mutation: $0) }
            )
            .flatMapLatest { _ in ConArtist.API.GraphQL.observe(query: FullUserQuery()) }
            .subscribe(
                onNext: { user in
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

        ConArtist.model.productTypes.accept(moved)
    }
}

// MARK: - Navigation

extension ManageProductTypesViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .products
    static let ID = "ManageProductTypes"

    static func present(mode: Mode = .products) {
        let controller = instantiate()
        controller.mode = mode
        ConArtist.model.navigate(push: controller)
    }
}
