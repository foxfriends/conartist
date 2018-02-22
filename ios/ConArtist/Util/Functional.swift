//
//  Functional.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-21.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

// Function composition operator
infix operator °
func °<A, B, C>(f: @escaping (B) -> C, g: @escaping (A) -> B) -> (A) -> C {
    return { f(g($0)) }
}

// Ignore parameter and always return a value
func const<T, U>(_ it: @autoclosure @escaping () -> T) -> (U) -> T {
    return { _ in it() }
}

// Returns the argument provided given
func identity<T>(_ it: T) -> T {
    return it
}
