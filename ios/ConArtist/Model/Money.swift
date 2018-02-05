//
//  Money.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-23.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

enum CurrencyCode: String {
    case CAD, USD
}

struct Money {
    let currency: CurrencyCode
    let amount: Int
    
    static func parse(as currency: CurrencyCode, _ string: String) -> Money? {
        switch currency {
        case .CAD, .USD:
            let pieces = (string.starts(with: "$") ? string.dropFirst() : string.dropFirst(0)).split(separator: ".")
            guard
                let dollarString = pieces.nth(0),
                let centString = pieces.nth(1),
                let dollars = Int(dollarString),
                let cents = Int(centString)
            else { return nil }
            return Money(currency: .CAD, amount: dollars * 100 + cents)
        }
    }
    
    // Formats this value to a human readable localized format
    func toString() -> String {
        switch currency {
        case .CAD, .USD:
            return String(format: "$%.2f", Float(amount) / 100.0)
        }
    }
    
    // Serializes this value to a valid Money string, according to the ConArtist API format
    func toJSON() -> String {
        return "\(currency)\(amount)"
    }
    
    // Adds together two money values, returning the first value unmodified if the currencies do not match up
    static func +(a: Money, b: Money) -> Money {
        if a.currency != b.currency { return a }
        return Money(
            currency: a.currency,
            amount: a.amount + b.amount
        )
    }
    
    static func +=(a: inout Money, b: Money) {
        a = a + b
    }
}

