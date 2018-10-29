//
//  String+Attributes.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-15.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

extension String {
    func withColor(_ color: UIColor) -> NSAttributedString {
        return NSAttributedString(string: self, attributes: [.foregroundColor: color])
    }
}
