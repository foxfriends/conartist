//
//  SignUpViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2019-01-12.
//  Copyright © 2019 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import RxCocoa

private enum State {
    case name
    case email
    case password
    case completed
}

class SignUpViewController: ConArtistViewController {
    @IBOutlet weak var pageOffset: NSLayoutConstraint!
    @IBOutlet weak var bottomConstraint: NSLayoutConstraint!

    @IBOutlet weak var progressView: UIProgressView!
    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!

    @IBOutlet weak var nameField: FancyTextField!
    @IBOutlet weak var emailField: FancyTextField!
    @IBOutlet weak var passwordField: FancyTextField!
    @IBOutlet weak var confirmPasswordField: FancyTextField!

    @IBOutlet weak var backButton: UIButton!
    @IBOutlet weak var nextButton: UIButton!
    @IBOutlet weak var cancelButton: UIButton!

    @IBOutlet weak var emailErrorLabel: UILabel!
    @IBOutlet weak var passwordErrorLabel: UILabel!

    @IBOutlet var localizableLabels: [UILabel]!
    @IBOutlet var smallCapsLabels: [UILabel]!

    fileprivate let state = BehaviorRelay<State>(value: .name)
    fileprivate let animatingActivity = BehaviorRelay<Bool>(value: false)
}

// MARK: - Lifecycle

extension SignUpViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLocalization()
        setupUI()
        setupSubscriptions()
    }
}

// MARK: - UI

extension SignUpViewController {
    fileprivate func setupUI() {
        cancelButton.conArtistStyle()
        backButton.conArtistStyle()
        nextButton.conArtistStyle()

        nameField.delegate = self
        emailField.delegate = self
        passwordField.delegate = self
        confirmPasswordField.delegate = self
    }

    fileprivate func setupLocalization() {
        localizableLabels.forEach { $0.text = $0.text?¡ }
        smallCapsLabels.forEach { $0.font = $0.font?.usingFeatures([.smallCaps]) }
        nameField.placeholder = "Your name"¡
        nameField.title = nameField.placeholder
        emailField.placeholder = "Email"¡
        emailField.title = emailField.placeholder
        passwordField.placeholder = "Password"¡
        passwordField.title = passwordField.placeholder
        confirmPasswordField.placeholder = "And again"¡
        confirmPasswordField.title = confirmPasswordField.placeholder
        cancelButton.setTitle("Cancel"¡, for: .normal)
    }
}

// MARK: - Subscriptions

extension SignUpViewController {
    fileprivate func setupSubscriptions() {
        backButton.rx.tap
            .withLatestFrom(state)
            .map { state in
                switch state {
                case .name: return .name
                case .email: return .name
                case .password: return .email
                case .completed: return .completed
                }
            }
            .bind(to: state)
            .disposed(by: disposeBag)

        cancelButton.rx.tap
            .subscribe(onNext: { ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        passwordField.rx.controlEvent([.editingDidEndOnExit])
            .subscribe(onNext: { [unowned self] _ in self.confirmPasswordField.becomeFirstResponder() })
            .disposed(by: disposeBag)

        Observable
            .merge(
                nextButton.rx.tap.map { _ in () },
                nameField.rx.controlEvent([.editingDidEndOnExit]).map { _ in () },
                emailField.rx.controlEvent([.editingDidEndOnExit]).map { _ in () },
                confirmPasswordField.rx.controlEvent([.editingDidEndOnExit]).map { _ in () }
            )
            .withLatestFrom(state)
            .flatMap { [unowned self] state -> Maybe<State> in
                switch state {
                case .name: return .just(.email)
                case .email: return .just(.password)
                case .password:
                    self.animatingActivity.accept(true)
                    return ConArtist.API.Account
                        .create(
                            name: self.nameField.text!,
                            email: self.emailField.text!.trim(),
                            password: self.passwordField.text!
                        )
                        .do { self.animatingActivity.accept(false) }
                        .map { _ in .completed }
                        .asMaybe()
                case .completed:
                    ConventionListViewController.show()
                    return .empty()
                }
            }
            .bind(to: state)
            .disposed(by: disposeBag)

        let nameError = nameField.rx.text
            .map { $0 ?? "" }
            .map { $0.isEmpty }

        let emailError = emailField.rx.text
            .map { $0?.trim() ?? "" }
            .flatMapLatest { [unowned self] email -> Observable<String?> in
                if email.isEmpty {
                    return .just("")
                }
                if !email.isEmail {
                    return .just("Your email looks wrong"¡)
                }
                self.animatingActivity.accept(true)
                return ConArtist.API.Account.emailInUse(email)
                    .do { self.animatingActivity.accept(false) }
                    .map { $0 ? "That email is already being used"¡ : nil }
                    .catchErrorJustReturn("")
            }

        let passwordError = Observable
            .combineLatest(
                self.passwordField.rx.text
                    .map { $0 ?? "" },
                self.confirmPasswordField.rx.text
                    .map { $0 ?? "" }
            )
            .map { (arg: (String, String)) -> String? in
                let (password, confirm) = arg
                if password.isEmpty { return "" }
                if password.count < 8 { return "Your password is too short"¡ }
                if password != confirm { return "Your passwords don't match"¡ }
                return nil
            }

        emailError.asDriver(onErrorJustReturn: nil)
            .drive(emailErrorLabel.rx.text)
            .disposed(by: disposeBag)

        passwordError.asDriver(onErrorJustReturn: nil)
            .drive(passwordErrorLabel.rx.text)
            .disposed(by: disposeBag)

        animatingActivity
            .bind(to: activityIndicator.rx.isAnimating)
            .disposed(by: disposeBag)

        Observable
            .combineLatest(
                state
                    .flatMapLatest { state -> Observable<Bool> in
                        switch state {
                        case .name:
                            return nameError
                        case .email:
                            return emailError.map { $0 != nil }
                        case .password:
                            return passwordError.map { $0 != nil }
                        case .completed:
                            return .just(false)
                        }
                    },
                animatingActivity
            )
            .map { !($0 || $1) }
            .asDriver(onErrorJustReturn: false)
            .drive(nextButton.rx.isEnabled)
            .disposed(by: disposeBag)

        state.asDriver()
            .drive(onNext: { [unowned self] state in
                switch state {
                case .name:
                    self.pageOffset.constant = 0
                    self.backButton.isHidden = true
                case .email:
                    self.pageOffset.constant = -self.view.frame.width
                    self.backButton.isHidden = false
                case .password:
                    self.pageOffset.constant = -self.view.frame.width * 2
                    self.backButton.isHidden = false
                case .completed:
                    self.pageOffset.constant = -self.view.frame.width * 3
                    self.backButton.isHidden = true
                    self.cancelButton.isHidden = true
                }

                UIView.animate(
                    withDuration: 0.2,
                    animations: {
                        switch state {
                        case .name:
                            self.progressView.progress = 0.1
                        case .email:
                            self.progressView.progress = 0.33
                        case .password:
                            self.progressView.progress = 0.66
                        case .completed:
                            self.progressView.progress = 1.0
                            self.progressView.alpha = 0
                        }
                        self.view.layoutIfNeeded()
                    },
                    completion: { _ in
                        switch state {
                        case .name:
                            self.emailField.text = ""
                            self.nameField.becomeFirstResponder()
                        case .email:
                            self.passwordField.text = ""
                            self.confirmPasswordField.text = ""
                            self.emailField.becomeFirstResponder()
                        case .password:
                            self.passwordField.becomeFirstResponder()
                        default: break
                        }
                    }
                )
            })
            .disposed(by: disposeBag)

        rx.keyboardFrame
            .drive(onNext: { [bottomConstraint] keyboard in
                if let frame = keyboard.frame {
                    bottomConstraint?.constant = frame.height
                } else {
                    bottomConstraint?.constant = 0
                }
            })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITextFieldDelegate

extension SignUpViewController: UITextFieldDelegate {
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField == passwordField { return true }
        return nextButton.isEnabled
    }
}

// MARK: - Navigation

extension SignUpViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .signIn
    static let ID: String = "SignUp"

    static func present() {
        ConArtist.model.navigate(present: instantiate())
    }
}
