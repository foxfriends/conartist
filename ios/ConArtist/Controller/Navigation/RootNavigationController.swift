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
            .drive(onNext: { [unowned self] (previous, current) in
                let viewControllers = current.filter { switch $0 { case .Modal: return false; default: return true } }.map { $0.viewController }
                var animated: Bool = true
                if previous.count < current.count, let last = current.last {
                    switch last {
                    case .Appear: animated = false
                    case .Modal(let vc):
                        self.present(vc, animated: true)
                    case .Over(let vc):
                        // TODO: when something needs to be presented over something else, figure out how to
                        //       actually do it
                        self.present(vc, animated: true)
                    default: break
                    }
                } else if previous.count > current.count {
                    if case .Modal(let vc) = previous.last! {
                        vc.dismiss(animated: true)
                        animated = false
                    }
                }
                self.setViewControllers(viewControllers, animated: animated)
            })
            .disposed(by: disposeBag)

        SplashScreenViewController.show()
    }
}

