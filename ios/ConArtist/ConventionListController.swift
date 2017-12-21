//
//  ConventionListController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Strongbox

class ConventionListController: ConArtistViewController {
    var user: UserQuery.Data.User?

    override func viewDidLoad() {
        super.viewDidLoad()
        ensureSignedIn()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func ensureSignedIn() {
        if ConArtist.API.AuthToken == ConArtist.API.Unauthorized {
            performSegueForReturnValue(withIdentifier: "ShowSignIn", sender: self) { self.user = $0 as? UserQuery.Data.User }
        } else {
            API.reauthorize().then { self.user = $0 }
        }
    }
}

