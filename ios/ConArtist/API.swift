//
//  API.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import PromiseKit
import Alamofire
import Gloss

struct API {
    /// Creates a new `User` by first signing in with the provided account info,
    /// then retrieving the basic user data.
    static func signIn(username: String, password: String) -> Promise<UserQuery.Data.User> {
        let parameters = [
            "usr": username,
            "psw": password
        ]
        print(username, password)
        return Alamofire
            .request(ConArtist.API.SignInURL, method: .post, parameters: parameters, encoding: JSONEncoding.default)
            .responseJSON()
            .then { response -> String in
                guard let json = response as? JSON else {
                    fatalError("HTTP Error?")
                    // TODO: proper http error handling
                }
                switch ConRequest<String>.init(json: json)! {
                case .success(data: let data):
                    return data
                case .failure(error: let error):
                    throw CAError(msg: error)
                }
            }
            .then { authToken -> Promise<UserQuery.Data.User> in
                ConArtist.API.AuthToken = authToken
                return Promise.init(resolvers: { (resolve, reject) in
                    ConArtist.API.GraphQL.fetch(query: UserQuery(id: nil)) { (result, error) in
                        guard let data = result?.data else {
                            reject(error!)
                            return
                        }
                        resolve(data.user)
                    }
                })
            }
    }
}
