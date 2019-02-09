//
//  Optional+Helpers.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-23.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

extension Optional {
    func tryMap<T>(_ transform: (Wrapped) throws -> T) -> T? {
        switch self {
        case .none: return .none
        case .some(let item): return try? transform(item)
        }
    }

    func tryFlatMap<T>(_ transform: (Wrapped) throws -> T?) -> T? {
        switch self {
        case .none: return .none
        case .some(let item): return (try? transform(item)) ?? nil
        }
    }

    func filter(_ predicate: (Wrapped) throws -> Bool) rethrows -> Optional<Wrapped> {
        switch self {
        case let .some(item) where try predicate(item): return .some(item)
        default: return nil
        }
    }
}
