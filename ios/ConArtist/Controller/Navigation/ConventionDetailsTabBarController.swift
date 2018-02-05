//
//  ConventionDetailsTabBarController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import MaterialComponents.MaterialSnackbar

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
            .flatMap { [unowned self] (products, price) -> Observable<Void> in
                let newRecord = Record(id: nil, products: products.map { $0.id }, price: price, time: Date())
                self.convention.addRecord(newRecord)
                return self.convention.save()
                    .catchError { _ in
                        MDCSnackbarManager.show(MDCSnackbarMessage(text: "Some data could not be saved... Check your network status"))
                        return Observable.empty()
                    }
            }
            .subscribe(onNext: { _ in MDCSnackbarManager.show(MDCSnackbarMessage(text: "Saved!")) })
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
