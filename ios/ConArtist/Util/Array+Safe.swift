//
//  Array+Safe.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-14.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

extension Array {
    func nth(_ index: Int) -> Element? {
        guard index < self.count else { return nil }
        return self[index]
    }
}
