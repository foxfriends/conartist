//
//  Auth.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Alamofire
import Apollo
import Gloss
import RxSwift
import RxAlamofire

extension ConArtist.API {
    struct Auth {
        static let SignInURL = BaseURL + "/api/auth"
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
                .requestJSON(.post, SignInURL, parameters: parameters, encoding: JSONEncoding.default)
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
                .requestJSON(.get, SignInURL, headers: headers)
                .map(handleConRequest)
                .map(setAuthToken)
                .flatMap(loadUser)
                .map(ConArtist.model.merge(graphQL:))
        }

        private static func handleConRequest<T>(_ response: (HTTPURLResponse, Any)) throws -> T {
            guard let json = response.1 as? JSON else {
                throw ConArtist.Error(msg: "Error parsing JSON for ConRequest: \(response)")
            }
            switch ConRequest<T>.init(json: json)! {
            case .success(data: let data):
                return data
            case .failure(error: let error):
                throw ConArtist.Error(msg: error)
            }
        }

        private static func setAuthToken(_ authToken: String) -> Void {
            ConArtist.API.Auth.authToken = authToken
        }

        private static func loadUser() throws -> Observable<UserFragment> {
            return ConArtist.API.GraphQL
                .observe(query: UserQuery(id: nil), cachePolicy: .fetchIgnoringCacheData)
                .map { $0.user.fragments.userFragment }
        }
    }
}
