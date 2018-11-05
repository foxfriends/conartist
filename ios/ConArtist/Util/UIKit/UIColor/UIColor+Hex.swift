//
//  UIColor+Hex.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-06.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

extension UIColor {
    private static let opaque = CGFloat(1.0)
    
    convenience init(hex: Int) {
        let red = CGFloat((hex & 0xFF0000) >> 16) / 0xFF
        let green = CGFloat((hex & 0x00FF00) >> 8) / 0xFF
        let blue = CGFloat(hex & 0x0000FF) / 0xFF
        self.init(red: red, green: green, blue: blue, alpha: UIColor.opaque)
    }
}
