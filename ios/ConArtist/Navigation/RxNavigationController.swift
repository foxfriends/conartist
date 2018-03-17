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
            .asDriver(onErrorJustReturn: [])
            .scan(([], [])) { previous, next in
                return (next, previous.0)
            }
            .map { views, previous in (views, views.count < previous.count ? previous.last : nil) }
            .drive(onNext: { [unowned self] views, toDismiss in
                // to ensure the main thread is not asleep at this time? or something?
                // there were some cases where the views would not appear on time
                CFRunLoopWakeUp(CFRunLoopGetCurrent())
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
                    self.viewControllers.last?.dismiss(animated: toDismiss?.animatedExit ?? true)
                }
                if self.viewControllers != viewControllers {
                    self.setViewControllers(viewControllers, animated: !dismiss && (viewControllers.count < self.viewControllers.count || (!hasPresentedView && myViews.last?.animatedEntry ?? false)))
                }
                if hasPresentedView {
                    if viewControllers.last?.presentedViewController == nil {
                        let øtheirViews = self.øviews
                            .map { $0.dropFirst(myViews.count) }
                            .map(Array.init)
                            .filter { !$0.isEmpty }
                        let controller = RxNavigationController.create(basedOn: øtheirViews)
                        let item = views[myViews.count]
                        if case .Over = item {
                            controller.modalPresentationStyle = .overFullScreen
                        }
                        viewControllers.last?.present(controller, animated: item.animatedEntry)
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

