//
//  Price.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

struct Price: Codable {
    let typeId: Int
    let productId: Int?
    let quantity: Int
    let price: Money
    
    init?(graphQL price: PriceFragment) {
        guard let money = price.price.toMoney() else { return nil }
        typeId = price.typeId
        productId = price.productId
        quantity = price.quantity
        self.price = money
    }
}
