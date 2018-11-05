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

    var id: (Int, Int?, Int) {
        return (typeId, productId, quantity)
    }

    var product: Product? {
        return productId.flatMap { productId in
            ConArtist.model.products.value.first { $0.id == productId }
        }
    }

    var productType: ProductType! {
        return ConArtist.model.productTypes.value.first { $0.id == typeId }
    }
}
