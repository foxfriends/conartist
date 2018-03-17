//
//  RecordDetailsItemCollectionViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-15.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class RecordDetailsItemCollectionViewCell: UICollectionViewCell {
    static let ID = "RecordDetailsItemCell"
    
    @IBOutlet weak var nameLabel: UILabel!

    func setup(name: String) {
        nameLabel.text = name
    }
}
