//
//  String+Money.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-23.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation
import SwiftMoment

// MARK: - Date

extension String {
    func toDate() -> Date? {
        print(self)
        return moment(self)?.date
    }
}

// MARK: - Money

extension String {
    func toMoney() -> Money? {
        guard
            let currency = CurrencyCode(rawValue: String(self.prefix(3))),
            let amount = Int(self.dropFirst(3))
        else {
            return nil
        }
        return Money(currency: currency, amount: amount)
    }
}
