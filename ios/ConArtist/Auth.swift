//
//  Auth.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import PromiseKit
import Alamofire
import Gloss

struct Auth {
    /// Signs in with the provided account info, then retrieves the basic user data
    static func signIn(username: String, password: String) -> Promise<Void> {
        let parameters = [
            "usr": username,
            "psw": password
        ]
        return Alamofire
            .request(ConArtist.API.SignInURL, method: .post, parameters: parameters, encoding: JSONEncoding.default)
            .responseJSON()
            .then(execute: handleConRequest as ((Any) throws -> String))
            .then(execute: setAuthToken)
            .then(execute: loadUser)
            .then(execute: storeUser)
    }

    /// Refreshes the provided authorization token, then retrieves the user data again
    static func reauthorize() -> Promise<Void> {
        let headers = [
            "Authorization": "Bearer \(ConArtist.API.authToken)"
        ]
        return Alamofire
            .request(ConArtist.API.SignInURL, headers: headers)
            .responseJSON()
            .then(execute: handleConRequest as ((Any) throws -> String))
            .then(execute: setAuthToken)
            .then(execute: loadUser)
            .then(execute: storeUser)
    }
    
    private static func handleConRequest<T>(_ response: Any) throws -> T {
        guard let json = response as? JSON else {
            fatalError("HTTP Error?")
            // TODO: proper http error handling
        }
        switch ConRequest<T>.init(json: json)! {
        case .success(data: let data):
            return data
        case .failure(error: let error):
            throw CAError(msg: error)
        }
    }
    
    private static func setAuthToken(_ authToken: String) -> Void {
        ConArtist.API.authToken = authToken
    }
    
    private static func loadUser(_ _: Void) throws -> Promise<UserQuery.Data.User> {
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
    
    private static func storeUser(_ user: UserQuery.Data.User) -> Void {
        ConArtist.model = Model.from(graphQL: user)
    }
}
