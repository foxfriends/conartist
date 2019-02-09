//
//  NewConventionUserInfoViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-06.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation
import UIKit
import RxSwift

class NewConventionUserInfoViewController : ConArtistViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var infoTextView: UITextView!
    @IBOutlet weak var disclaimerLabel: UILabel!

    fileprivate let results = PublishSubject<String>()

    deinit { results.onCompleted() }
}

// MARK: - Lifecycle
extension NewConventionUserInfoViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLocalization()
        setupSubscriptions()
    }
}

// MARK: - Localization
extension NewConventionUserInfoViewController {
    fileprivate func setupLocalization() {
        navBar.leftButtonTitle = "Cancel"¡
        navBar.rightButtonTitle = "Save"¡
        navBar.title = "Share Info"¡
        disclaimerLabel.text = "<Convention info contribution disclaimer>"¡
    }
}

// MARK: - Subscriptions
extension NewConventionUserInfoViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .withLatestFrom(infoTextView.rx.text)
            .map { $0 ?? "" }
            .filter { !$0.isEmpty }
            .subscribe(onNext: { [results] text in
                results.onNext(text)
                ConArtist.model.navigate(back: 1)
            })
            .disposed(by: disposeBag)
    }
}

// MARK: - Navigation
extension NewConventionUserInfoViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .convention
    static let ID = "NewConventionUserInfo"

    static func show() -> Observable<String> {
        let controller = instantiate()
        ConArtist.model.navigate(push: controller)
        return controller.results.asObservable()
    }
}
