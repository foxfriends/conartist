//
//  UIView+Customizable.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-19.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

extension UIView {
    @discardableResult
    func customizable() -> Self {
        translatesAutoresizingMaskIntoConstraints = false
        return self
    }
}
