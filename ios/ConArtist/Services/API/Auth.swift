//
//  Auth.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Alamofire
import Apollo
import RxSwift
import RxAlamofire

private func handleConRequest<T: Decodable>(_ response: (HTTPURLResponse, Data)) throws -> T {
    switch try JSONDecoder().decode(ConRequest<T>.self, from: response.1) {
    case .success(let data):
        return data
    case .failure(let error):
        throw ConArtist.Error(msg: error)
    }
}

private func setAuthToken(_ authToken: String) -> Void {
    ConArtist.API.Auth.authToken = authToken
}

private func loadUser() throws -> Observable<FullUserFragment> {
    return ConArtist.API.GraphQL
        .observe(query: FullUserQuery(id: nil), cachePolicy: .fetchIgnoringCacheData)
        .map { $0.user.fragments.fullUserFragment }
}

extension ConArtist.API {
    struct Auth {
        static let Unauthorized = "Unauthorized"

        private static var _authToken: String? = ConArtist.Keychain.retrieve(valueFor: .AuthToken)
        static var authToken: String {
            get { return _authToken ?? Unauthorized }
            set {
                _authToken = newValue
                if !ConArtist.Keychain.store(value: authToken, for: .AuthToken) {
                    debug("Archival of authToken has failed. User will need to sign in again later")
                }
                let config = URLSessionConfiguration.default
                config.httpAdditionalHeaders = ["Authorization": "Bearer \(authToken)"]

                GraphQL = ApolloClient(
                    networkTransport: HTTPNetworkTransport(
                        url: ConArtist.API.GraphQLURL,
                        configuration: config
                    )
                )
            }
        }

        /// Signs in with the provided account info, then retrieves the basic user data
        static func signIn(email: String, password: String) -> Observable<Void> {
            let parameters = [
                "usr": email,
                "psw": password
            ]
            return RxAlamofire
                .requestData(.post, URL.signIn, parameters: parameters, encoding: JSONEncoding.default)
                .map(handleConRequest)
                .map(setAuthToken)
                .flatMap(loadUser)
                .map(ConArtist.model.merge(graphQL:))
        }

        /// Refreshes the provided authorization token, then retrieves the user data again
        static func reauthorize() -> Observable<Void> {
            let headers = [
                "Authorization": "Bearer \(authToken)"
            ]
            return RxAlamofire
                .requestData(.get, URL.signIn, headers: headers)
                .map(handleConRequest)
                .map(setAuthToken)
                .flatMap(loadUser)
                .map(ConArtist.model.merge(graphQL:))
        }
    }

    struct Account {
        static func emailInUse(_ email: String) -> Observable<Bool> {
            return RxAlamofire
                .requestData(.get, URL.accountExists(email), parameters: nil, encoding: JSONEncoding.default)
                .map(handleConRequest)
        }

        static func create(name: String, email: String, password: String) -> Observable<Void> {
            let parameters: [String: String] = [
                "name": name,
                "email": email,
                "password": password,
            ]
            return RxAlamofire
                .requestData(.post, URL.createAccount, parameters: parameters, encoding: JSONEncoding.default)
                .map(handleConRequest)
                .map(setAuthToken)
                .flatMap(loadUser)
                .map(ConArtist.model.merge(graphQL:))
        }
    }
}
