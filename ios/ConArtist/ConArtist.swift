//
//  ConArtist.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Apollo

struct ConArtist {
    struct API {
        static let BaseURL = "http://con--artist.herokuapp.com"
        static let SignInURL = BaseURL + "/auth"

        private static let GraphQLURL = BaseURL + "/api/v2"
        private static var authToken: String? = nil
        static var AuthToken: String {
            get { return authToken ?? "Unauthorized" }
            set {
                authToken = newValue
                let config = URLSessionConfiguration.default
                config.httpAdditionalHeaders = ["Authorization": "Bearer \(AuthToken)"]

                GraphQL = ApolloClient(
                    networkTransport: HTTPNetworkTransport(
                        url: URL(string: ConArtist.API.GraphQLURL)!,
                        configuration: config
                    )
                )
            }
        }
        static var GraphQL = ApolloClient(url: URL(string: ConArtist.API.GraphQLURL)!)
    }
}
