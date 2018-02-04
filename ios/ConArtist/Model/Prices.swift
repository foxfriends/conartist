//
//  Prices.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-03.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

struct Prices {
    let typeId: Int
    let productId: Int?
    let prices: [Int: Money]
    
    static func condense(_ prices: [Price]) -> [Prices] {
        return Array(prices.reduce([:]) { condensed, price in
            var result = condensed
            let newPrice = condensed[price.productId ?? ConArtist.NoID] ?? Prices(typeId: price.typeId, productId: price.productId, prices: [:])
            result[price.productId ?? ConArtist.NoID] = newPrice.add(price: price.price, quantity: price.quantity)
            return result
        }.values)
    }
    
    func add(price: Money, quantity: Int) -> Prices {
        var newPrices = prices
        newPrices[quantity] = price
        return Prices(
            typeId: typeId,
            productId: productId,
            prices: newPrices
        )
    }
}
