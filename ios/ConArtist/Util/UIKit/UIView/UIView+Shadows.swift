//
//  UIView+Shadows.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-21.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

extension UIView {
    func addShadow(
        radius: CGFloat = 4,
        opacity: Float = 0.25,
        offset: CGSize = CGSize(width: 0, height: 4),
        color: UIColor = .shadow
    ) {
        layer.shadowRadius = radius
        layer.shadowOpacity = opacity
        layer.shadowOffset = offset
        layer.shadowColor = color.cgColor
    }
}
