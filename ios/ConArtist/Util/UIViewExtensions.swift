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
    func showTooltip(text: String) {
        showTooltip(
            attributedText: NSAttributedString(
                string: text,
                attributes: [
                    NSForegroundColorAttributeName: UIColor.lightGray,
                    NSFontAttributeName: UIFont.systemFont(ofSize: 14)
                ]
            )
        )
    }
    
    func showTooltip(attributedText: NSAttributedString) {
        guard let tooltip = SexyTooltip(attributedString: attributedText) else { return }
        tooltip.hasShadow = true
        tooltip.cornerRadius = 15
        tooltip.margin = UIEdgeInsets.zero
        tooltip.padding = UIEdgeInsets(top: 10, left: 10, bottom: 10, right: 10)
        tooltip.present(from: self)
        tooltip.dismiss(inTimeInterval: 5)
    }
}
