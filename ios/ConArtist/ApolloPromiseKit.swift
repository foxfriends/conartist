//
//  ApolloPromiseKit.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Apollo
import PromiseKit

extension Apollo.Promise {
    func pkPromise() -> PromiseKit.Promise<Value> {
        return PromiseKit.Promise(resolvers: { (fulfill, reject) in
            self.andThen({ (v) in
                fulfill(v)
            }).catch({ (err) in
                reject(err)
            })
        })
    }
}
