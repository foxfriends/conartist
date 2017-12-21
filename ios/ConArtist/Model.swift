//
//  Model.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation

struct Model {
    let name: String
    let email: String
    let conventions: [Convention]
    
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
}
