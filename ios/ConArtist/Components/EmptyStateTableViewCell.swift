//
//  EmptyStateTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class EmptyStateTableViewCell: UITableViewCell {
    static let ID = "EmptyStateCell"
    @IBOutlet weak var label: UILabel!
}

// MARK: - Setup

extension EmptyStateTableViewCell {
    func setup(text: String) {
        label.font = label.font.usingFeatures([.smallCaps])
        label.text = text
    }
}
