//
//  UIViewExtensions.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import SexyTooltip

extension UIView {
    func showTooltip(_ title: String) {
        let tooltip = SexyTooltip(attributedString: NSAttributedString(string: title, attributes: [:]))
        tooltip?.present(from: self)
        tooltip?.dismiss(inTimeInterval: 5)
    }
}
