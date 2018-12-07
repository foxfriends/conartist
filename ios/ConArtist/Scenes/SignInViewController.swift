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
    @IBOutlet weak var signUpButton: UIButton!
    @IBOutlet weak var privacyButton: UIButton!
    @IBOutlet weak var termsButton: UIButton!


    fileprivate let errorState = PublishSubject<ErrorState>()
    
    let disposeBag = DisposeBag()
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
        startAdjustingForKeyboard()
        emailTextField.text = nil
        passwordTextField.text = nil
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
    }
}

// MARK: - UI
extension SignInViewController {
    fileprivate func setupUI() {
        signUpButton.conArtistStyle()
        privacyButton.conArtistStyle()
        termsButton.conArtistStyle()

        signUpButton.setTitleColor(.lightText, for: .normal)
        signUpButton.setTitleColor(.lightText, for: .highlighted)
        signUpButton.tintColor = .lightText
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

        signUpButton.setAttributedTitle(try! "Sign up at conartist.app"¡.prettify(), for: .normal)
        signUpButton.setAttributedTitle(try! "Sign up at conartist.app"¡.prettify(.highlighted), for: .highlighted)
        privacyButton.setTitle("Privacy Policy"¡, for: .normal)
        termsButton.setTitle("Terms of Service"¡, for: .normal)
    }
}

// MARK: - Subscriptions
extension SignInViewController {
    fileprivate func setupSubscriptions() {
        let øcredentials = Observable.combineLatest(emailTextField.rx.text, passwordTextField.rx.text)
        Observable
            .merge(
                signInButton.rx.tap.map(const(())),
                passwordTextField.rx.controlEvent([.editingDidEndOnExit]).map(const(()))
            )
            .filter { [signInButton] in signInButton?.isEnabled ?? false }
            .do(onNext: { [signInButton] in signInButton?.isEnabled = false })
            .withLatestFrom(øcredentials)
            .flatMap { [errorState] credentials in
                ConArtist.API.Auth.signIn(email: credentials.0 ?? "", password: credentials.1 ?? "")
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
                signUpButton.rx.tap.map(const(URL.conartist)),
                privacyButton.rx.tap.map(const(URL.privacyPolicy)),
                termsButton.rx.tap.map(const(URL.termsOfService))
            )
            .subscribe(onNext: { url in UIApplication.shared.open(url, options: [:]) })
            .disposed(by: disposeBag)

        errorState
            .map { $0.message() }
            .asDriver(onErrorJustReturn: "An unknown error has occurred"¡)
            .drive(onNext: { [emailTextField] in emailTextField?.showTooltip(text: $0) })
            .disposed(by: disposeBag)
    }
}

// MARK: - Keyboard handling
extension SignInViewController {
    fileprivate func startAdjustingForKeyboard() {
        NotificationCenter.default.rx.notification(UIResponder.keyboardWillHideNotification)
            .subscribe(onNext: { [weak self] notification in self?.adjustForKeyboard(notification: notification) })
            .disposed(by: disposeBag)
        NotificationCenter.default.rx.notification(UIResponder.keyboardWillChangeFrameNotification)
            .subscribe(onNext: { [weak self] notification in self?.adjustForKeyboard(notification: notification) })
            .disposed(by: disposeBag)
    }

    private func adjustForKeyboard(notification: Notification) {
        let keyboardScreenEndFrame = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as! NSValue).cgRectValue
        let keyboardViewEndFrame = view.convert(keyboardScreenEndFrame, from: view.window)

        if notification.name == UIResponder.keyboardWillHideNotification {
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
