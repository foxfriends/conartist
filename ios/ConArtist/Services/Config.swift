//
//  Config.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-04-13.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

protocol ConfigKey {
    associatedtype V
    static var key: String { get }
}

/// A slightly awkward but at least type-safe configuration service
struct Config {
    private static let config: NSDictionary = NSDictionary(contentsOfFile: Bundle.main.path(forResource: "Config", ofType: "plist")!)!

    static func retrieve<K: ConfigKey>(_ key: K.Type) -> K.V {
        return config.object(forKey: key.key) as! K.V
    }

    struct GraphQLURL: ConfigKey {
        typealias V = String
        static let key = "GraphQLURL"
    }

    struct APIURL: ConfigKey {
        typealias V = String
        static let key = "APIURL"
    }

    struct ResourcesURL: ConfigKey {
        typealias V = String
        static let key = "ResourcesURL"
    }

    struct WebURL: ConfigKey {
        typealias V = String
        static let key = "WebURL"
    }
}
