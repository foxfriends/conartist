//
//  String+JSON.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-12.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

private let RFC3339: DateFormatter = {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
    formatter.calendar = Calendar(identifier: .iso8601)
    formatter.timeZone = TimeZone(secondsFromGMT: 0)
    formatter.locale = Locale(identifier: "en_US_POSIX")
    return formatter
}()

extension String {
    /// Parses a JSON as any type
    func parseJSON<T>() -> T? where T: Decodable {
        if T.self == String.self && hasPrefix("\"") {
            return dropFirst().dropLast().unescape() as? T
        } else if T.self == Bool.self {
            switch self {
            case "true": return true as? T
            case "false": return false as? T
            default: return nil
            }
        }else {
            return data(using: .utf8).flatMap { data in
                let decoder = JSONDecoder()
                decoder.dateDecodingStrategy = .formatted(RFC3339)
                return try? decoder.decode(T.self, from: data)
            }
        }
    }
}
