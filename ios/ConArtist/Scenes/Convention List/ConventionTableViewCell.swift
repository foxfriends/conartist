//
//  ConventionTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit

extension ConventionListViewController.Section {
    fileprivate var emptyStateText: String? {
        switch self {
        case .PresentEmpty: return "No conventions today"¡
        case .PastEmpty:    return "You haven't been to any conventions yet..."¡
        case .FutureEmpty:  return "You don't have any conventions starred... Why don't you go find one you like?"¡
        default:            return nil
        }
    }
}

class ConventionTableViewCell: UITableViewCell {
    @IBOutlet weak var dateLabel: UILabel?
    @IBOutlet weak var titleLabel: UILabel?
    @IBOutlet weak var moneyLabel: UILabel?
    @IBOutlet weak var locationLabel: UILabel?
    @IBOutlet weak var timeLabel: UILabel?
    @IBOutlet weak var cardView: UIView?

    func fill(with item: Convention) {
        titleLabel?.text = item.name
        dateLabel?.text = item.dateString
        let recordTotal = item.recordTotal ?? Money.zero
        let expenseTotal = item.expenseTotal ?? Money.zero
        moneyLabel?.text = recordTotal != Money.zero || expenseTotal != Money.zero ? (recordTotal - expenseTotal).toString() : nil
        cardView?.layer.cornerRadius = 10
        cardView?.addShadow()
        if case .Hours(let hours)? = item.extraInfo.first(where: { info in if case .Hours = info { return true } else { return false } }),
            let (open, close) = hours.first(where: { start, end in start.roundToDay() == Date().roundToDay()}) {
            timeLabel?.text = "{} - {}"¡
                % open.toString(ConventionExtraInfo.ShortHourFormat)
                % close.toString(ConventionExtraInfo.ShortHourFormat)
        } else {
            timeLabel?.text = ""
        }
    }

    func emptyState(for section: ConventionListViewController.Section) {
        titleLabel?.text = section.emptyStateText
        titleLabel?.font = titleLabel!.font.usingFeatures([.smallCaps])
        dateLabel?.text = nil
        locationLabel?.text = nil
        timeLabel?.text = nil
        moneyLabel?.text = nil
        cardView?.layer.cornerRadius = 10
    }
}
