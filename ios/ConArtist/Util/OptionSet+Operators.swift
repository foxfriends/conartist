//
//  OptionSet+Operators.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-16.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

extension SetAlgebra {
    static func | (_ a: Self, b: Self) -> Self { return a.union(b) }
}
