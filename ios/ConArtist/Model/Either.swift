//
//  Either.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-06-30.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

enum Either<T, U> {
    case left(T)
    case right(U)

    var left: T? {
        switch self {
        case .left(let item): return item
        default: return nil
        }
    }

    var right: U? {
        switch self {
        case .right(let item): return item
        default: return nil
        }
    }
}

extension Either: Codable where T: Codable, U: Codable {
    init(from decoder: Decoder) throws {
        if let left = try? T(from: decoder) {
            self = .left(left)
            return
        }
        if let right = try? U(from: decoder) {
            self = .right(right)
            return
        }
        throw DecodingError.dataCorrupted(
            DecodingError.Context(
                codingPath: decoder.codingPath,
                debugDescription: "Could not decode either of the expected types"
            )
        )
    }

    func encode(to encoder: Encoder) throws {
        switch self {
        case .left(let item): try item.encode(to: encoder)
        case .right(let item): try item.encode(to: encoder)
        }
    }
}
