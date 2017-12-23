//
//  Expense.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation

struct Expense {
    let id: Int
    let price: String // TODO: why is this a string
    let time: Date
    let category: String
    let description: String
    
    static func from(graphQL maybeExpense: FullConventionQuery.Data.UserConvention.Expense?) -> Expense? {
        guard let expense = maybeExpense else { return nil }
        return Expense(
            id: expense.id,
            price: expense.price,
            time: expense.time.toDate()!, // TODO: is ! bad?
            category: expense.category,
            description: expense.description
        )
    }
}
