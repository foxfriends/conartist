//
//  ConventionDetailInfoView.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-22.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class ConventionDetailTableViewCell: UITableViewCell {
    @IBOutlet weak var titleLabel: UILabel?
    @IBOutlet weak var infoLabel: UILabel?
    @IBOutlet weak var actionLabel: UILabel?

    func setup(title: String? = "", info: String? = "", action: String? = "") {
        titleLabel?.text = title
        titleLabel?.font = titleLabel!.font.usingFeatures([.smallCaps])

        actionLabel?.text = action

        infoLabel?.text = info
        infoLabel?.numberOfLines = 1 + (info?.count(ocurrencesOf: "\n") ?? 0)
    }
}
