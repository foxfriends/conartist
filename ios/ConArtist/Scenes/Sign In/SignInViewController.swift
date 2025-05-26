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

class SignInViewController : ConArtistViewController {
    fileprivate enum ErrorState {
        case incorrectCredentials
        
        func message() -> String {
            switch self {
            case .incorrectCredentials:
                return "Your email or password is incorrect"¡
            }
        }
    }

    @IBOutlet weak var contentScrollView: UIScrollView!
    @IBOutlet weak var emailTextField: FancyTextField!
    @IBOutlet weak var passwordTextField: FancyTextField!
    @IBOutlet weak var signInButton: FancyButton!
    @IBOutlet weak var visitWebButton: UIButton!
    @IBOutlet weak var signUpButton: UIButton!
    @IBOutlet weak var privacyButton: UIButton!
    @IBOutlet weak var termsButton: UIButton!
    @IBOutlet weak var errorLabel: UILabel!

    fileprivate let errorState = PublishSubject<ErrorState>()
}

// MARK: - Lifecycle
extension SignInViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupLocalization()
        setupSubscriptions()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        emailTextField.text = nil
        passwordTextField.text = nil
    }
}

// MARK: - UI
extension SignInViewController {
    fileprivate func setupUI() {
        visitWebButton.conArtistStyle()
        signUpButton.conArtistStyle()
        privacyButton.conArtistStyle()
        termsButton.conArtistStyle()

        visitWebButton.setTitleColor(.text, for: .normal)
        visitWebButton.setTitleColor(.text, for: .highlighted)
        visitWebButton.tintColor = .text

        signUpButton.setTitleColor(.text, for: .normal)
        signUpButton.setTitleColor(.text, for: .highlighted)
        signUpButton.tintColor = .text

        privacyButton.setTitleColor(.textPlaceholder, for: .normal)
        privacyButton.setTitleColor(.textPlaceholder, for: .highlighted)
        privacyButton.alpha = 0.7

        termsButton.setTitleColor(.textPlaceholder, for: .normal)
        termsButton.setTitleColor(.textPlaceholder, for: .highlighted)
        termsButton.alpha = 0.7
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

        visitWebButton.setAttributedTitle(try! "Visit conartist.app"¡.prettify(), for: .normal)
        visitWebButton.setAttributedTitle(try! "Visit conartist.app"¡.prettify(.highlighted), for: .highlighted)

        signUpButton.setTitle("Sign up"¡, for: .normal)
        privacyButton.setTitle("Privacy Policy"¡, for: .normal)
        termsButton.setTitle("Terms of Service"¡, for: .normal)
    }
}

// MARK: - Subscriptions
extension SignInViewController {
    fileprivate func setupSubscriptions() {
        let credentials = Observable.combineLatest(emailTextField.rx.text, passwordTextField.rx.text)
        Observable
            .merge(
                signInButton.rx.tap.map(const(())),
                passwordTextField.rx.controlEvent([.editingDidEndOnExit]).map(const(()))
            )
            .filter { [signInButton] in signInButton?.isEnabled ?? false }
            .do(onNext: { [signInButton] in signInButton?.isEnabled = false })
            .withLatestFrom(credentials)
            .flatMap { [errorState] credentials in
                ConArtist.API.Auth.signIn(email: credentials.0?.trim() ?? "", password: credentials.1 ?? "")
                    .map(const(true))
                    .catchError { _ in
                        errorState.on(.next(.incorrectCredentials))
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

        Observable
            .merge(
                visitWebButton.rx.tap.map(const(URL.conartist)),
                privacyButton.rx.tap.map(const(URL.privacyPolicy)),
                termsButton.rx.tap.map(const(URL.termsOfService))
            )
            .subscribe(onNext: { url in UIApplication.shared.open(url, options: [:]) })
            .disposed(by: disposeBag)

        signUpButton.rx.tap
            .subscribe(onNext: { _ in SignUpViewController.present() })
            .disposed(by: disposeBag)

        errorState
            .map { $0.message() }
            .asDriver(onErrorJustReturn: "An unknown error has occurred"¡)
            .drive(errorLabel.rx.text)
            .disposed(by: disposeBag)

        rx.keyboardFrame
            .drive(onNext: { [contentScrollView] keyboard in
                if let frame = keyboard.frame {
                    contentScrollView?.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: frame.height + 40, right: 0)
                    contentScrollView?.scrollIndicatorInsets = UIEdgeInsets(top: 0, left: 0, bottom: frame.height, right: 0)
                } else {
                    contentScrollView?.contentInset = UIEdgeInsets.zero
                    contentScrollView?.scrollIndicatorInsets = UIEdgeInsets.zero
                }
            })
            .disposed(by: disposeBag)
    }
}

// MARK: - Navigation
extension SignInViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .signIn
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
