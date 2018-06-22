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
    fileprivate enum ErrorState {
        case IncorrectCredentials
        
        func message() -> String {
            switch self {
            case .IncorrectCredentials:
                return "Your email or password is incorrect"¡
            }
        }
    }

    @IBOutlet weak var contentScrollView: UIScrollView!
    @IBOutlet weak var emailTextField: FancyTextField!
    @IBOutlet weak var passwordTextField: FancyTextField!
    @IBOutlet weak var signInButton: FancyButton!
    
    fileprivate let øerrorState = PublishSubject<ErrorState>()
    
    let disposeBag = DisposeBag()
}

// MARK: - Lifecycle
extension SignInViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLocalization()
        setupSubscriptions()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        startAdjustingForKeyboard()
        emailTextField.text = nil
        passwordTextField.text = nil
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        NotificationCenter.default.removeObserver(self)
    }
}

// MARK: - Localization
extension SignInViewController {
    fileprivate func setupLocalization() {
        emailTextField.title = "Email"¡
        emailTextField.placeholder = "Email"¡
        passwordTextField.title = "Password"¡
        passwordTextField.placeholder = "Password"¡
        signInButton.setTitle("Sign in"¡, for: .normal)
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
                ConArtist.API.Auth.signIn(email: credentials.0 ?? "", password: credentials.1 ?? "")
                    .map(const(true))
                    .catchError { _ in
                        øerrorState.on(.next(.IncorrectCredentials))
                        return Observable.just(false)
                    }
            }
            .do(onNext: { [signInButton] _ in signInButton?.isEnabled = true })
            .filter(identity)
            .subscribe({ _ in ConventionListViewController.show() })
            .disposed(by: disposeBag)

        emailTextField.rx.controlEvent([.editingDidEndOnExit])
            .subscribe(onNext: { [passwordTextField] _ in passwordTextField?.becomeFirstResponder() })
            .disposed(by: disposeBag)

        øerrorState
            .map { $0.message() }
            .asDriver(onErrorJustReturn: "An unknown error has occurred"¡)
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
extension SignInViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .SignIn
    static let ID = "SignIn"

    static func show(animated: Bool = true) {
        let controller = instantiate()
        if animated {
            ConArtist.model.navigate(push: controller)
        } else {
            ConArtist.model.navigate(replace: controller)
        }
    }
}
