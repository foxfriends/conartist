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
    
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var signInButton: UIButton!
    
    fileprivate let øerrorState = PublishSubject<ErrorState>()
    
    let disposeBag = DisposeBag()
}

// MARK: - Lifecycle
extension SignInViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
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
        
        let øcredentials = Observable.combineLatest(emailTextField.rx.text, passwordTextField.rx.text)
        signInButton.rx.tap
            .execute { [unowned self] in self.signInButton.isEnabled = false }
            .withLatestFrom(øcredentials)
            .flatMap { credentials in
                Auth.signIn(email: credentials.0 ?? "", password: credentials.1 ?? "")
                    .map { true }
                    .catchError { [weak self] _ in
                        self?.øerrorState.on(.next(.IncorrectCredentials))
                        return Observable.just(false)
                    }
            }
            .execute({ [weak self] _ in self?.signInButton.isEnabled = true })
            .filter { $0 }
            .subscribe({ _ in ConArtist.model.navigateTo(page: .Conventions) })
            .disposed(by: disposeBag)
        
        øerrorState
            .map { $0.message() }
            .asDriver(onErrorJustReturn: "An unknown error has occurred")
            .drive( onNext: signInButton.showTooltip)
            .disposed(by: disposeBag)
    }
}

// MARK: - Navigation
extension SignInViewController {
    class func create() -> SignInViewController {
        return SignInViewController.instantiate(withId: SignInViewController.ID)
    }
}
