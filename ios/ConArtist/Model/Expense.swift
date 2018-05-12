//
//  Expense.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation

struct Expense: Codable {
    let id: Id
    let price: Money
    let time: Date
    let category: String
    let description: String

    init(category: String, description: String, price: Money) {
        self.init(id: ConArtist.NoID, category: category, description: description, price: price, time: Date())
    }

    init(id: Int, category: String, description: String, price: Money, time: Date) {
        self.id = id == ConArtist.NoID ? Id.temporary() : .id(id)
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
        id = .id(expense.id)
        self.price = price
        self.time = time
        category = expense.category
        description = expense.description
    }
    
    func add(to con: Convention) -> ExpenseAdd? {
        if let uuid = id.uuid {
            return ExpenseAdd(conId: con.id, uuid: uuid.uuidString, price: price.toJSON(), category: category, description: description, time: time.toJSON())
        } else {
            return nil
        }
    }

    var modifications: ExpenseMod? {
        if let id = id.id {
            return ExpenseMod(expenseId: id, price: price.toJSON(), category: category, description: description)
        } else {
            return nil
        }
    }
}
