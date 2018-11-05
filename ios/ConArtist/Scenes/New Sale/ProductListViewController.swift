//
//  ProductListViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxCocoa
import RxSwift

class ProductListViewController : ConArtistViewController {
    fileprivate let disposeBag = DisposeBag()

    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var productsTableView: UITableView!

    fileprivate var productType: ProductType!
    fileprivate var records: [Record]!
    fileprivate var products: [Product]!
    fileprivate var selected: BehaviorRelay<[Product]>!
}

// MARK: - Lifecycle
extension ProductListViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        navBar.title = productType.name
        navBar.leftButtonTitle = "Continue"¡
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension ProductListViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return products.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ProductTableViewCell.ID) as! ProductTableViewCell
        let product = products[indexPath.row]
        cell.setup(with: product, records: records, count: selected.value.count(occurrencesOf: product))
        return cell
    }
}

// MARK: - UITableViewDelegate
extension ProductListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        selected.accept(selected.value + [products[indexPath.row]])
        tableView.reloadRows(at: [indexPath], with: .none)
    }

    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        let product = products[indexPath.row]
        var actions: [UIContextualAction] = []
        if selected.value.count(occurrencesOf: product) > 0 {
            let removeAllAction = UIContextualAction(style: .normal, title: "Remove all"¡) { [selected, products, productsTableView, records] _, _, reset in
                selected?.accept(selected!.value.filter((!=) <- products![indexPath.row]))
                if let cell = productsTableView?.cellForRow(at: indexPath) as? ProductTableViewCell {
                    cell.setup(with: product, records: records!, count: selected!.value.count(occurrencesOf: product))
                }
                reset(true)
            }
            removeAllAction.backgroundColor = .warn
            actions.append(removeAllAction)
        }
        let config = UISwipeActionsConfiguration(actions: actions)
        config.performsFirstActionWithFullSwipe = true
        return config
    }

    func tableView(_ tableView: UITableView, didHighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = true
    }

    func tableView(_ tableView: UITableView, didUnhighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = false
    }
}

// MARK: - Navigation
extension ProductListViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .sale
    static let ID = "ProductList"

    static func show(for productType: ProductType, and products: [Product], records: [Record], selected: BehaviorRelay<[Product]>) {
        let controller = instantiate()
        controller.productType = productType
        controller.products = products
        controller.records = records
        controller.selected = selected
        ConArtist.model.navigate(push: controller)
    }
}
