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

    private init(id: Int, info: String, rating: Int) {
        self.id = id
        self.info = info
        self.rating = rating
    }

    init?(graphQL userInfo: UserInfoFragment) {
        id = userInfo.id
        info = userInfo.info
        rating = userInfo.upvotes - userInfo.downvotes
    }

    func adjustVotes(_ votes: VotesFragment) -> ConventionUserInfo {
        return ConventionUserInfo(id: id, info: info, rating: votes.upvotes - votes.downvotes)
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
