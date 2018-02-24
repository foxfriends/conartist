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
        static let BaseURL = "https://con--artist.herokuapp.com"
        static let GraphQLURL = URL(string: BaseURL + "/api/v2")!
        static var GraphQL = ApolloClient(url: ConArtist.API.GraphQLURL)
    }
}
