//
//  RecordsOverviewDateHeaderView.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-08.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import SVGKit

class RecordsOverviewDateHeaderView: UIView {
    static let DateFormat = "EEEE MMMM d, yyyy"¡

    weak var dateLabel: UILabel!
    weak var expandIcon: SVGKImageView!

    func setup(for date: Date, expanded: Bool, onTap handler: () -> Void) {
        buildSubviews()

        dateLabel.text = date.toString(RecordsOverviewDateHeaderView.DateFormat)
        expandIcon.image = expanded ? ConArtist.Images.SVG.Chevron.Up : ConArtist.Images.SVG.Chevron.Down
    }

    private func buildSubviews() {
        guard subviews.isEmpty else { return }
        let dateLabel = UILabel().customizable()
        let expandIcon = SVGKFastImageView().customizable()
        addSubview(dateLabel)
        addSubview(expandIcon)

        dateLabel.font = UIFont.systemFont(ofSize: 14).usingFeatures([.smallCaps])
        dateLabel.textColor = ConArtist.Color.Text

        expandIcon.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 20).isActive = true
        expandIcon.centerYAnchor.constraint(equalTo: centerYAnchor).isActive = true
        dateLabel.leadingAnchor.constraint(equalTo: expandIcon.trailingAnchor, constant: 6).isActive = true
        dateLabel.centerYAnchor.constraint(equalTo: centerYAnchor).isActive = true

        self.dateLabel = dateLabel
        self.expandIcon = expandIcon
    }
}
