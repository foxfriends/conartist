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
    let quantity: Int
    let discontinued: Bool
    
    init?(graphQL product: ProductFragment) {
        id = product.id
        typeId = product.typeId
        name = product.name
        quantity = product.quantity
        discontinued = product.discontinued
    }
}
