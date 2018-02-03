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
    fileprivate var øproductTypes: Observable<[ProductType]>!
    fileprivate var productTypes: [ProductType]!
    fileprivate let disposeBag = DisposeBag()
}

// MARK: - Lifecycle
extension ProductTypeListViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        øproductTypes
            .map({ [weak self] in self?.productTypes = $0 })
            .subscribe(onNext: productTypesTableView.reloadData)
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension ProductTypeListViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? productTypes.count : 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ProductTypeCell", for: indexPath) as! ProductTypeTableViewCell
        if indexPath.row < productTypes.count {
            let item = productTypes[indexPath.row]
            cell.fill(with: item)
        }
        return cell
    }
}

// MARK: - UITableViewDelegate
extension ProductTypeListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        // TODO:
        // -   Set focused product type
        // -   Navigate to product page
    }
}

// MARK: Navigation
extension ProductTypeListViewController {
    class func create(with øtypes: Observable<[ProductType]>) -> ProductTypeListViewController {
        let controller: ProductTypeListViewController = ProductTypeListViewController.instantiate(withId: ProductTypeListViewController.ID)
        controller.øproductTypes = øtypes
        return controller
    }
}
