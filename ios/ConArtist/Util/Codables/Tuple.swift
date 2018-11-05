//
//  Tuple.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-12.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

struct Pair<T: Codable>: Codable {
    let raw: (T, T)

    init(_ raw: (T, T)) {
        self.raw = raw
    }

    init(from decoder: Decoder) throws {
        let array = try [T].init(from: decoder)
        raw = (array[0], array[1])
    }

    func encode(to encoder: Encoder) throws {
        var json = encoder.singleValueContainer()
        try json.encode([raw.0, raw.1])
    }
}
