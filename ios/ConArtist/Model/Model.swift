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
        case SignIn
        case Conventions
        case Convention(Convention)
        case Products(ProductType, [Product], [Price])
        case Settings([SettingsViewController.Group])
    }
    
    let name = Variable<String?>(nil)
    let email = Variable<String?>(nil)
    let conventions = Variable<[Convention]>([])
    let page = Variable<[Page]>([.SignIn])
    
    func setUser(graphQL user: UserQuery.Data.User?) {
        guard let user = user else { return }
        self.name.value = user.name
        self.email.value = user.email
        self.conventions.value = user.conventions.filterMap(Convention.init)
    }
    
    func goBack(_ pages: Int = 1) -> Void {
        self.page.value.removeLast(pages)
    }
    
    func navigateTo(page: Page) {
        self.page.value.append(page)
    }
}
