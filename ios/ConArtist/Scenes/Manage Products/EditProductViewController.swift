//
//  EditProductViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-10-31.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class EditProductViewController: UIViewController {
    @IBOutlet weak var navBar: FakeNavBar!

    fileprivate var product: Product!
    fileprivate let disposeBag = DisposeBag()
}

// MARK: - Navigation

extension EditProductViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .Products
    static let ID = "EditProductType"

    static func show(for product: Product) {
        let controller = instantiate()
        controller.product = product
        ConArtist.model.navigate(push: controller)
    }
}
