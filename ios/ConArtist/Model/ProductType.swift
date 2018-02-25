//
//  ProductType.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

struct ProductType {
    let id: Int
    let name: String
    let color: Int
    let discontinued: Bool
    
    init?(graphQL maybeType: FullConventionQuery.Data.UserConvention.ProductType?) {
        guard let type = maybeType else { return nil }
        id = type.id
        name = type.name
        color = type.color
        discontinued = type.discontinued
    }
}
