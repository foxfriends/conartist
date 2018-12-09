//
//  SettingsSelectOptionTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-01.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class SettingsSelectOptionTableViewCell: ConArtistTableViewCell {
    static let ID = "SettingsSelectOptionCell"
    @IBOutlet weak var titleLabel: UILabel!

    func setup(title: String, selected: Bool) {
        titleLabel.text = title
        accessoryType = selected ? .checkmark : .none
    }
}
