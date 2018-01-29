//
//  ArrayExtensions.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

extension Array {
    func nth(_ index: Int) -> Element? {
        guard index < self.count else { return nil }
        return self[index]
    }
    
    func filterMap<T>(_ transform: (Element) -> T?) -> [T] {
        return self.map(transform).filter { $0 != nil } as! [T]
    }
}
