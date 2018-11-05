//
//  ManageProductTypeTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-10-30.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class ManageProductTypeTableViewCell: UITableViewCell {
    @IBOutlet weak var nameLabel: UILabel!
}

// MARK: - Setup

extension ManageProductTypeTableViewCell {
    static let ID = "ManageProductTypeCell"

    func setup(with type: ProductType) {
        nameLabel.text = type.name
        nameLabel.textColor = type.discontinued ? .textPlaceholder : .text
    }
}
