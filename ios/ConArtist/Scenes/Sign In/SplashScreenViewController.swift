//
//  SplashScreenViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-22.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Alamofire
import UIKit

class SplashScreenViewController : ConArtistViewController {}

// MARK: - Lifecycle
extension SplashScreenViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        SignInViewController.show(animated: false)
        if ConArtist.API.Auth.authToken != ConArtist.API.Auth.Unauthorized {
            ConventionListViewController.show(animated: false)
            let _ = ConArtist.API.Auth.reauthorize()
                .subscribe(
                    onError: { error in
                        debug("Sign in failed")
                        debug(error)
                        switch error {
                        case is ConArtist.Error,
                             AFError.responseValidationFailed(.unacceptableStatusCode) as AFError:
                            ConArtist.signOut()
                        default:
                            // probably ok... just no internet connection or something
                            break
                        }
                    }
                )
        }
    }
}

// MARK: - Navigation
extension SplashScreenViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .signIn
    static let ID = "SplashScreen"

    static func show() {
        let controller = instantiate()
        ConArtist.model.navigate(replace: controller)
    }
}
