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
    @IBOutlet weak var priceTextField: UITextField!
    @IBOutlet weak var selectedProductsCollectionView: UICollectionView!
    @IBOutlet weak var productsTableView: UITableView!
    @IBOutlet weak var selectedProductsFlowLayout: UICollectionViewFlowLayout!
    @IBOutlet weak var cancelButton: UIButton!
    @IBOutlet weak var saveButton: UIButton!
    @IBOutlet weak var titleLabel: UILabel!
    
    fileprivate let øselectedProducts = Variable<[Product]>([])
    fileprivate var price = Money(currency: .CAD, amount: 0)
    
    fileprivate var productType: ProductType!
    fileprivate var products: [Product]!
    fileprivate var prices: [Prices]!

    fileprivate let results = PublishSubject<([Product], Money)>()
}

extension ProductListViewController {
    fileprivate func updateSelection() {
        selectedProductsCollectionView.reloadData()
        price = calculatePrice()
        priceTextField.text = price.toString()
    }
    
    fileprivate func calculatePrice() -> Money {
        guard prices.count > 0 else { return Money(currency: .CAD, amount: 0) }
        let matters = prices.filterMap { $0.productId }
        let items: [Int: Int] = øselectedProducts.value.reduce([:]) { counts, product in
            let id = matters.contains(product.id) ? product.id : ConArtist.NoID
            var updated = counts
            let previous = counts[id] ?? 0
            updated[id] = previous + 1
            return updated
        }
        return items.reduce(Money(currency: .CAD, amount: 0)) { price, item in
            let id = item.key
            var count = item.value
            guard let prices = self.prices.first(where: { $0.productId ?? ConArtist.NoID == id })?.prices.sorted(by: { $0.key < $1.key }) else {
                return price
            }
            var newPrice = price
            while count > 0 {
                let price = prices.reduce((key: 0, value: Money(currency: .CAD, amount: 0))) { best, price in
                    if price.key <= count && price.key > best.key {
                        return price
                    } else {
                        return best
                    }
                }
                count -= price.key
                newPrice += price.value
            }
            return newPrice
        }
    }
}

// MARK: - Lifecycle
extension ProductListViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        titleLabel.text = productType.name
        
        øselectedProducts
            .asDriver()
            .map(const(()))
            .drive(onNext: updateSelection)
            .disposed(by: disposeBag)
        
        selectedProductsFlowLayout.estimatedItemSize = CGSize(width: 1, height: 1)
        
        cancelButton.rx.tap
            .subscribe({ _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)
        
        saveButton.rx.tap
            .subscribe({ [results, øselectedProducts, price] _ in
                ConArtist.model.navigate(back: 1)
                results.onNext((øselectedProducts.value, price))
            })
            .disposed(by: disposeBag)
        
        priceTextField.rx.value
            .filterMap { Money.parse(as: .CAD, $0 ?? "") }
            .subscribe(onNext: { [unowned self] in self.price = $0 })
            .disposed(by: disposeBag)
    }
}

// MARK: - UICollectionViewDataSource
extension ProductListViewController: UICollectionViewDataSource {
    func numberOfSections(in collectionView: UICollectionView) -> Int {
        return 1
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return section == 0 ? øselectedProducts.value.count : 0
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: ChipCollectionViewCell.ID, for: indexPath) as! ChipCollectionViewCell
        cell.setup(with: øselectedProducts.value[indexPath.row].name)
        return cell
    }
}

// MARK: - UICollectionViewDelegate
extension ProductListViewController: UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        øselectedProducts.value.remove(at: indexPath.row)
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
        cell.setup(with: products[indexPath.row])
        return cell
    }
}

// MARK: - UITableViewDelegate
extension ProductListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        øselectedProducts.value.append(products[indexPath.row])
    }
}

// MARK: - Navigation
extension ProductListViewController {
    class func show(for productType: ProductType, _ products: [Product], and prices: [Price]) -> Observable<([Product], Money)> {
        let controller: ProductListViewController = ProductListViewController.instantiate(withId: ProductListViewController.ID)
        controller.productType = productType
        controller.products = products
        controller.prices = Prices.condense(prices)
        ConArtist.model.navigate(push: controller)
        return controller.results.asObservable()
    }
}
