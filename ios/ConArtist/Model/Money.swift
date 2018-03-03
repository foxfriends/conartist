//
//  Money.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-23.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

enum CurrencyCode: String {
    case AUTO, CAD, USD

    static var variants: [CurrencyCode] {
        return  [ .CAD
                , .USD
                ]
    }
}

struct Money {
    let currency: CurrencyCode
    let amount: Int

    static let zero: Money = Money(currency: .AUTO, amount: 0)
    static func parse(as currency: CurrencyCode, _ string: String) -> Money? {
        switch currency {
        case .AUTO: return nil // cannot parse a currency as auto
        case .CAD, .USD:
            let pieces = (string.starts(with: "$") ? string.dropFirst() : string.dropFirst(0)).split(separator: ".",  maxSplits: 1)
            let centString = (pieces.nth(1) ?? "")
            guard
                centString.count <= 2,
                let dollarString = pieces.nth(0),
                let dollars = Int(dollarString),
                let cents = Int(centString.padding(toLength: 2, withPad: "0", startingAt: 0))
            else { return nil }
            return Money(currency: currency, amount: dollars * 100 + cents)
        }
    }
}

// MARK: - Formatters
extension Money {
    // Formats this value to a human readable localized format
    func toString() -> String {
        switch currency {
        case .AUTO: return "\(amount)"
        case .CAD, .USD:
            return String(format: "$%.2f", Float(amount) / 100.0)
        }
    }
    
    // Serializes this value to a valid Money string, according to the ConArtist API format
    func toJSON() -> String {
        return "\(currency)\(amount)"
    }
}

// MARK: - Operators
extension Money {
    static func +(a: Money, b: Money) -> Money {
        if a.currency != b.currency && (a.currency != .AUTO && b.currency != .AUTO) { return a }
        return Money(
            currency: a.currency == .AUTO ? b.currency : a.currency,
            amount: a.amount + b.amount
        )
    }

    static prefix func -(a: Money) -> Money {
        return Money(currency: a.currency, amount: -a.amount)
    }

    static func -(a: Money, b: Money) -> Money {
        return a + (-b)
    }
}

// MARK: - Equatable
extension Money: Equatable {
    static func ==(a: Money, b: Money) -> Bool {
        if a.currency != b.currency && (a.currency != .AUTO && b.currency != .AUTO) { return false }
        return a.amount == b.amount
    }
}
