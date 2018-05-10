//
//  Record.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation

struct Record: Codable {
    let id: Id
    let products: [Int]
    let price: Money
    let time: Date
    let info: String

    init(id: Int = ConArtist.NoID, products: [Int], price: Money, time: Date = Date(), info: String) {
        self.id = id == ConArtist.NoID ? Id.temporary() : .id(id)
        self.products = products
        self.price = price
        self.time = time
        self.info = info
    }

    init?(graphQL record: RecordFragment) {
        id = .id(record.id)
        products = record.products
        price = record.price.toMoney()! // TODO: is ! bad?
        time = record.time.toDate()! // TODO: is ! bad?
        info = record.info
    }
    
    func add(to con: Convention) -> RecordAdd {
        return RecordAdd(conId: con.id, products: products, price: price.toJSON(), time: time.toJSON(), info: info)
    }

    var modifications: RecordMod? {
        if let id = id.id {
            return RecordMod(recordId: id, products: products, price: price.toJSON(), info: info)
        } else {
            return nil
        }
    }
}
