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

class ManageProductsViewController: UIViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var productsTableView: UITableView!

    fileprivate var productType: ProductType!
    fileprivate let products = BehaviorRelay<[Product]>(value: [])
    fileprivate let disposeBag = DisposeBag()
}

// MARK: - Lifecycle

extension ManageProductsViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupSubscriptions()
        navBar.title = productType.name
        navBar.leftButtonTitle = "Back"¡
        navBar.rightButtonTitle = "Reorder"¡
    }
}

// MARK: - Subscriptions

extension ManageProductsViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { [weak self] _ in self?.navigationController?.popViewController(animated: true) })
            .disposed(by: disposeBag)

        ConArtist.model.products
            .map { [productType] in $0.filter { $0.typeId == productType!.id } }
            .bind(to: products)
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
        let product = products.value[indexPath.row]
        _ = product // TODO: show the edit product page
    }

    func tableView(_ tableView: UITableView, didHighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = true
    }

    func tableView(_ tableView: UITableView, didUnhighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = false
    }
}

// MARK: - Navigation

extension ManageProductsViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .Products
    static let ID = "ManageProducts"

    static func present(for productType: ProductType) {
        let controller = instantiate()
        controller.productType = productType
        ConArtist.model.navigate(push: controller)
    }
}
