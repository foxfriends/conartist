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
        static func load(imageId: String) -> Observable<UIImage?> {
            // TODO: ensure this is happening on a background thread?
            return ConArtist.API.Resources
                .observe(query: ImageQuery(imageId: imageId))
                .map { $0.image }
                .map(UIImage.init(base64:))
                .catchErrorJustReturn(nil)
        }
    }
}
