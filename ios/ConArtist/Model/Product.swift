//
//  Product.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

struct Product {
    let id: Int
    let typeId: Int
    let name: String
    let discontinued: Bool
    
    static func from(graphQL maybeProduct: FullConventionQuery.Data.UserConvention.Product?) -> Product? {
        guard let product = maybeProduct else { return nil }
        return Product(
            id: product.id,
            typeId: product.typeId,
            name: product.name,
            discontinued: product.discontinued
        )
    }
}
