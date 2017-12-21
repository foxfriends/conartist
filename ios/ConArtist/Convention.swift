//
//  Convention.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation

enum Convention {
    case Meta(
        id: Int,
        code: String,
        name: String,
        start: Date,
        end: Date
    )
    case Full(
        id: Int,
        code: String,
        name: String,
        start: Date,
        end: Date
        // TODO: fill in with rest of model!
    )
    
    // MARK: - Accessors
    
    var name: String {
        get {
            switch self {
            case .Meta(_, _, let name, _, _):
                return name
            case .Full(_, _, let name, _, _):
                return name
            }
        }
    }
    
    var start: Date {
        get {
            switch self {
            case .Meta(_, _, _, let start, _):
                return start
            case .Full(_, _, _, let start, _):
                return start
            }
        }
    }
    
    var end: Date {
        get {
            switch self {
            case .Meta(_, _, _, _, let end):
                return end
            case .Full(_, _, _, _, let end):
                return end
            }
        }
    }
    
    // MARK: - Initializers
    
    static func from(graphQL maybeCon: UserQuery.Data.User.Convention?) -> Convention? {
        guard let con = maybeCon else { return nil }
        return Convention.Meta(
            id: con.id,
            code: con.code, 
            name: con.name, 
            start: con.start.toDate()!,
            end: con.end.toDate()!
        )
    }
}
