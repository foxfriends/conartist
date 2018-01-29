//
//  StringExtensions.swift
//  
//
//  Created by Cameron Eldridge on 2018-01-23.
//

import Foundation
import SwiftMoment

// MARK: - Date

extension String {
    func toDate() -> Date? {
        return moment(self)?.date
    }
}

// MARK: - Money

extension String {
    func toMoney() -> Money? {
        guard
            let currency = CurrencyCode(rawValue: String(self.dropFirst(3))),
            let amount = Int(self)
        else {
            return nil
        }
        return Money(currency: currency, amount: amount)
    }
}
