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
import SVGKit

class ProductListViewController : ConArtistViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var productsTableView: UITableView!

    @IBOutlet weak var searchView: UIView!
    @IBOutlet weak var cancelSearchButton: UIButton!
    @IBOutlet weak var searchTextField: UITextField!

    fileprivate var productType: ProductType!
    fileprivate var records: [Record]!
    fileprivate var products: [Product]!
    fileprivate var selected: BehaviorRelay<[Product]>!

    fileprivate let visibleProducts = BehaviorRelay<[Product]>(value: [])
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
        navBar.rightButtonImage = SVGKImage.search.uiImage
        navBar.rightButton.rx.tap
            .subscribe(onNext: { [searchView] _ in searchView!.isHidden = false })
            .disposed(by: disposeBag)

        cancelSearchButton.conArtistStyle()
        cancelSearchButton.rx.tap
            .subscribe(onNext: { [searchView, searchTextField, visibleProducts, products] _ in
                searchTextField!.text = ""
                searchTextField?.endEditing(true)
                searchView!.isHidden = true
                visibleProducts.accept(products!)
            })
            .disposed(by: disposeBag)

        searchTextField.rx.text
            .map { $0?.lowercased() ?? "" }
            .map { [products] search in search == "" ? products! : products!.filter { $0.name.lowercased().contains(search) } }
            .bind(to: visibleProducts)
            .disposed(by: disposeBag)

        visibleProducts
            .asDriver()
            .drive(onNext: { [productsTableView] _ in productsTableView?.reloadData() })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension ProductListViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return visibleProducts.value.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ProductTableViewCell.ID) as! ProductTableViewCell
        let product = visibleProducts.value[indexPath.row]
        cell.setup(with: product, records: records, count: selected.value.count(occurrencesOf: product))
        return cell
    }
}

// MARK: - UITableViewDelegate
extension ProductListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        selected.accept(selected.value + [visibleProducts.value[indexPath.row]])
        tableView.reloadRows(at: [indexPath], with: .none)
    }

    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        let product = visibleProducts.value[indexPath.row]
        var actions: [UIContextualAction] = []
        if selected.value.count(occurrencesOf: product) > 0 {
            let removeAllAction = UIContextualAction(style: .normal, title: "Remove all"¡) { [selected, visibleProducts, productsTableView, records] _, _, reset in
                selected?.accept(selected!.value.filter((!=) <- visibleProducts.value[indexPath.row]))
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
        controller.visibleProducts.accept(products)
        controller.records = records
        controller.selected = selected
        ConArtist.model.navigate(push: controller)
    }
}
