//
//  RxNavigationController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-02.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class RxNavigationController: UINavigationController {
    let disposeBag = DisposeBag()
    var øviews: Observable<[Model.Presentation]>!

    override func viewDidLoad() {
        super.viewDidLoad()
        isNavigationBarHidden = true

        øviews
            .asObservable()
            .asDriver(onErrorJustReturn: [])
            .drive(onNext: { [unowned self] views in
                let myViews = views
                    .enumerated()
                    .prefix { index, item in
                        if index == 0 { return true }
                        switch item {
                        case .Push, .Appear: return true
                        case .Modal, .Over: return false
                        }
                    }
                    .map { _, item in item }

                let hasPresentedView = myViews.count < views.count
                let dismiss = !hasPresentedView && self.viewControllers.last?.presentedViewController != nil
                let viewControllers = myViews.map { $0.viewController }
                if dismiss {
                    self.viewControllers.last?.dismiss(animated: true)
                }
                if self.viewControllers != viewControllers {
                    self.setViewControllers(viewControllers, animated: !dismiss && (viewControllers.count < self.viewControllers.count || (!hasPresentedView && myViews.last?.animated ?? false)))
                }
                if hasPresentedView {
                    if viewControllers.last?.presentedViewController == nil {
                        let øtheirViews = self.øviews
                            .map { $0.dropFirst(myViews.count) }
                            .map(Array.init)
                            .filter { !$0.isEmpty }
                        viewControllers.last?.present(RxNavigationController.create(basedOn: øtheirViews), animated: true)
                    }
                }
            })
            .disposed(by: disposeBag)
    }
}

extension RxNavigationController {
    class func create(basedOn øviews: Observable<[Model.Presentation]>) -> RxNavigationController {
        let controller = RxNavigationController()
        controller.øviews = øviews
        return controller
    }
}

