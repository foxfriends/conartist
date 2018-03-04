//
//  ProductListViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class ProductListViewController: UIViewController {
    fileprivate static let ID = "ProductList"
    fileprivate let disposeBag = DisposeBag()

    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var productsTableView: UITableView!

    fileprivate var productType: ProductType!
    fileprivate var products: [Product]!
    fileprivate var øselected: Variable<[Product]>!
}

// MARK: - Lifecycle
extension ProductListViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        navBar.title = productType.name
        navBar.rightButton.rx.tap
            .subscribe({ _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension ProductListViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? products.count : 0
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ProductTableViewCell.ID) as! ProductTableViewCell
        let product = products[indexPath.row]
        cell.setup(with: product, count: øselected.value.count(occurrencesOf: product))
        return cell
    }
}

// MARK: - UITableViewDelegate
extension ProductListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        øselected.value.append(products[indexPath.row])
        tableView.reloadRows(at: [indexPath], with: .none)
    }

    @available(iOS 11.0, *)
    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        let product = products[indexPath.row]
        var actions: [UIContextualAction] = []
        if øselected.value.count(occurrencesOf: product) > 0 {
            let removeAllAction = UIContextualAction(style: .normal, title: "Remove all") { [øselected, products, productsTableView] _, _, reset in
                øselected?.value = øselected!.value.filter((!=) <- products![indexPath.row])
                (productsTableView?.cellForRow(at: indexPath) as? ProductTableViewCell)?.countView.isHidden = true
                reset(true)
            }
            removeAllAction.backgroundColor = ConArtist.Color.Warn
            actions.append(removeAllAction)
        }
        let config = UISwipeActionsConfiguration(actions: actions)
        config.performsFirstActionWithFullSwipe = true
        return config
    }
}

// MARK: - Navigation
extension ProductListViewController {
    class func show(for productType: ProductType, and products: [Product], selected øselected: Variable<[Product]>) {
        let controller: ProductListViewController = ProductListViewController.instantiate(withId: ProductListViewController.ID)
        controller.productType = productType
        controller.products = products
        controller.øselected = øselected
        ConArtist.model.navigate(push: controller)
    }
}
