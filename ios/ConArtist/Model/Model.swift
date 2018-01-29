//
//  Model.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation
import RxSwift

class Model {
    enum Page {
        case Start
        case SignIn
        case Conventions
        case Convention(Observable<Convention>)
        case Products(ProductType)
    }
    
    let name = Variable<String?>(nil)
    let email = Variable<String?>(nil)
    let conventions = Variable<[Convention]>([])
    let page = Variable<Page>(.Start)
    
    func setUser(graphQL user: UserQuery.Data.User?) {
        guard let user = user else { return }
        self.name.value = user.name
        self.email.value = user.email
        self.conventions.value = user.conventions.filterMap(Convention.init)
    }
}
