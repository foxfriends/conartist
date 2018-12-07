//
//  Connection.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

struct Connection<T> {
    static var empty: Connection<T> { return Connection(nodes: [], endCursor: nil, totalNodes: 0) }

    let nodes: [T]
    let endCursor: String?
    let totalNodes: Int
}

extension Connection {
    var isEmpty: Bool { return nodes.isEmpty }
    var isFull: Bool { return nodes.count >= totalNodes && !isEmpty }

    func prepend(_ node: T) -> Connection<T> {
        return Connection(
            nodes: [node] + nodes,
            endCursor: endCursor,
            totalNodes: totalNodes + 1
        )
    }

    func extend(_ extender: Connection<T>) -> Connection<T> {
        return Connection(
            nodes: nodes + extender.nodes,
            endCursor: extender.endCursor,
            totalNodes: extender.totalNodes
        )
    }
}

extension Connection where T == Suggestion {
    init?(graphQL: SuggestionsConnectionQuery.Data.SuggestionsConnection) {
        nodes = graphQL.nodes
            .map { $0.fragments.suggestionFragment }
            .compactMap(Suggestion.init(graphQL:))
        endCursor = graphQL.endCursor
        totalNodes = graphQL.totalNodes
    }

    func replace(_ suggestion: Suggestion) -> Connection<T> {
        return Connection(
            nodes: nodes.replace(with: suggestion, where: { $0.id == suggestion.id }),
            endCursor: endCursor,
            totalNodes: totalNodes
        )
    }
}

extension Connection where T == Convention {
    init?(graphQL: ConventionsConnectionQuery.Data.ConventionsConnection) {
        nodes = graphQL.nodes
            .map { $0.fragments.conventionBasicInfoFragment }
            .compactMap(BasicConvention.init(graphQL:))
        endCursor = graphQL.endCursor
        totalNodes = graphQL.totalNodes
    }
}
