//
//  API.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-24.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Alamofire
import Apollo
import RxSwift

extension ConArtist {
    struct API {
        static let GraphQLURL = URL(string: Config.retrieve(Config.GraphQLURL.self))!
        static let ResourcesURL = URL(string: Config.retrieve(Config.ResourcesURL.self))!
        static var GraphQL = createApolloClient()
        static let Resources = ApolloClient(url: ConArtist.API.ResourcesURL)

        static func createApolloClient() -> ApolloClient {
            let config = URLSessionConfiguration.default
            config.httpAdditionalHeaders = ["Authorization": "Bearer \(API.Auth.authToken)"]

            let session = URLSession(configuration: config)

            return ApolloClient(
                networkTransport: HTTPNetworkTransport(
                    url: ConArtist.API.GraphQLURL,
                    session: session
                )
            )
        }
    }
}
