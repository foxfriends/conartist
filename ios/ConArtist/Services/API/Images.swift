//
//  Images.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-24.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import RxSwift
import RxAlamofire
import Alamofire

extension ConArtist.API {
    struct Images {
        static func load(url: URL) -> Observable<UIImage?> {
            return Observable.empty()
        }
    }
}
