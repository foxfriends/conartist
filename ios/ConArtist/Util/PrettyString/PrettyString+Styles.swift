//
//  PrettyString+Styles.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-06-24.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import PrettyString

extension PrettyString.Config {
    static let regular: PrettyString.Config = PrettyString.Config(
        base: [],
        rules: [
            PrettyString.Config.Rule(
                name: "action",
                attributes: [
                    .foregroundColor(.brand),
                ]
            )
        ]
    )

    static let highlighted: PrettyString.Config = PrettyString.Config(
        base: [],
        rules: [
            PrettyString.Config.Rule(
                name: "action",
                attributes: [
                    .foregroundColor(.brandVariant),
                ]
            )
        ]
    )
}
