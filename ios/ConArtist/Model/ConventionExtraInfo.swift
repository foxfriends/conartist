//
//  ConventionExtraInfo.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-19.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

enum ConventionExtraInfo {
    static var HourFormat: String { return "h:mma"¡ }
    static var ShortHourFormat: String { return "h:mm"¡ }
    static var ShortDayFormat: String { return "EEE"¡ }

    case Hours([(Date, Date)])
    case Dates(Date, Date)
    case Website(display: String, url: String)
    case Address(display: String, url: String)

    init?(graphQL conventionInfo: ExtraInfoFragment) {
        switch conventionInfo.title {
        case "Hours":
            guard let hours: [Pair<Date>] = conventionInfo.info?.parseJSON() else { return nil }
            self = .Hours(hours.map { $0.raw })
        case "Address":
            guard let info: String = conventionInfo.info?.parseJSON(), let url = conventionInfo.action else { return nil }
            self = .Address(display: info, url: url)
        case "Website":
            guard let info = conventionInfo.actionText, let url = conventionInfo.action else { return nil }
            self = .Website(display: info, url: url)
        default: return nil
        }
    }

    var title: String {
        switch self {
        case .Hours: return "Hours"¡
        case .Dates: return "Dates"¡
        case .Website: return "Website"¡
        case .Address: return "Address"¡
        }
    }

    var info: String? {
        switch self {
        case .Hours(let hours):
            return hours
                .map { open, close in "{} {} - {}"¡ % open.toString(ConventionExtraInfo.ShortDayFormat) % open.toString(ConventionExtraInfo.HourFormat) % close.toString(ConventionExtraInfo.HourFormat) }
                .joined(separator: "\n")
        case .Dates(let dates): return Convention.formatDateRange(start: dates.0, end: dates.1)
        case .Address(let display, _): return display
        default: return nil
        }
    }

    var actionText: String? {
        switch self {
        case .Address: return "View on map"¡
        case .Website(let display, _): return display
        default: return nil
        }
    }

    var action: String? {
        // TODO: rethink how this action is going to work, since it never worked anyway
        return nil
    }

    var cellIdentifier: String {
        switch self {
        case .Website: return "PrimaryAction"
        case .Address: return "SecondaryAction"
        default: return "NoAction"
        }
    }
}
