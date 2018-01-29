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
        
        let øcredentials = Observable.combineLatest([emailTextField.rx.text, passwordTextField.rx.text])
        signInButton.rx.tap
            .withLatestFrom(øcredentials)
            .flatMap { credentials in Auth.signIn(email: credentials[0] ?? "", password: credentials[1] ?? "") }
            .catchError { [weak self] _ in
                self?.øerrorState.on(.next(.IncorrectCredentials))
                return Observable.empty()
            }
            .subscribe {
                guard case .next(_) = $0 else { return }
                ConArtist.model.page.value = .Conventions
            }
            .disposed(by: disposeBag)
        
        øerrorState
            .map { $0.message() }
            .subscribe( onNext: signInButton.showTooltip)
            .disposed(by: disposeBag)
    }
}

// MARK: - Navigation
extension SignInViewController {
    private class func create() -> SignInViewController {
        return SignInViewController.instantiate(withId: SignInViewController.ID) as! SignInViewController
    }
    
    class func push(to navigator: UINavigationController) {
        let controller = SignInViewController.create()
        navigator.pushViewController(controller, animated: true)
    }
    
    class func present(from navigator: UIViewController) {
        let controller = SignInViewController.create()
        navigator.present(controller, animated: true)
    }
}
