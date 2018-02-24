//
//  ConventionExtraInfo.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-19.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

enum ConventionExtraInfo: Decodable {
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

    private enum Key: String, CodingKey {
        case title = "title"
        case info = "info"
        case actionText = "actionText"
        case action = "action"
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: Key.self)
        let title = try container.decode(String.self, forKey: .title)
        let info = try? container.decode(String.self, forKey: .info)
        let action = try? container.decode(String.self, forKey: .action)
        let actionText = try? container.decode(String.self, forKey: .actionText)

        if let info = info, let action = action, let actionText = actionText {
            self = .SecondaryAction(title: title, info: info, actionText: actionText, action: action)
        } else if let action = action, let actionText = actionText {
            self = .PrimaryAction(title: title, actionText: actionText, action: action)
        } else if let info = info {
            self = .NoAction(title: title, info: info)
        } else {
            throw ConArtist.Error(msg: "Invalid combination of properties for ConventionExtraData")
        }

    }
}
