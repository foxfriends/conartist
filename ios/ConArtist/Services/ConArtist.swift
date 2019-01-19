//
//  ConArtist.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit
import SVGKit

struct ConArtist {
    static let model = Persist.load()

    struct Error: Swift.Error {
        let msg: String
    }

    static let NoID = 0

    static func signOut() {
        ConArtist.model.navigate(backTo: SignInViewController.self)
        ConArtist.API.Auth.authToken = ConArtist.API.Auth.Unauthorized
    }
}
