//
//  ConArtistTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-12-08.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class ConArtistTableViewCell: UITableViewCell {
    override var isHighlighted: Bool {
        didSet {
            backgroundColor = isHighlighted ? .dividerDark : nil
        }
    }
}
