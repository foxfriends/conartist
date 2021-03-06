//
//  Settings.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-01.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

struct Settings: Codable {
    let currency: CurrencyCode
    let language: [String]

    static let `default` = Settings()

    private init() {
        currency = .CAD
        // Take only the first two parts of the locale. We'll never support further differentiation than that anyway.
        language = Locale.preferredLanguages.map { $0.split(separator: "-").prefix(2).joined(separator: "-") }
    }

    private init(currency: CurrencyCode, language: [String]) {
        self.currency = currency
        self.language = language
    }

    init?(graphQL settings: SettingsFragment) {
        currency = CurrencyCode(rawValue: settings.currency) ?? Settings.default.currency
        language = Settings.default.language
    }

    func set(currency: CurrencyCode) -> Settings {
        return Settings(
            currency: currency,
            language: language
        )
    }
}
