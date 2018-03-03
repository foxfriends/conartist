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
    enum Presentation: Equatable {
        case Appear(UIViewController)
        case Modal(UIViewController)
        case Push(UIViewController)
        case Over(UIViewController)

        var viewController: UIViewController {
            switch self {
            case .Appear(let vc),
                 .Modal(let vc),
                 .Push(let vc),
                 .Over(let vc):
                return vc
            }
        }

        var animated: Bool {
            switch self {
            case .Appear:   return false
            default:        return true
            }
        }

        static func ==(_ a: Presentation, _ b: Presentation) -> Bool { return a.viewController == b.viewController }
    }

    let name = Variable<String?>(nil)
    let email = Variable<String?>(nil)
    let conventions = Variable<[Convention]>([])
    let page = Variable<[Presentation]>([])
    let settings = Variable<Settings>(Settings.default)

    func setUser(graphQL user: UserQuery.Data.User?) {
        guard let user = user else { return }
        name.value = user.name
        email.value = user.email
        conventions.value = user.conventions.filterMap(Convention.init)
        settings.value = Settings(graphQL: user.settings) ?? Settings.default
    }

    func navigate(replace vc: UIViewController) {
        page.value.append(.Appear(vc))
    }

    func navigate(push vc: UIViewController) {
        page.value.append(.Push(vc))
    }

    func navigate(present vc: UIViewController) {
        page.value.append(.Modal(vc))
    }

    func navigate(show vc: UIViewController) {
        page.value.append(.Over(vc))
    }

    func navigate(backTo vc: UIViewController) {
        var newValue = page.value
        while newValue.last.map({ $0.viewController }).map((==) <- vc) == false {
            newValue.removeLast()
        }
        page.value = newValue
    }

    func navigate(backTo vcClass: UIViewController.Type) {
        var newValue = page.value
        while newValue.last.map({ type(of: $0.viewController) }).map((==) <- vcClass) == false {
            newValue.removeLast()
        }
        page.value = newValue
    }

    func navigate(back pages: Int) {
        page.value.removeLast(pages)
    }
}
