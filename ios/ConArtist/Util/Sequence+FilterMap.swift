//
//  Sequence+FilterMap.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

extension Sequence {
    func filterMap<T>(_ transform: (Element) -> T?) -> [T] {
        return self.map(transform).filter { $0 != nil } as! [T]
    }
}
