//
//  URL.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-06-22.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation
import UIKit

extension ConArtist {
    static let URLPrefix = "conartist://"
    enum URLKey: String, Codable {
        case map
    }

    /// Handles universal URLs and deep links
    static func handleURL(_ url: String) {
        if let url = URL(string: url) {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
    }

    /// Parses a URL and produces something you want!
    static func parseURL<T>(_ url: String) -> T? {
        if url.starts(with: URLPrefix) {
            let content = url.dropFirst(URLPrefix.count).split(separator: "?").map(String.init)
            guard let urlKey = content.first.flatMap(URLKey.init) else {
                return nil
            }
            switch urlKey {
            case .map:
                guard let coords: [Double] = content.nth(1).map(urlParams)?["coords"]?.parseJSON() else {
                    return nil
                }
                guard let latitude = coords.nth(0), let longitude = coords.nth(1) else {
                    return nil
                }
                let location = Location(latitude: latitude, longitude: longitude)
                return location as? T
            }
        }
        return nil
    }

    private static func urlParams(query: String) -> [String: String] {
        return query.split(separator: "&")
            .reduce([:]) { result, arg in
                var result = result
                let pair = arg.split(separator: "=").map(String.init)
                result[pair[0]] = pair[1]
                return result
            }
    }
}
