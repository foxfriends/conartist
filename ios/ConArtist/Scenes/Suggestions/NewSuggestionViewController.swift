//
//  NewSuggestionViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class NewSuggestionViewController: ConArtistViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var disclaimerLabel: UILabel!
    @IBOutlet weak var suggestionTextView: UITextView!

    fileprivate let disposeBag = DisposeBag()
    fileprivate let results = PublishSubject<String>()
    deinit { results.onCompleted() }
}

// MARK: - Lifecycle

extension NewSuggestionViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLocalization()
        setupSubscriptions()
    }
}

// MARK: - UI

extension NewSuggestionViewController {
    fileprivate func setupLocalization() {
        navBar.leftButtonTitle = "Back"¡
        navBar.title = "Make a suggestion"¡
        navBar.rightButtonTitle = "Save"¡
        disclaimerLabel.text = "<Suggestion disclaimer>"¡
    }
}

// MARK: - Subscriptions

extension NewSuggestionViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .withLatestFrom(suggestionTextView.rx.text)
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

extension NewSuggestionViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .suggestions
    static let ID: String = "NewSuggestion"
    static func present() -> Observable<String> {
        let controller = instantiate()
        ConArtist.model.navigate(push: controller)
        return controller.results.asObservable()
    }
}
