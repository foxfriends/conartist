//
//  ApolloClientExtensions.swift
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
    func observe<Query: GraphQLQuery>(query: Query, cachePolicy: CachePolicy = .returnCacheDataElseFetch, queue: DispatchQueue = DispatchQueue.main) -> Observable<Query.Data> {
        return Observable.create { observer in
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
            }
            return Disposables.create()
        }
    }
    func observe<Mutation: GraphQLMutation>(mutation: Mutation, queue: DispatchQueue = DispatchQueue.main) -> Observable<Mutation.Data> {
        return Observable.create { observer in
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
            }
            return Disposables.create()
        }
    }
}
