//
//  ConventionUserInfo.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-24.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

struct ConventionUserInfo {
    enum Vote { case none, up, down }
    let id: Int
    let info: String
    let rating: Int
    let vote: Vote

    private init(id: Int, info: String, rating: Int) {
        self.id = id
        self.info = info
        self.rating = rating
        self.vote = .none
    }

    init?(graphQL userInfo: UserInfoFragment) {
        id = userInfo.id
        info = userInfo.info
        rating = userInfo.upvotes - userInfo.downvotes
        switch userInfo.vote {
        case  1: vote = .up
        case -1: vote = .down
        default: vote = .none
        }
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
