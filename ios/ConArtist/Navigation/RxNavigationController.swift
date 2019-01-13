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
    var views: Observable<[Model.Presentation]>!
    var viewCount: Int = 0

    var currentViewController: UIViewController? {
        let top = self.viewControllers.last
        if let presented = top?.presentedViewController {
            if let nav = presented as? RxNavigationController {
                return nav.currentViewController
            }
            return presented
        }
        return top
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        isNavigationBarHidden = true
        interactivePopGestureRecognizer?.addTarget(self, action: #selector(handleInteractivePopGesture))
        interactivePopGestureRecognizer?.delegate = self

        views
            .asDriver(onErrorJustReturn: [])
            .scan(([], [])) { previous, next in
                return (next, previous.0)
            }
            .map { views, previous in (views, views.count < previous.count ? previous.last : nil) }
            .drive(onNext: { [unowned self] views, toDismiss in
                self.viewCount = views.count
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
                        let theirViews = self.views
                            .map { $0.dropFirst(myViews.count) }
                            .map(Array.init)
                            .filter { !$0.isEmpty }
                        let controller = RxNavigationController.create(basedOn: theirViews)
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

// MARK: - UIGestureRecognizerDelegate

extension RxNavigationController: UIGestureRecognizerDelegate {
    func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
        return viewCount > 1 && !(topViewController is ConventionListViewController)
    }

    @objc private func handleInteractivePopGesture(_ gesture: UIScreenEdgePanGestureRecognizer) {
        switch gesture.state {
        case .ended:
            // NOTE: a little sketchy, but it will have to do for now...
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                if self.viewControllers.count != self.viewCount {
                    ConArtist.model.navigate(back: 1)
                }
            }
        default:
            break
        }
    }
}

extension RxNavigationController {
    class func create(basedOn views: Observable<[Model.Presentation]>) -> RxNavigationController {
        let controller = RxNavigationController()
        controller.views = views
        return controller
    }
}
