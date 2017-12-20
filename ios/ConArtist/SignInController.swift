//
//  SignInController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-10-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit

class SignInController: UIViewController {
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var signInButton: UIButton!
    @IBOutlet weak var passwordTextField: UITextField!

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func pressSignIn(_ sender: Any) {
        let username = emailTextField.text ?? ""
        let password = passwordTextField.text ?? ""
        // Attempt a log in
        API.signIn(username: username, password: password)
            .then { user -> Void in
                debugPrint(user)
            }
            .catch { error in
                print(error)
            }
    }
}

