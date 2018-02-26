//
//  UIImage+Base64.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-25.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation
import UIKit

extension UIImage {
    convenience init?(base64: String) {
        guard let data = Data(base64Encoded: base64, options: .ignoreUnknownCharacters) else { return nil }
        self.init(data: data)
    }

    var base64: String? {
        let data = UIImagePNGRepresentation(self)
        return data?.base64EncodedString()
    }
}
