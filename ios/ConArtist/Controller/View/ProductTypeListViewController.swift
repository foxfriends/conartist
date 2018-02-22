//
//  ProductTypeListViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class ProductTypeListViewController: UIViewController {
    fileprivate static let ID = "ProductTypeList"
    @IBOutlet weak var productTypesTableView: UITableView!
    @IBOutlet weak var backButton: UIButton!
    @IBOutlet weak var titleLabel: UILabel!
    fileprivate var convention: Convention!
    fileprivate let øproductTypes = Variable<[ProductType]>([])
    fileprivate let øproducts = Variable<[Product]>([])
    fileprivate let øprices = Variable<[Price]>([])
    fileprivate let disposeBag = DisposeBag()
}

// MARK: - Lifecycle
extension ProductTypeListViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        øproductTypes
            .asDriver()
            .map(const(()))
            .drive(onNext: productTypesTableView.reloadData)
            .disposed(by: disposeBag)
        
        titleLabel.text = convention.name
        
        backButton.rx.tap
            .filter { [tabBarController] _ in tabBarController?.selectedViewController == self }
            .subscribe { _ in ConArtist.model.goBack() }
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension ProductTypeListViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? øproductTypes.value.count : 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ProductTypeTableViewCell.ID, for: indexPath) as! ProductTypeTableViewCell
        if indexPath.row < øproductTypes.value.count {
            let item = øproductTypes.value[indexPath.row]
            cell.fill(with: item)
        }
        return cell
    }
}

// MARK: - UITableViewDelegate
extension ProductTypeListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let productType = øproductTypes.value[indexPath.row]
        let products = øproducts.value.filter { $0.typeId == productType.id }
        let prices = øprices.value.filter { $0.typeId == productType.id }
        ConArtist.model.navigateTo(page: .Products(productType, products, prices))
    }
}

// MARK: Navigation
extension ProductTypeListViewController {
    class func create(for convention: Convention, with øproductTypes: Observable<[ProductType]>, _ øproducts: Observable<[Product]>, and øprices: Observable<[Price]>) -> ProductTypeListViewController {
        let controller: ProductTypeListViewController = ProductTypeListViewController.instantiate(withId: ProductTypeListViewController.ID)

        controller.convention = convention
        øproducts
            .bind(to: controller.øproducts)
            .disposed(by: controller.disposeBag)
        øproductTypes
            .bind(to: controller.øproductTypes)
            .disposed(by: controller.disposeBag)
        øprices
            .bind(to: controller.øprices)
            .disposed(by: controller.disposeBag)
        return controller
    }
}
