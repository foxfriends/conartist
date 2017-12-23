//
//  Model.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation
import PromiseKit

struct Model {
    let name: String
    let email: String
    var conventions: [Convention]

    
    static func from(graphQL maybeUser: UserQuery.Data.User?) -> Model? {
        guard let user = maybeUser else { return nil }
        return Model (
            name: user.name,
            email: user.email,
            conventions: user.conventions.map(Convention.from).filter { return $0 != nil } as! [Convention]
        )
    }
    
    func cons(before date: Date) -> [Convention] {
        return conventions.filter { $0.end < date }
    }
    func cons(during date: Date) -> [Convention] {
        return conventions.filter { $0.start <= date && $0.end >= date }
    }
    func cons(after date: Date) -> [Convention] {
        return conventions.filter { $0.start > date }
    }
    
    mutating func update(convention con: Convention) {
        guard let index = (self.conventions.index { $0.id == con.id }) else {
            return
        }
        self.conventions[index] = con
    }
}
