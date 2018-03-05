//
//  ConventionTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit

class ConventionTableViewCell: UITableViewCell {
    static let ID = "ConventionCell"
    @IBOutlet weak var dateLabel: UILabel?
    @IBOutlet weak var titleLabel: UILabel?
    @IBOutlet weak var moneyLabel: UILabel?
    @IBOutlet weak var locationLabel: UILabel?
    @IBOutlet weak var timeLabel: UILabel?
    @IBOutlet weak var cardView: UIView?

    func fill(with item: Convention) {
        titleLabel?.text = item.name
        dateLabel?.text = item.dateString
        // TODO: extra info and money label needs real values
        cardView?.layer.cornerRadius = 10
        cardView?.addShadow()
    }

    func emptyState() {
        titleLabel?.text = "No conventions today"¡
        titleLabel?.font = titleLabel!.font.usingFeatures([.smallCaps])
        dateLabel?.text = nil
        locationLabel?.text = nil
        timeLabel?.text = nil
        moneyLabel?.text = nil
        cardView?.layer.cornerRadius = 10
    }
}
