//
//  RootNavigationController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit

class RootNavigationController: UINavigationController {
    override func viewDidLoad() {
        super.viewDidLoad()
        self.ensureSignedIn()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func ensureSignedIn() {
        if ConArtist.API.AuthToken == ConArtist.API.Unauthorized {
            self.performSegue(withIdentifier: SegueIdentifier.ShowSignIn.rawValue, sender: self)
        } else {
            Auth.reauthorize().then(execute: self.setUserAndContinue)
        }
    }
    
    func setUserAndContinue(_ user: UserQuery.Data.User?) {
        ConArtist.Model = Model.from(graphQL: user)
        if ConArtist.Model != nil {
            self.performSegue(withIdentifier: SegueIdentifier.ShowConventionList.rawValue, sender: self)
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        switch segue.identifier ?? "" {
        case SegueIdentifier.ShowSignIn.rawValue:
            (segue.destination as? ConArtistViewController)?
                .setCompletionCallback { self.setUserAndContinue($0 as? UserQuery.Data.User) }
        default: break
        }
    }
    
    private enum SegueIdentifier: String {
        case ShowSignIn, ShowConventionList
    }
}
