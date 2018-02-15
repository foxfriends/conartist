//
//  Date+String.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation
import SwiftMoment

extension Date {
    static func today() -> Date {
        let components = Calendar.current.dateComponents([.day, .month, .year], from: Date())
        return Calendar.current.date(from: components)!
    }
    
    // Formats the date according to the provided format string
    func toString(_ format: String) -> String {
        return moment(self).format(format)
    }
    
    // Formats the date as an RFC-3339 date string
    func toJSON() -> String {
        return moment(self).format("yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ")
    }
}
