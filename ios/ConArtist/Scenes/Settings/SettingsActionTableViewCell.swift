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
    
    func setup(title: String) {
        titleLabel.text = title
    }
}
