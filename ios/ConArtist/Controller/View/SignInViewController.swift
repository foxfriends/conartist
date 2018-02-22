//
//  SignInViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-10-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import RxCocoa

class SignInViewController: UIViewController {
    fileprivate static let ID = "SignIn"
    
    fileprivate enum ErrorState {
        case IncorrectCredentials
        
        func message() -> String {
            switch self {
            case .IncorrectCredentials:
                return "Your email or password is incorrect"
            }
        }
    }

    @IBOutlet weak var contentScrollView: UIScrollView!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var signInButton: UIButton!
    
    fileprivate let øerrorState = PublishSubject<ErrorState>()
    
    let disposeBag = DisposeBag()

    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}

// MARK: - Lifecycle
extension SignInViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        startAdjustingForKeyboard()
        setupSubscriptions()

        if ConArtist.API.authToken != ConArtist.API.Unauthorized {
            ConArtist.model.navigateTo(page: .Conventions)
            Auth.reauthorize()
                .subscribe(
                    onError: {
                        print("Sign in failed: \($0)")
                        ConArtist.model.page.value = [.SignIn]
                        ConArtist.API.authToken = ConArtist.API.Unauthorized
                    }
                )
                .disposed(by: disposeBag)
        }
    }
}

// MARK: - Subscriptions
extension SignInViewController {
    fileprivate func setupSubscriptions() {
        let øcredentials = Observable.combineLatest(emailTextField.rx.text, passwordTextField.rx.text)
        Observable.merge(
            signInButton.rx.tap.map(const(())),
            passwordTextField.rx.controlEvent([.editingDidEndOnExit]).map(const(()))
            )
            .filter { [signInButton] in signInButton?.isEnabled ?? false }
            .do(onNext: { [signInButton] in signInButton?.isEnabled = false })
            .withLatestFrom(øcredentials)
            .flatMap { [øerrorState] credentials in
                Auth.signIn(email: credentials.0 ?? "", password: credentials.1 ?? "")
                    .map(const(true))
                    .catchError { _ in
                        øerrorState.on(.next(.IncorrectCredentials))
                        return Observable.just(false)
                    }
            }
            .do(onNext: { [signInButton] _ in signInButton?.isEnabled = true })
            .filter(identity)
            .subscribe({ _ in ConArtist.model.navigateTo(page: .Conventions) })
            .disposed(by: disposeBag)

        emailTextField.rx.controlEvent([.editingDidEndOnExit])
            .subscribe(onNext: { [passwordTextField] _ in passwordTextField?.becomeFirstResponder() })
            .disposed(by: disposeBag)

        øerrorState
            .map { $0.message() }
            .asDriver(onErrorJustReturn: "An unknown error has occurred")
            .drive(onNext: { [emailTextField] in emailTextField?.showTooltip(text: $0) })
            .disposed(by: disposeBag)
    }
}

// MARK: - Keyboard handling
extension SignInViewController {
    fileprivate func startAdjustingForKeyboard() {
        NotificationCenter.default.addObserver(self, selector: #selector(adjustForKeyboard), name: Notification.Name.UIKeyboardWillHide, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(adjustForKeyboard), name: Notification.Name.UIKeyboardWillChangeFrame, object: nil)
    }

    @objc func adjustForKeyboard(notification: Notification) {
        let keyboardScreenEndFrame = (notification.userInfo?[UIKeyboardFrameEndUserInfoKey] as! NSValue).cgRectValue
        let keyboardViewEndFrame = view.convert(keyboardScreenEndFrame, from: view.window)

        if notification.name == Notification.Name.UIKeyboardWillHide {
            contentScrollView.contentInset = UIEdgeInsets.zero
            contentScrollView.scrollIndicatorInsets = UIEdgeInsets.zero
        } else {
            contentScrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: keyboardViewEndFrame.height + 40, right: 0)
            contentScrollView.scrollIndicatorInsets = UIEdgeInsets(top: 0, left: 0, bottom: keyboardViewEndFrame.height, right: 0)
        }
    }
}

// MARK: - Navigation
extension SignInViewController {
    class func create() -> SignInViewController {
        return SignInViewController.instantiate(withId: SignInViewController.ID)
    }
}
