//
//  ConArtist.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Apollo
import Strongbox

struct ConArtist {
    struct API {
        static let BaseURL = "https://con--artist.herokuapp.com"
        static let SignInURL = BaseURL + "/api/auth"

        static let Unauthorized = "Unauthorized"
        private static let GraphQLURL = BaseURL + "/api/v2"
        private static var _authToken: String? = Strongbox().unarchive(objectForKey: Keys.AuthToken) as? String
        static var authToken: String {
            get { return _authToken ?? Unauthorized }
            set {
                _authToken = newValue
                if !Strongbox().archive(authToken, key: Keys.AuthToken) {
                    print("Archival of authToken has failed. User will need to sign in again later")
                }
                let config = URLSessionConfiguration.default
                config.httpAdditionalHeaders = ["Authorization": "Bearer \(authToken)"]

                _GraphQL = ApolloClient(
                    networkTransport: HTTPNetworkTransport(
                        url: URL(string: ConArtist.API.GraphQLURL)!,
                        configuration: config
                    )
                )
            }
        }
        static private var _GraphQL = ApolloClient(url: URL(string: ConArtist.API.GraphQLURL)!)
        static var GraphQL: ApolloClient { get { return _GraphQL } }
    }
    
    struct Keys {
        static let AuthToken = "AuthToken"
    }
    
    static var model: Model? = nil
    static var focusedConvention: Convention? = nil
}
