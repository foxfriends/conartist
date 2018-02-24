//
//  Keychain.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-24.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Strongbox

extension ConArtist {
    struct Keychain {
        enum Key: String {
            case AuthToken = "AuthToken"
        }

        static func retrieve<T>(valueFor key: Key) -> T? {
            return Strongbox().unarchive(objectForKey: key.rawValue) as? T
        }

        static func store<T>(value: T, for key: Key) -> Bool {
            return Strongbox().archive(value, key: key.rawValue)
        }
    }
}
