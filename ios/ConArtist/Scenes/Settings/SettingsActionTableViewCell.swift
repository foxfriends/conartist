//
//  SettingsActionTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-03.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class SettingsActionTableViewCell: UITableViewCell {
    static let ID = "SettingsActionCell"
    @IBOutlet weak var titleLabel: UILabel!

    override var isHighlighted: Bool {
        didSet {
            backgroundColor = isHighlighted ? .dividerDark : nil
        }
    }

    func setup(title: String) {
        titleLabel.text = title
    }

    func setup(title: NSAttributedString) {
        titleLabel.attributedText = title
    }
}
