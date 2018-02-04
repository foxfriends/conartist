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
    
    func toString() -> String {
        switch currency {
        case .CAD, .USD:
            return String(format: "$%.2f", Float(amount) / 100.0)
        }
    }
    
    func toJSON() -> String {
        return "\(currency)\(amount)"
    }
    
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

