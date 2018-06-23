//
//  ConArtist.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit
import SVGKit

struct ConArtist {
    static let model = Persist.load()

    struct Error: Swift.Error {
        let msg: String
    }

    static let NoID = 0

    struct Color {
        static let Shadow = UIColor(named: "Shadow")!
        static let Background = UIColor(named: "Background")!
        static let BackgroundVariant = UIColor(named: "BackgroundVariant")!
        static let BackgroundOverlay = UIColor(named: "BackgroundOverlay")!
        static let BackgroundNavBar = UIColor(named: "BackgroundNavBar")!
        static let Divider = UIColor(named: "Divider")!
        static let DividerDark = UIColor(named: "DividerDark")!
        static let Brand = UIColor(named: "Brand")!
        static let BrandVariant = UIColor(named: "BrandVariant")!
        static let Text = UIColor(named: "Text")!
        static let TextPlaceholder = UIColor(named: "TextPlaceholder")!
        static let Warn = UIColor(named: "Warn")!
        static let Success = UIColor(named: "Success")!
    }

    struct Images {
        struct SVG {
            struct Chevron {
                static let Down     = SVGKImage(named: "chevron_down.svg")!
                static let Up       = SVGKImage(named: "chevron_up.svg")!
                static let Right    = SVGKImage(named: "chevron_right.svg")!
            }

            struct Thumb {
                static let Down     = SVGKImage(named: "thumb_down.svg")!
                static let Up       = SVGKImage(named: "thumb_up.svg")!
            }
        }
    }
}
