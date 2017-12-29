//
//  DateExtensions.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation
import SwiftDate

extension String {
    func toDate() -> Date? {
        print(self)
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
        return formatter.date(from: self)
    }
}

extension Date {
    static func today() -> Date {
        let components = Calendar.current.dateComponents([.day, .month, .year], from: Date())
        return Calendar.current.date(from: components)!
    }
}
