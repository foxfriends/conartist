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
        // kind of hacky but is there really any other way?
        (thumbIcon.image.caLayerTree.sublayers?[1] as? CAShapeLayer)?.fillColor
            = info.vote == .down    ? ConArtist.Color.Warn.cgColor
            : info.vote == .up      ? ConArtist.Color.Success.cgColor
            :                         ConArtist.Color.Text.cgColor
        infoLabel.text = info.info
    }
}
