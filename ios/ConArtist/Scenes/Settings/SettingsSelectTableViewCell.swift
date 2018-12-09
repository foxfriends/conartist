//
//  SettingsSelectTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-01.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class SettingsSelectTableViewCell: ConArtistTableViewCell {
    static let ID = "SettingsSelectCell"

    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var valueLabel: UILabel!

    func setup(title: String, value: String) {
        titleLabel.text = title
        valueLabel.text = value
    }
}
