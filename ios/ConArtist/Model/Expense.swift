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
    let price: Money
    let time: Date
    let category: String
    let description: String

    init?(graphQL maybeExpense: FullConventionQuery.Data.UserConvention.Expense?) {
        guard let expense = maybeExpense else { return nil }
        id = expense.id
        price = expense.price.toMoney()! // TODO: is ! bad?
        time = expense.time.toDate()! // TODO: is ! bad?
        category = expense.category
        description = expense.description
    }
    
    func add(to con: Convention) -> ExpenseAdd {
        return ExpenseAdd(conId: con.id, price: price.toJSON(), category: category, description: description, time: time.toJSON())
    }
}
