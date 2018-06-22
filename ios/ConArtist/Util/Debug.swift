//
//  Debug.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-06-22.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

#if DEBUG
@inline(__always) @discardableResult
func debug<T>(_ it: T) -> T {
    print(it)
    return it
}
#else
@inline(__always) @discardableResult
func debug<T>(_ it: T) -> T { return it }
#endif
