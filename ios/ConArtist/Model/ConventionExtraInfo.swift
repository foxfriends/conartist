//
//  ConventionExtraInfo.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-19.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

enum ConventionExtraInfo {
    case NoAction(title: String, info: String)
    case PrimaryAction(title: String, actionText: String, action: String)
    case SecondaryAction(title: String, info: String, actionText: String, action: String)

    var title: String {
        switch self {
        case .NoAction(let title, _),
             .PrimaryAction(let title, _, _),
             .SecondaryAction(let title, _, _, _):
            return title
        }
    }
    var info: String? {
        switch self {
        case .NoAction(_, let info),
             .SecondaryAction(_, let info, _, _):
            return info
        default:
            return nil
        }
    }
    var actionText: String? {
        switch self {
        case .PrimaryAction(_, let actionText, _),
             .SecondaryAction(_, _, let actionText, _):
            return actionText
        default:
            return nil
        }
    }
    var action: String? {
        switch self {
        case .PrimaryAction(_, _, let action),
             .SecondaryAction(_, _, _, let action):
            return action
        default:
            return nil
        }
    }

    init?(graphQL conventionInfo: ExtraInfoFragment) {
        if let info = conventionInfo.info, let action = conventionInfo.action, let actionText = conventionInfo.actionText {
            self = .SecondaryAction(title: conventionInfo.title, info: info, actionText: actionText, action: action)
        } else if let action = conventionInfo.action, let actionText = conventionInfo.actionText {
            self = .PrimaryAction(title: conventionInfo.title, actionText: actionText, action: action)
        } else if let info = conventionInfo.info {
            self = .NoAction(title: conventionInfo.title, info: info)
        } else {
            return nil
        }
    }
}
