//
//  RootNavigationController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-02.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class RootNavigationController: UINavigationController {
    static let ID = "Root"
    let disposeBag = DisposeBag()
    
    override func viewDidLoad() {
        super.viewDidLoad()

        ConArtist.model.page
            .asObservable()
            .scan(([], [])) { previous, next in (previous.1, next) }
            .asDriver(onErrorJustReturn: ([], []))
            .drive(onNext: { [weak self] (previous, current) in
                guard let `self` = self else { return }
                if previous.count < current.count {
                    self.pushViewController(self.viewController(for: current.last!), animated: true)
                } else {
                    self.popToViewController(self.viewControllers[current.count - 1], animated: true)
                }
            })
            .disposed(by: disposeBag)
    }
    
    private func viewController(for page: Model.Page) -> UIViewController {
        switch page {
        case .SignIn:
            return SignInViewController.create()
        case .Conventions:
            return ConventionListViewController.create()
        case .Convention(let convention):
            return ConventionDetailsTabBarController.create(for: convention)
        case .Products(let productType, let products, let prices):
            return ProductListViewController.create(for: productType, products, and: prices)
        case .Settings(let settings):
            return SettingsViewController.create(for: settings)
        }
    }
}

// MARK: - Navigation
extension RootNavigationController {
    class func create() -> RootNavigationController {
        return RootNavigationController.instantiate(withId: RootNavigationController.ID) as! RootNavigationController
    }
}
