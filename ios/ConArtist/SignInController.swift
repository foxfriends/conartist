//
//  SignInController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-10-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit

class SignInController: UIViewController {
    @IBOutlet weak var signInButton: UIButton!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!

    @IBAction func pressSignIn(_ sender: Any) {
        let username = emailTextField.text ?? ""
        let password = passwordTextField.text ?? ""
        // Attempt a log in
        Auth.signIn(username: username, password: password)
            .then { self.dismiss(animated: true) }
            .catch { print($0) }
    }
}

