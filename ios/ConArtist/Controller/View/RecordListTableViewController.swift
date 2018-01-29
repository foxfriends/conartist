//
//  RecordListTableViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class RecordListTableViewController: UITableViewController {
    fileprivate static let ID = "RecordList"
    fileprivate var ørecords: Observable<[Record]>!
    fileprivate var øproductTypes: Observable<[ProductType]>!
    fileprivate var øproducts: Observable<[Product]>!
    
    fileprivate var _records: [Record] = []
    fileprivate var _productTypes: [ProductType] = []
    fileprivate var _products: [Product] = []
    
    fileprivate let disposeBag = DisposeBag()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        Observable.combineLatest([
            ørecords.map { [weak self] in self?._records = $0 },
            øproductTypes.map { [weak self] in self?._productTypes = $0 },
            øproducts.map { [weak self] in self?._products = $0 }
        ])
            .subscribe({ [weak self] _ in self?.tableView.reloadData() })
            .disposed(by: disposeBag)
    }
}

// MARK: - TableView
extension RecordListTableViewController {
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? _records.count : 0
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: RecordTableViewCell.ID, for: indexPath) as! RecordTableViewCell
        if let record = _records.nth(indexPath.row) {
            cell.fill(with: record, using: _productTypes, and: _products)
        }
        return cell
    }
}

// MARK: - Navigation
extension RecordListTableViewController {
    class func addAsTab(to navigator: UITabBarController, for ørecords: Observable<[Record]>, _ øproductTypes: Observable<[ProductType]>, and øproducts: Observable<[Product]>) {
        let controller = RecordListTableViewController.instantiate(withId: RecordListTableViewController.ID) as! RecordListTableViewController
        controller.ørecords = ørecords
        controller.øproductTypes = øproductTypes
        controller.øproducts = øproducts
        navigator.viewControllers?.append(controller)
    }
}
