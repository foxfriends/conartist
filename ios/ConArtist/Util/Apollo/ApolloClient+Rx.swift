//
//  ApolloClient+Rx.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation
import Apollo
import RxSwift

extension ApolloClient {
    enum RxError: Error {
        case errors([Error])
        case noResult
    }

    func observe<Query: GraphQLQuery>(query: Query, cachePolicy: CachePolicy = .fetchIgnoringCacheData, queue: DispatchQueue = DispatchQueue.main) -> Single<Query.Data> {
        return Single
            .create { observer in
                let cancel = self.fetch(query: query, cachePolicy: cachePolicy, context: nil, queue: queue) { result in
                    switch result {
                    case .failure(let error):
                        observer(.error(error))
                    case .success(let result):
                        guard let data = result.data else {
                            observer(.error(RxError.errors(result.errors ?? [])))
                            return
                        }
                        observer(.success(data))
                    }
                }
                return Disposables.create {
                    cancel.cancel()
                }
            }
            .catchError { error in
                switch error {
                case let error as GraphQLHTTPResponseError:
                    if error.response.statusCode == 401 {
                        ConArtist.signOut()
                    }
                    fallthrough
                default:
                    throw debug(error)
                }
            }
    }

    func observe<Mutation: GraphQLMutation>(mutation: Mutation, queue: DispatchQueue = DispatchQueue.main) -> Single<Mutation.Data> {
        return Single
            .create { observer in
                let cancel = self.perform(mutation: mutation, context: nil, queue: queue) { result in
                    switch result {
                    case .failure(let error):
                        observer(.error(error))
                    case .success(let result):
                        guard let data = result.data else {
                            observer(.error(RxError.errors(result.errors ?? [])))
                            return
                        }
                        observer(.success(data))
                    }
                }
                return Disposables.create {
                    cancel.cancel()
                }
            }
            .catchError { error in throw debug(error) }
    }
}
