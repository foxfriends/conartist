//
//  ProductTypeListTableViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class ProductTypeListTableViewController: UITableViewController {
    fileprivate static let ID = "ProductTypeList"
    fileprivate var øproductTypes: Observable<[ProductType]>!
    fileprivate var productTypes: [ProductType]!
    fileprivate let disposeBag = DisposeBag()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        øproductTypes
            .map({ [weak self] in self?.productTypes = $0 })
            .subscribe(onNext: tableView.reloadData)
            .disposed(by: disposeBag)
    }
}

// MARK: - TableView
extension ProductTypeListTableViewController {
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? productTypes.count : 0
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ProductTypeCell", for: indexPath) as! ProductTypeTableViewCell
        if indexPath.row < productTypes.count {
            let item = productTypes[indexPath.row]
            cell.fill(with: item)
        }
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        // TODO:
        // -   Set focused product type
        // -   Navigate to product page
    }
}

// MARK: Navigation
extension ProductTypeListTableViewController {
    class func addAsTab(to navigator: UITabBarController, for øtypes: Observable<[ProductType]>) {
        let controller = ProductTypeListTableViewController.instantiate(withId: ProductTypeListTableViewController.ID) as! ProductTypeListTableViewController
        controller.øproductTypes = øtypes
        navigator.viewControllers?.append(controller)
    }
}
