//
//  UIViewController+Instantiate.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

extension UIViewController {
    class func instantiate<T: UIViewController>(withId id: String) -> T {
        return UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: id) as! T
    }
}
