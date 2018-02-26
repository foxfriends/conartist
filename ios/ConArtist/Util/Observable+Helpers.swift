//
//  Observable+Helpers.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-04.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import RxSwift

extension ObservableType {
    /// Transforms the elements of the observable, stripping out any nil values
    func filterMap<T>(_ transform: @escaping (Self.E) -> T?) -> Observable<T> {
        return map(transform).filter { $0 != nil }.map { $0! }
    }

    /// Discards the value of this observable, instead returning the empty tuple
    func discard() -> Observable<()> {
        return map(const(()))
    }
}
