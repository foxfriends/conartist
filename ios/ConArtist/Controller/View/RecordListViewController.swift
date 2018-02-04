//
//  RecordListViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class RecordListViewController: UIViewController {
    fileprivate static let ID = "RecordList"
    @IBOutlet weak var recordsTableView: UITableView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var backButton: UIButton!
    
    fileprivate var convention: Convention!
    fileprivate var ørecords: Observable<[Record]>!
    fileprivate var øproductTypes: Observable<[ProductType]>!
    fileprivate var øproducts: Observable<[Product]>!
    
    fileprivate var records: [Record] = []
    fileprivate var productTypes: [ProductType] = []
    fileprivate var products: [Product] = []
    
    fileprivate let disposeBag = DisposeBag()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        Observable.combineLatest([
            ørecords.map { [weak self] in self?.records = $0 },
            øproductTypes.map { [weak self] in self?.productTypes = $0 },
            øproducts.map { [weak self] in self?.products = $0 }
        ])
            .asDriver(onErrorJustReturn: [])
            .drive(onNext: { [weak self] _ in self?.recordsTableView.reloadData() })
            .disposed(by: disposeBag)
        
        backButton.rx.tap
            .filter { [unowned self] _ in self.tabBarController?.selectedViewController == self }
            .subscribe({ _ in ConArtist.model.page.value.removeLast() })
            .disposed(by: disposeBag)
        
        titleLabel.text = convention.name
    }
}

// MARK: - TableView
extension RecordListViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? records.count : 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: RecordTableViewCell.ID, for: indexPath) as! RecordTableViewCell
        if let record = records.nth(indexPath.row) {
            cell.fill(with: record, using: productTypes, and: products)
        }
        return cell
    }
}

// MARK: - Navigation
extension RecordListViewController {
    class func create(for convention: Convention, with ørecords: Observable<[Record]>, _ øproductTypes: Observable<[ProductType]>, and øproducts: Observable<[Product]>) -> RecordListViewController {
        let controller: RecordListViewController = RecordListViewController.instantiate(withId: RecordListViewController.ID)
        controller.convention = convention
        controller.ørecords = ørecords
        controller.øproductTypes = øproductTypes
        controller.øproducts = øproducts
        return controller
    }
}
