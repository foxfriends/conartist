//
//  Model.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Foundation
import RxSwift
import RxCocoa

class Model: Codable {
    private enum CodingKeys: String, CodingKey {
        case name
        case email
        case conventions
        case settings
    }

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

        var animatedEntry: Bool {
            switch self {
            case .Appear,
                 .Over:     return false
            default:        return true
            }
        }

        var animatedExit: Bool {
            switch self {
            case .Over:     return false
            default: 	    return true
            }
        }

        static func ==(_ a: Presentation, _ b: Presentation) -> Bool { return a.viewController == b.viewController }
    }

    let name = BehaviorRelay<String?>(value: nil)
    let email = BehaviorRelay<String?>(value: nil)
    let conventions = BehaviorRelay<[Convention]>(value: [])
    let page = BehaviorRelay<[Presentation]>(value: [])
    let settings = BehaviorRelay<Settings>(value: Settings.default)

    /// Merges the retrieved fragment with the existing model, overriding where possible, but keeping references to
    /// original classes in the case of `Convention`s and the `Model` itself
    func merge(graphQL user: UserFragment) {
        name.accept(user.name)
        email.accept(user.email)
        var existingConventions = conventions.value
        for convention in user.conventions {
            if let existing = existingConventions.first(where: { $0.id == convention.fragments.metaConventionFragment.fragments.conventionBasicInfoFragment.id }) {
                existing.merge(convention.fragments.metaConventionFragment)
            } else if let convention = Convention(graphQL: convention.fragments.metaConventionFragment) {
                existingConventions.append(convention)
            }
        }
        conventions.accept(existingConventions.sorted(by: { $0.start > $1.start }))
        settings.accept(Settings(graphQL: user.settings.fragments.settingsFragment) ?? Settings.default)
        ConArtist.Persist.persist()
    }

    init() {}

    // MARK: Decodable
    required init(from decoder: Decoder) throws {
        let json = try decoder.container(keyedBy: CodingKeys.self)
        name.accept(try json.decode(String.self, forKey: .name))
        email.accept(try json.decode(String.self, forKey: .email))
        settings.accept(try json.decode(Settings.self, forKey: .settings))
        conventions.accept(try json.decode([Convention].self, forKey: .conventions))
    }

    // MARK: Encodable
    func encode(to encoder: Encoder) throws {
        var json = encoder.container(keyedBy: CodingKeys.self)
        try json.encode(name.value, forKey: .name)
        try json.encode(email.value, forKey: .email)
        try json.encode(settings.value, forKey: .settings)
        try json.encode(conventions.value, forKey: .conventions)
    }

    func clear() {
        name.accept(nil)
        email.accept(nil)
        settings.accept(Settings.default)
        conventions.accept([])
        ConArtist.Persist.persist()
    }
}

// MARK: - Navigation
extension Model {
    func navigate(replace vc: UIViewController) {
        page.accept(page.value + [.Appear(vc)])
    }

    func navigate(push vc: UIViewController) {
        page.accept(page.value + [.Push(vc)])
    }

    func navigate(present vc: UIViewController) {
        page.accept(page.value + [.Modal(vc)])
    }

    func navigate(show vc: UIViewController) {
        page.accept(page.value + [.Over(vc)])
    }

    func navigate(backTo vc: UIViewController) {
        var newValue = page.value
        while newValue.last.map({ $0.viewController }).map((==) <- vc) == false {
            newValue.removeLast()
        }
        page.accept(newValue)
    }

    func navigate(backTo vcClass: UIViewController.Type) {
        var newValue = page.value
        while newValue.last.map({ type(of: $0.viewController) }).map((==) <- vcClass) == false {
            newValue.removeLast()
        }
        page.accept(newValue)
    }

    func navigate(back pages: Int) {
        page.accept(Array(page.value.dropLast()))
    }
}
