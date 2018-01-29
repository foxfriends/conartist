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
        
        ProductTypeListTableViewController.addAsTab(to: self, for: øtypes)
        RecordListTableViewController.addAsTab(to: self, for: ørecords, øtypes, and: øproducts)
    }
}

// MARK: - Navigation

extension ConventionDetailsTabBarController {
    class func push(to navigator: UINavigationController, for øconvention: Observable<Convention>) {
        let controller = ConventionDetailsTabBarController.instantiate(withId: ConventionDetailsTabBarController.ID) as! ConventionDetailsTabBarController
        controller.øconvention = øconvention
        navigator.pushViewController(controller, animated: true)
    }
}
