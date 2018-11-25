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
        static var GraphQL = ApolloClient(url: ConArtist.API.GraphQLURL)
        static let Resources = ApolloClient(url: ConArtist.API.ResourcesURL)
    }
}
