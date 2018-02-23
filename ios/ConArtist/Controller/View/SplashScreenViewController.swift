//
//  SplashScreenViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-22.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class SplashScreenViewController: UIViewController {}

// MARK: - Lifecycle
extension SplashScreenViewController {
    override func viewDidLoad() {
        SignInViewController.show(animated: false)
        if ConArtist.API.authToken != ConArtist.API.Unauthorized {
            ConventionListViewController.show(animated: false)
            let _ = Auth.reauthorize()
                .subscribe(
                    onError: {
                        print("Sign in failed: \($0)")
                        ConArtist.model.navigate(backTo: SignInViewController.self)
                        ConArtist.API.authToken = ConArtist.API.Unauthorized
                    }
                )
        }
    }
}

// MARK: - Navigation
extension SplashScreenViewController {
    class func show() {
        let controller = SplashScreenViewController.instantiate(withId: "SplashScreen")
        ConArtist.model.navigate(replace: controller)
    }
}
