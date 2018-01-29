//
//  Auth.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import RxSwift
import RxAlamofire
import Apollo
import Alamofire
import Gloss

struct Auth {
    /// Signs in with the provided account info, then retrieves the basic user data
    static func signIn(email: String, password: String) -> Observable<Void> {
        let parameters = [
            "usr": email,
            "psw": password
        ]
        return RxAlamofire
            .requestJSON(.post, ConArtist.API.SignInURL, parameters: parameters, encoding: JSONEncoding.default)
            .map(handleConRequest)
            .map(setAuthToken)
            .flatMap(loadUser)
            .map(storeUser)
    }

    /// Refreshes the provided authorization token, then retrieves the user data again
    static func reauthorize() -> Observable<Void> {
        let headers = [
            "Authorization": "Bearer \(ConArtist.API.authToken)"
        ]
        return RxAlamofire
            .requestJSON(.get, ConArtist.API.SignInURL, headers: headers)
            .map(handleConRequest)
            .map(setAuthToken)
            .flatMap(loadUser)
            .map(storeUser)
    }
    
    private static func handleConRequest<T>(_ response: Any) throws -> T {
        guard let json = response as? JSON else {
            throw ConArtist.Error(msg: "Error parsing JSON for ConRequest")
        }
        switch ConRequest<T>.init(json: json)! {
        case .success(data: let data):
            return data
        case .failure(error: let error):
            throw ConArtist.Error(msg: error)
        }
    }
    
    private static func setAuthToken(_ authToken: String) -> Void {
        ConArtist.API.authToken = authToken
    }
    
    private static func loadUser() throws -> Observable<UserQuery.Data.User> {
        return
            ConArtist.API.GraphQL
                .observe(query: UserQuery(id: nil))
                .map { $0.user }
    }
    
    private static func storeUser(_ user: UserQuery.Data.User) -> Void {
        ConArtist.model.setUser(graphQL: user)
    }
}
