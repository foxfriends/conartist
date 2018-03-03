//
//  Monad.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-24.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import RxSwift

fileprivate struct MonadError: Error {}

protocol Monad {
    /// The type of value produced by this monad
    associatedtype A
    /// The wrapper type for this monad
    associatedtype M

    func bind(_: @escaping (A) -> M) -> M
    static func `return`(_: A) -> Self
    static func fail(_: Error) throws -> Self
}

infix operator >> : BitwiseShiftPrecedence
infix operator >>- : BitwiseShiftPrecedence

extension Monad {
    static func >>(_ this: Self, _ f: @escaping (A) -> M) -> M {
        return this.bind(f)
    }

    static func >>-(_ this: Self, _ f: @escaping () -> M) -> M {
        return this.bind { _ in f() }
    }
}

extension Optional: Monad {
    typealias A = Wrapped
    typealias M = Optional

    func bind(_ f: @escaping (A) -> M) -> M {
        return flatMap(f)
    }

    static func `return`(_ element: A) -> Optional<A> {
        return element
    }

    static func fail(_ error: Error) throws -> Optional {
        return nil
    }
}

extension Array: Monad {
    typealias A = Element
    typealias M = Array

    func bind(_ f: @escaping (A) -> M) -> M {
        return flatMap(f)
    }

    static func `return`(_ element: A) -> Array<A> {
        return [element]
    }

    static func fail(_ error: Error) throws -> Array {
        throw error
    }
}

// If only swift had a real type system where all of this worked out so nicely
extension ObservableType where E: Monad {
    func bindMap(_ f: @escaping (E.A) -> E.M) -> Observable<E.M> {
        return map { $0 >> f }
    }
}

extension ObservableType {
    func bindMap<A, B>(_ f: @escaping (A) -> B?) -> Observable<B?> where E == A? {
        return map { $0.flatMap(f) }
    }

    func flatBindMap<A, B>(_ f: @escaping (A) -> Observable<B?>) -> Observable<B?> where E == A? {
        return flatMap { $0.flatMap(f) ?? Observable.just(nil) }
    }
}
