//
//  ChipCollectionViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-03.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class ChipCollectionViewCell: UICollectionViewCell {
    static let ID = "ChipCell"
    @IBOutlet weak var titleLabel: UILabel!
    func setup(with title: String) {
        titleLabel.text = title
    }
}
