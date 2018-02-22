//
//  UIView+Shadows.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-21.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

extension UIView {
    func addShadow() {
        layer.shadowRadius = 4
        layer.shadowOpacity = 0.25
        layer.shadowOffset = CGSize(width: 0, height: 4)
        layer.shadowColor = ConArtist.Color.Shadow.cgColor
    }
}
