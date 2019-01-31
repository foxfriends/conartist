//
//  SettingsActionTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-03.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class SettingsActionTableViewCell: ConArtistTableViewCell {
    static let ID = "SettingsActionCell"
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var detailIcon: UIImageView!

    override var tintColor: UIColor! {
        didSet {
            detailIcon.tintColor = tintColor
        }
    }

    override func prepareForReuse() {
        super.prepareForReuse()
        detailIcon.image = nil
        tintColor = .white
    }

    func setup(title: String, detail: UIImage? = nil) {
        titleLabel.text = title
        detailIcon.image = detail
    }

    func setup(title: NSAttributedString, detail: UIImage? = nil) {
        titleLabel.attributedText = title
        detailIcon.image = detail
    }
}
