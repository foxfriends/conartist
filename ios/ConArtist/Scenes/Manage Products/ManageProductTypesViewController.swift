//
//  ManageProductTypesViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-10-30.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class ManageProductTypesViewController: UIViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var productTypesTableView: UITableView!

    fileprivate let disposeBag = DisposeBag()
}

// MARK: - Lifecycle

extension ManageProductTypesViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupSubscriptions()
        navBar.title = "Manage Products"¡
        navBar.leftButtonTitle = "Back"¡
        navBar.rightButtonTitle = "Edit"¡
    }
}

// MARK: - Subscriptions

extension ManageProductTypesViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { [weak self] _ in self?.navigationController?.popViewController(animated: true) })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .subscribe(onNext: { [navBar, productTypesTableView = productTypesTableView!] _ in
                let editing = !productTypesTableView.isEditing
                productTypesTableView.setEditing(editing, animated: true)
                navBar?.rightButtonTitle = editing ? "Done"¡ : "Edit"¡
            })
            .disposed(by: disposeBag)

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

        } else {
            ManageProductsViewController.present(for: type)
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
            .subscribe(onError: { [weak self] error in
                self?.showAlert(
                    title: "An unknown error has occurred"¡,
                    message: "Some actions might not have been saved. Please try again later"¡
                )
            })
            .disposed(by: disposeBag)

        ConArtist.model.productTypes.accept(moved)
    }
}

// MARK: - Navigation

extension ManageProductTypesViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .Products
    static let ID = "ManageProductTypes"

    static func present() {
        ConArtist.model.navigate(push: instantiate())
    }
}
