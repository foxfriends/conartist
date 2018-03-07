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

    init(info: String) {
        self.init(id: ConArtist.NoID, info: info, rating: 0)
    }

    private init(id: Int, info: String, rating: Int, vote: Vote = .none) {
        self.id = id
        self.info = info
        self.rating = rating
        self.vote = vote
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

    func setVote(to vote: Vote) -> ConventionUserInfo {
        let rating: Int
        switch (self.vote, vote) {
        case (.down, .none), (.none, .up): rating = self.rating + 1
        case (.up, .none), (.none, .down): rating = self.rating - 1
        case (.up, .down): rating = self.rating - 2
        case (.down, .up): rating = self.rating + 2
        default: rating = self.rating
        }
        return ConventionUserInfo(
            id: id,
            info: info,
            rating: rating,
            vote: vote
        )
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
