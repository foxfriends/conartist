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

    init(category: String, description: String, price: Money) {
        self.init(ConArtist.NoID, category: category, description: description, price: price, time: Date())
    }

    init(id: Int, category: String, description: String, price: Money, time: Date) {
        self.id = id
        self.price = price
        self.category = category
        self.description = description
        self.time = time
    }

    init?(graphQL maybeExpense: ExpenseFragment?) {
        guard
            let expense = maybeExpense,
            let price = expense.price.toMoney(),
            let time = expense.time.toDate()
            else { return nil }
        id = expense.id
        self.price = price
        self.time = time
        category = expense.category
        description = expense.description
    }
    
    func add(to con: Convention) -> ExpenseAdd {
        return ExpenseAdd(conId: con.id, price: price.toJSON(), category: category, description: description, time: time.toJSON())
    }

    var modifications: ExpenseMod {
        return ExpenseMod(expenseId: id, price: price.toJSON(), category: category, description: description)
    }
}
