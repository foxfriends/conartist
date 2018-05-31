//
//  Product.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

struct Product: Codable {
    let id: Int
    let typeId: Int
    let name: String
    let quantity: Int
    let discontinued: Bool
    
    init?(graphQL product: ProductFragment) {
        id = product.id
        typeId = product.typeId
        name = product.name
        quantity = product.quantity
        discontinued = product.discontinued
    }

    func remainingQuantity(havingSold records: [Record]) -> Int {
        let sold = records.reduce(0) { sold, record in sold + record.products.count(occurrencesOf: id) }
        return max(0, quantity - sold)
    }
}

extension Product: Equatable {
    static func ==(a: Product, b: Product) -> Bool {
        return a.id == b.id
    }
}
