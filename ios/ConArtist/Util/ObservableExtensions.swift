//
//  ObservableExtensions.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-04.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import RxSwift

extension ObservableType {
    func filterMap<T>(_ transform: @escaping (Self.E) -> T?) -> Observable<T> {
        return map(transform).filter { $0 != nil }.map { $0! }
    }
    
    func execute(_ f: @escaping (Self.E) -> Void) -> Observable<Self.E> {
        return map({ f($0); return $0 })
    }
}
