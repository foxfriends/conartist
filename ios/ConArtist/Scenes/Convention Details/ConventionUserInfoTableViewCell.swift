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
    private static let ThumbsUpImage = ConArtist.Images.SVG.Thumb.Up.uiImage.withRenderingMode(.alwaysTemplate)
    private static let ThumbsDownImage = ConArtist.Images.SVG.Thumb.Down.uiImage.withRenderingMode(.alwaysTemplate)

    static let ID = "ConventionUserInfo"
    @IBOutlet weak var ratingLabel: UILabel!
    @IBOutlet weak var thumbIcon: UIImageView!
    @IBOutlet weak var infoLabel: UILabel!

    func setup(for info: ConventionUserInfo) {
        ratingLabel.text = "\(info.rating)"
        thumbIcon.image = info.vote == .down
            ? ConventionUserInfoTableViewCell.ThumbsDownImage
            : ConventionUserInfoTableViewCell.ThumbsUpImage
        switch info.vote {
        case .down: thumbIcon.tintColor = ConArtist.Color.Warn
        case .up:   thumbIcon.tintColor = ConArtist.Color.Success
        default:    thumbIcon.tintColor = ConArtist.Color.Text
        }
        infoLabel.text = info.info
    }
}
