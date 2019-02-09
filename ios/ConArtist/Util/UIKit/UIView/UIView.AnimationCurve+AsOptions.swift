//
//  UIView.AnimationCurve+AsOptions.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2019-02-08.
//  Copyright © 2019 Cameron Eldridge. All rights reserved.
//

import UIKit

extension UIView.AnimationCurve {
    var asAnimationOptions: UIView.AnimationOptions {
        // is this sketchy or what? lol!
        return .init(rawValue: (UInt(rawValue) << 16))
    }
}
