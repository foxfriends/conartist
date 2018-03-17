//
//  Sequence+Helpers.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

extension Sequence {
    func filterMap<T>(_ transform: (Element) -> T?) -> [T] {
        return map(transform).filter { $0 != nil } as! [T]
    }

    func replace(with element: Element, where predicate: (Element) -> Bool) -> [Element] {
        return map { predicate($0) ? element : $0 }
    }

    func count(where predicate: (Element) -> Bool) -> Int {
        return reduce(0) { count, element in count + (predicate(element) ? 1 : 0) }
    }
}

extension Array {
    mutating func removeFirst(where predicate: (Element) -> Bool) {
        guard let index = index(where: predicate) else { return }
        remove(at: index)
    }

    func split(where predicate: (Element, Element) -> Bool) -> [[Element]] {
        guard let first = first else { return [] }
        var output: [[Element]] = [[first]]
        for element: Element in self.dropFirst() {
            if predicate(output.last!.last!, element) {
                output += [[element]]
            } else {
                output[output.count - 1] += [element]
            }
        }
        return output
    }
}

extension Sequence where Element: Hashable {
    func unique() -> [Element] {
        return Array(Set(self))
    }
}

extension Sequence where Element: Equatable {
    func count(occurrencesOf instance: Element) -> Int {
        return count { $0 == instance }
    }
}
