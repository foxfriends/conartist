//
//  Price.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

struct Price {
    let typeId: Int
    let productId: Int?
    let quantity: Int
    let price: String // TODO: why is this a string?
    
    static func from(graphQL maybePrice: FullConventionQuery.Data.UserConvention.Price?) -> Price? {
        guard let price = maybePrice else { return nil }
        return Price(
            typeId: price.typeId,
            productId: price.productId,
            quantity: price.quantity, 
            price: price.price
        )
    }
}
