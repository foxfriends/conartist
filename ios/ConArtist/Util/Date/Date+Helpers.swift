//
//  Date+String.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation

extension Date {
    func roundToDay() -> Date {
        let components = Calendar.current.dateComponents([.day, .month, .year], from: self)
        return Calendar.current.date(from: components)!
    }

    static func today() -> Date {
        return Date().roundToDay()
    }
    
    // Formats the date as an RFC-3339 date string
    func toJSON() -> String {
        return self.formatted(.iso8601)
    }

    func changeTimeZone(from: TimeZone, to: TimeZone) -> Date {
        let targetOffset = TimeInterval(to.secondsFromGMT(for: self))
        let localOffeset = TimeInterval(from.secondsFromGMT(for: self))
        return self.addingTimeInterval(targetOffset - localOffeset)
    }
}
