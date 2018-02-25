//
//  Record.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation

struct Record {
    let id: Int?
    let products: [Int]
    let price: Money
    let time: Date

    init(id: Int?, products: [Int], price: Money, time: Date) {
        self.id = id
        self.products = products
        self.price = price
        self.time = time
    }

    init?(graphQL maybeRecord: FullConventionQuery.Data.UserConvention.Record?) {
        guard let record = maybeRecord else { return nil }
        id = record.id
        products = record.products
        price = record.price.toMoney()! // TODO: is ! bad?
        time = record.time.toDate()! // TODO: is ! bad?
    }
    
    func add(to con: Convention) -> RecordAdd {
        return RecordAdd(conId: con.id, products: products, price: price.toJSON(), time: time.toJSON())
    }
}
