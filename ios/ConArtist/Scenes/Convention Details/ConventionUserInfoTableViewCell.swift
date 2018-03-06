//
//  ConventionUserInfoTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-05.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import SVGKit

class ConventionUserInfoTableViewCell: UITableViewCell {
    static let ID = "ConventionUserInfo"
    @IBOutlet weak var ratingLabel: UILabel!
    @IBOutlet weak var thumbIcon: SVGKImageView!
    @IBOutlet weak var infoLabel: UILabel!

    func setup(for info: ConventionUserInfo) {
        ratingLabel.text = "\(info.rating)"
        thumbIcon.image = info.vote == .down ? ConArtist.Images.SVG.Thumb.Down : ConArtist.Images.SVG.Thumb.Up
        thumbIcon.tintColor = info.vote == .down    ? ConArtist.Color.Warn
                            : info.vote == .up      ? ConArtist.Color.Success
                            :                         ConArtist.Color.Text
        infoLabel.text = info.info
    }
}
