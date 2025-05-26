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
        case .presentEmpty: return "No conventions today"¡
        case .pastEmpty:    return "You haven't been to any conventions yet..."¡
        case .futureEmpty:  return "You don't have any conventions starred... Why don't you go find one you like?"¡
        default:            return nil
        }
    }
}

class ConventionTableViewCell: ConArtistTableViewCell {
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
        let city = item.extraInfo
            .first(where: { if case .City = $0 { return true } else { return false } })
        if case let .some(.City(city)) = city {
            locationLabel?.text = city
        }
        let hours = item.extraInfo
            .first(where: { if case .Hours = $0 { return true } else { return false } })
        if case .Hours(let hours)? = hours,
            let (open, close) = hours.first(where: { start, end in start.roundToDay() == Date().roundToDay()}) {
            timeLabel?.text = "{} - {}"¡
                % open.formatted(ConventionExtraInfo.ShortHourFormat)
                % close.formatted(ConventionExtraInfo.ShortHourFormat)
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
