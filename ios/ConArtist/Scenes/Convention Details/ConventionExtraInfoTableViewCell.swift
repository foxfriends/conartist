//
//  ConventionExtraInfoTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-22.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class ConventionExtraInfoTableViewCell: UITableViewCell {
    @IBOutlet weak var titleLabel: UILabel?
    @IBOutlet weak var infoLabel: UILabel?
    @IBOutlet weak var actionLabel: UILabel?

    func setup(with info: ConventionExtraInfo) {
        titleLabel?.text = info.title
        titleLabel?.font = titleLabel!.font.usingFeatures([.smallCaps])

        actionLabel?.text = info.actionText

        infoLabel?.text = info.info
        infoLabel?.numberOfLines = 1 + (info.info?.count(ocurrencesOf: "\n") ?? 0)
    }
}
