//
//  ConventionSearchTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-29.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import SVGKit

class ConventionSearchTableViewCell: UITableViewCell {
    static let ID = "ConventionSearchCell"
    @IBOutlet weak var starButton: UIButton!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var locationLabel: UILabel!
}

extension ConventionSearchTableViewCell {
    func setup(convention: Convention) {
        nameLabel.text = convention.name
        dateLabel.text = "{} - {}"¡
            % convention.start.toString("MMM. d, yyyy"¡)
            % convention.end.toString("MMM. d, yyyy"¡)
        let starred = ConArtist.model.conventions.value.contains { $0.id == convention.id }
        starButton.setImage(
            starred
                ? SVGKImage.star.uiImage.withRenderingMode(.alwaysTemplate)
                : SVGKImage.starOutline.uiImage.withRenderingMode(.alwaysTemplate),
            for: .normal
        )
        starButton.tintColor = starred
            ? .brandVariant
            : .text
    }
}
