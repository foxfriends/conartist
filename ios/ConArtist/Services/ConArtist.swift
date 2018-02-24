//
//  ConArtist.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation
import UIKit

struct ConArtist {
    static let model = Model()

    struct Error: Swift.Error {
        let msg: String
    }

    static let NoID = 0

    struct Color {
        static let Shadow = UIColor.black
        static let Background = UIColor(hex: 0x333333)
        static let BackgroundVariant = UIColor(hex: 0x444444)
        static let BackgroundNavBar = UIColor(hex: 0x111111)
        static let Divider = UIColor.white.withAlphaComponent(0.12)
        static let Brand = UIColor(hex: 0xDA4800)
        static let BrandVariant = UIColor(hex: 0xD9991E)
        static let Text = UIColor.white
        static let TextPlaceholder = UIColor.white.withAlphaComponent(0.5)
    }

    /// Handles universal URLs and deep links
    static func handleURL(_ url: String) {
        if let url = URL(string: url) {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
    }
}
