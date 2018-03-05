//
//  String+Display.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-04.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

protocol Display {
    func fmt() -> String
}

extension String {
    static func %<T>(_ string: String, _ t: T) -> String where T: Display {
        guard let range = string.range(of: "{}") else { return string + t.fmt() }
        return string.replacingCharacters(in: range, with: t.fmt())
    }
}
