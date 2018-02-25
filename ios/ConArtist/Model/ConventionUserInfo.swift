//
//  ConventionUserInfo.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-24.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

struct ConventionUserInfo {
    let id: Int
    let info: String
    let rating: Int

    init?(graphQL maybeInfo: UserQuery.Data.User.Convention.UserInfo?) {
        guard let userInfo = maybeInfo else { return nil }
        id = userInfo.id
        info = userInfo.info
        rating = userInfo.upvotes - userInfo.downvotes
    }

    init?(graphQL maybeInfo: FullConventionQuery.Data.UserConvention.UserInfo?) {
        guard let userInfo = maybeInfo else { return nil }
        id = userInfo.id
        info = userInfo.info
        rating = userInfo.upvotes - userInfo.downvotes
    }
}

extension ConventionUserInfo: Equatable {
    static func ==(a: ConventionUserInfo, b: ConventionUserInfo) -> Bool {
        return a.id == b.id
    }
}

extension ConventionUserInfo: Comparable {
    static func <(a: ConventionUserInfo, b: ConventionUserInfo) -> Bool {
        return a.rating < b.rating
    }

    static func <=(a: ConventionUserInfo, b: ConventionUserInfo) -> Bool {
        return a.rating <= b.rating
    }

    static func >(a: ConventionUserInfo, b: ConventionUserInfo) -> Bool {
        return a.rating > b.rating
    }

    static func >=(a: ConventionUserInfo, b: ConventionUserInfo) -> Bool {
        return a.rating < b.rating
    }
}
