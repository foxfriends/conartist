//
//  HighlightableView.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-14.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class HighlightableView: UIView {
    @IBInspectable var defaultColor: UIColor = ConArtist.Color.Divider {
        didSet {
            if backgroundColor == oldValue {
                backgroundColor = defaultColor
            }
        }
    }
    @IBInspectable var highlightColor: UIColor = ConArtist.Color.Brand {
        didSet {
            if backgroundColor == oldValue {
                backgroundColor = highlightColor
            }
        }
    }

    var isHighlighted: Bool {
        get { return backgroundColor == highlightColor }
        set { backgroundColor = newValue ? highlightColor : defaultColor }
    }

    private func onInit() {
        backgroundColor = defaultColor
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        onInit()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        onInit()
    }
}
