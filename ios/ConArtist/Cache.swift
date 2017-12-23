//
//  Cache.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-22.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

class Cache<T> {
    private let calculation: () -> T
    private var cached: T? = nil
    
    init(_ calc: @escaping () -> T) {
        self.calculation = calc
    }
    
    func get() -> T {
        if cached == nil {
            cached = calculation()
        }
        return cached!
    }
    
    func clear() {
        cached = nil
    }
}
