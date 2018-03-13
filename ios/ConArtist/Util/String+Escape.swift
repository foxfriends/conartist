//
//  String+Escape.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-12.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

extension StringProtocol {
    /// Escapes special characters in the string
    func escape() -> String {
        return String(self)
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "\n", with: "\\n")
            .replacingOccurrences(of: "\t", with: "\\t")
    }

    /// Unescapes escaped special characters
    func unescape() -> String {
        return String(self)
            .replacingOccurrences(of: "\\\\", with: "\\")
            .replacingOccurrences(of: "\\n", with: "\n")
            .replacingOccurrences(of: "\\t", with: "\t")
    }
}
