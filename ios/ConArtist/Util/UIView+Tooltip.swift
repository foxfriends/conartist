//
//  UIView+Tooltip.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import SexyTooltip

extension UIView {
    private static weak var openTooltip: SexyTooltip? {
        didSet {
            // only one tooltip should be visible at a time
            oldValue?.dismiss(animated: false)
        }
    }

    func showTooltip(text: String) {
        showTooltip(
            attributedText: NSAttributedString(
                string: text,
                attributes: [
                    .foregroundColor: ConArtist.Color.TextPlaceholder,
                    .font: UIFont.systemFont(ofSize: 14)
                ]
            )
        )
    }
    
    func showTooltip(attributedText: NSAttributedString) {
        guard let tooltip = SexyTooltip(attributedString: attributedText) else { return }
        tooltip.hasShadow = true
        tooltip.cornerRadius = 4
        tooltip.margin = UIEdgeInsets.zero
        tooltip.padding = UIEdgeInsets(top: 10, left: 16, bottom: 10, right: 16)
        tooltip.color = ConArtist.Color.BackgroundVariant
        tooltip.present(from: self)
        tooltip.dismiss(inTimeInterval: 5)
        UIView.openTooltip = tooltip
    }
}
