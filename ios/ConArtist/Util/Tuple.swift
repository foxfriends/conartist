//
//  Tuple.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-12.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

struct Pair<T>: Decodable {
    let raw: (T, T)

    init(from decoder: Decoder) throws {
        let array = try [T].init(from: decoder)
        raw = (array[0], array[1])
    }
}
