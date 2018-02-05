//
//  ConventionDetailsTabBarController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class ConventionDetailsTabBarController : UITabBarController {
    fileprivate static let ID = "ConventionDetails"
    fileprivate let disposeBag = DisposeBag()
    var convention: Convention!
}

// MARK: - Lifecycle
extension ConventionDetailsTabBarController {
    override func viewDidLoad() {
        super.viewDidLoad()
        convention
            .fill()
            .subscribe()
            .disposed(by: disposeBag)
        
        let øtypes = convention.productTypes
        let ørecords = convention.records
        let øproducts = convention.products
        let øprices = convention.prices
        setViewControllers(
            [
                ProductTypeListViewController.create(for: convention, with: øtypes, øproducts, and: øprices),
                RecordListViewController.create(for: convention, with: ørecords, øtypes, and: øproducts)
            ],
            animated: false
        )
        
        ConArtist.model.dismissed
            .filterMap { result -> ([Product], Money)? in
                if case .Sale(let products, let money) = result {
                    return (products, money)
                } else {
                    return nil
                }
            }
            .subscribe(onNext: { [unowned self] products, price in
                let newRecord = Record(id: nil, products: products.map { $0.id }, price: price, time: Date())
                self.convention.addRecord(newRecord)
            })
            .disposed(by: disposeBag)
    }
}

// MARK: - Navigation

extension ConventionDetailsTabBarController {
    class func create(for convention: Convention) -> ConventionDetailsTabBarController {
        let controller: ConventionDetailsTabBarController = ConventionDetailsTabBarController.instantiate(withId: ConventionDetailsTabBarController.ID)
        controller.convention = convention
        return controller
    }
}
