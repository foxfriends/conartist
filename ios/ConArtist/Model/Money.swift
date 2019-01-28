//
//  Money.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-23.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

enum CurrencyCode: String, Codable, Equatable {
    case AUTO, CAD, USD, MXN, EUR, GBP

    var symbol: String {
        switch self {
        case .AUTO: return ""
        case .CAD, .USD, .MXN: return "$"
        case .EUR: return "€"
        case .GBP: return "£"
        }
    }

    static var variants: [CurrencyCode] {
        return  [ .CAD
                , .USD
                , .MXN
                , .EUR
                , .GBP
                ]
    }
}

struct Money: Codable {
    let currency: CurrencyCode
    let amount: Int

    static let zero: Money = Money(currency: .AUTO, amount: 0)
    static func parse(as currency: CurrencyCode, _ string: String) -> Money? {
        switch currency {
        case .AUTO: return nil // cannot parse a currency as auto
        case .CAD, .USD, .MXN, .EUR, .GBP:
            return parseDollarsAndCents(string, currency: currency)
        }
    }

    /// Parses the string allowing the symbol to appear at either end, and assuming there are 100 cents in a dollar
    private static func parseDollarsAndCents(_ string: String, currency: CurrencyCode) -> Money? {
        var string = string.trimmingCharacters(in: .whitespacesAndNewlines)
        if string.hasPrefix(currency.symbol) {
            string = String(string.dropFirst(currency.symbol.count).trimmingCharacters(in: .whitespacesAndNewlines))
        } else if string.hasSuffix(currency.symbol) {
            string = String(string.dropLast(currency.symbol.count).trimmingCharacters(in: .whitespacesAndNewlines))
        }
        let pieces = string.split(separator: ".",  maxSplits: 1)
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

// MARK: - Formatters
extension Money {
    /// Formats this value to a human readable localized format
    func toString() -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencySymbol = currency.symbol
        formatter.currencyCode = currency.rawValue
        return formatter.string(from: numericValue as NSNumber)!
    }

    /// Serializes this value to a valid Money string, according to the ConArtist API format
    func toJSON() -> String {
        return "\(currency)\(amount)"
    }

    /// Approximates this value as a float
    var numericValue: Float {
        switch currency {
        case .CAD, .USD, .MXN, .EUR, .GBP:
            return Float(amount) / 100.0
        default:
            return Float(amount)
        }
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
