//
//  Model.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation

/**
 The `Model` class defines the data model of the entire ConArtist app. At any point, a serialization
 of the model should be able to reproduce (essentially) the same application state.
 
 Externally, the core date of the model appears immutable, and must be updated using the provided
 update functions. This gives the illusion that this works similar to a state store, such as in Flux.
 
 Less 'core' data, such as which items are currently focused, are exposed mutably for the sake of 
 simplicity.
 */
class Model {
    let name: String
    let email: String
    private var _conventions: [Convention]

    // MARK: - Initializers
    
    init?(graphQL maybeUser: UserQuery.Data.User?) {
        guard let user = maybeUser else { return nil }
        self.name = user.name
        self.email = user.email
        self._conventions = user.conventions.map(Convention.from).filter { return $0 != nil } as! [Convention]
        self._focusedConventionRef = Cache {
            self.conventions.filter { $0.id == self._focusedConventionId }.first // TODO: why is there no find? why is first(where:) not working?
        }
    }
    
    // MARK: - Accessors
    
    var conventions: [Convention] {
        get {
            return _conventions
        }
    }
    
    func cons(before date: Date) -> [Convention] {
        return _conventions.filter { $0.end < date }
    }
    func cons(during date: Date) -> [Convention] {
        return _conventions.filter { $0.start <= date && $0.end >= date }
    }
    func cons(after date: Date) -> [Convention] {
        return _conventions.filter { $0.start > date }
    }
    
    // This simulates a "reference" type, with minimal lookups. Storing only the id of the
    // currently focused convention is enough to look up the while convention data at any
    // time. Since the convention may be modified (filled, etc), we must be sure to
    // invalidate any cached copies whenever the original is changed.
    //
    // TODO: linked caches? [see Cache.swift]
    private var _focusedConventionId: Int? = nil
    private var _focusedConventionRef: Cache<Convention?> = Cache { return nil } // NOTE: needs to be set to this so that `self` can be captured in `init?(graphQL:)`
    var focusedConvention: Convention? {
        get { return _focusedConventionRef.value }
        set {
            _focusedConventionId = newValue?.id
            _focusedConventionRef.clear()
        }
    }
    
    var focusedType: ProductType? = nil
    
    // MARK: - Mutators
    
    func update(convention: Convention) {
        guard let index = (_conventions.index { $0.id == convention.id }) else {
            return
        }
        _conventions[index] = convention
        if convention.id == _focusedConventionId {
            _focusedConventionRef.clear()
        }
    }
}
