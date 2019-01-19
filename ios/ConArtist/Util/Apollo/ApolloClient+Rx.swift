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

    func observe<Query: GraphQLQuery>(query: Query, cachePolicy: CachePolicy = .fetchIgnoringCacheData, queue: DispatchQueue = DispatchQueue.main) -> Observable<Query.Data> {
        return Observable
            .create { observer in
                self.fetch(query: query, cachePolicy: cachePolicy, queue: queue) { result, error in
                    if let error = error {
                        observer.onError(error)
                        return
                    }
                    guard let result = result else {
                        observer.onError(RxError.noResult)
                        return
                    }
                    guard let data = result.data else {
                        observer.onError(RxError.errors(result.errors ?? []))
                        return
                    }
                    observer.onNext(data)
                    observer.onCompleted()
                }
                return Disposables.create()
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

    func observe<Mutation: GraphQLMutation>(mutation: Mutation, queue: DispatchQueue = DispatchQueue.main) -> Observable<Mutation.Data> {
        return Observable
            .create { observer in
                self.perform(mutation: mutation, queue: queue) { result, error in
                    if let error = error {
                        observer.onError(error)
                        return
                    }
                    guard let result = result else {
                        observer.onError(RxError.noResult)
                        return
                    }
                    guard let data = result.data else {
                        observer.onError(RxError.errors(result.errors ?? []))
                        return
                    }
                    observer.onNext(data)
                    observer.onCompleted()
                }
                return Disposables.create()
            }
            .catchError { error in throw debug(error) }
    }
}
