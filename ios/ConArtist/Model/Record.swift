//
//  Record.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation

struct Record {
    let id: Int
    let products: [Int]
    let price: Money
    let time: Date
    
    static func from(graphQL maybeRecord: FullConventionQuery.Data.UserConvention.Record?) -> Record? {
        guard let record = maybeRecord else { return nil }
        return Record(
            id: record.id,
            products: record.products,
            price: record.price.toMoney()!, // TODO: is ! bad?
            time: record.time.toDate()! // TODO: is ! bad?
        )
    }
}
