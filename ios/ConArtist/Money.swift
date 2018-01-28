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
            return "$\(Float(amount) / 100.0)"
        }
    }
    
    func toJSON() -> String {
        return "\(currency)\(amount)"
    }
}
