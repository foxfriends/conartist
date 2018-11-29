//
//  Suggestion.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

enum SuggestionStatus: Int, Codable {
    case open
    case inProgress
    case completed
    case cancelled
}

struct Suggestion {
    let id: Int
    let suggestion: String
    let suggester: String
    let status: SuggestionStatus
    let ranking: Int
    let voted: Bool
    let time: Date

    init?(graphQL: SuggestionFragment) {
        guard
            let status = SuggestionStatus(rawValue: graphQL.status),
            let time = graphQL.suggestedAt.toDate()
        else {
            return nil
        }
        id = graphQL.id
        suggestion = graphQL.suggestion
        suggester = graphQL.suggester.name
        ranking = graphQL.ranking
        voted = graphQL.voted
        self.status = status
        self.time = time
    }
}
