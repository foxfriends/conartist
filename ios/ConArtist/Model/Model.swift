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

    let products = BehaviorRelay<[Product]>(value: [])
    let productTypes = BehaviorRelay<[ProductType]>(value: [])
    let prices = BehaviorRelay<[Price]>(value: [])

    let name = BehaviorRelay<String?>(value: nil)
    let email = BehaviorRelay<String?>(value: nil)
    let conventions = BehaviorRelay<[Convention]>(value: [])
    let page = BehaviorRelay<[Presentation]>(value: [])
    let settings = BehaviorRelay<Settings>(value: Settings.default)

    let suggestions = BehaviorRelay<Connection<Suggestion>>(value: .empty)

    /// Merges the retrieved fragment with the existing model, overriding where possible, but keeping references to
    /// original classes in the case of `Convention`s and the `Model` itself
    func merge(graphQL user: FullUserFragment) {
        products.accept(user.products.compactMap { Product(graphQL: $0.fragments.productFragment) })
        productTypes.accept(user.productTypes.compactMap { ProductType(graphQL: $0.fragments.productTypeFragment) })
        prices.accept(user.prices.compactMap { Price(graphQL: $0.fragments.priceFragment) })
        let basic = user.fragments.userFragment
        name.accept(basic.name)
        email.accept(basic.email)
        var existingConventions = conventions.value
        for convention in basic.conventions {
            if let existing = existingConventions.first(where: { $0.id == convention.fragments.metaConventionFragment.fragments.conventionBasicInfoFragment.id }) {
                existing.merge(convention.fragments.metaConventionFragment)
            } else if let convention = Convention(graphQL: convention.fragments.metaConventionFragment) {
                existingConventions.append(convention)
            }
        }
        conventions.accept(existingConventions.sorted(by: { $0.start > $1.start }))
        settings.accept(Settings(graphQL: basic.settings.fragments.settingsFragment) ?? Settings.default)
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

// MARK: - Updates
extension Model {
    func update(productType: ProductType) {
        var types = productTypes.value
        if let index = types.firstIndex(where: { $0.id == productType.id }) {
            types[index] = productType
        } else {
            types.append(productType)
        }
        productTypes.accept(types)
    }

    func update(product: Product) {
        var prods = products.value
        if let index = prods.firstIndex(where: { $0.id == product.id }) {
            prods[index] = product
        } else {
            prods.append(product)
        }
        products.accept(prods)
    }

    func update(price: Price) {
        var prices = self.prices.value
        if let index = prices.firstIndex(where: { $0.id == price.id }) {
            prices[index] = price
        } else {
            prices.append(price)
        }
        self.prices.accept(prices)
    }
}

// MARK: - Suggestions
extension Model {
    func loadSuggestions(fresh: Bool = false) -> Observable<Connection<Suggestion>> {
        if !fresh && suggestions.value.isFull { return Single.just(suggestions.value).asObservable() }
        return ConArtist.API.GraphQL
            .observe(query: SuggestionsConnectionQuery(search: nil, limit: nil, before: nil, after: fresh ? nil : suggestions.value.endCursor))
            .map { $0.suggestionsConnection }
            .filterMap(Connection<Suggestion>.init(graphQL:))
            .map { [suggestions] new in fresh ? new : suggestions.value.extend(new) }
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
