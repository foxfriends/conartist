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
    var øconvention: Observable<Convention>!
    override func viewDidLoad() {
        super.viewDidLoad()
        let øtypes = øconvention.flatMap { $0.productTypes }
        let ørecords = øconvention.flatMap { $0.records }
        let øproducts = øconvention.flatMap { $0.products }
        
        setViewControllers(
            [
                ProductTypeListViewController.create(with: øtypes),
                RecordListViewController.create(with: ørecords, øtypes, and: øproducts)
            ],
            animated: false
        )
    }
}

// MARK: - Navigation

extension ConventionDetailsTabBarController {
    class func create(for øconvention: Observable<Convention>) -> ConventionDetailsTabBarController {
        let controller = ConventionDetailsTabBarController.instantiate(withId: ConventionDetailsTabBarController.ID) as! ConventionDetailsTabBarController
        controller.øconvention = øconvention
        return controller
    }
}
