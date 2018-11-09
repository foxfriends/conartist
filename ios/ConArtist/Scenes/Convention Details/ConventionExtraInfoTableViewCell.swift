//
//  ConventionExtraInfoTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-22.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import PrettyString

class ConventionExtraInfoTableViewCell: UITableViewCell {
    @IBOutlet weak var titleLabel: UILabel?
    @IBOutlet weak var infoLabel: UILabel?
    @IBOutlet weak var actionLabel: UILabel?

    private var info: ConventionExtraInfo!

    func setup(with info: ConventionExtraInfo) {
        self.info = info
        titleLabel?.text = info.title¡
        titleLabel?.font = titleLabel!.font.usingFeatures([.smallCaps])

        actionLabel?.text = info.actionText

        infoLabel?.text = info.info
        if case .Hours = info {
            infoLabel?.font = infoLabel!.font.usingFeatures([.tabularFigures])
        }
        infoLabel?.numberOfLines = 0
        layoutIfNeeded()
    }
}
