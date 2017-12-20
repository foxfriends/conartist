//
//  Pagination.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

struct Pagination<T> {
    let pages: Int
    let index: Int
    let data: [T]
}
