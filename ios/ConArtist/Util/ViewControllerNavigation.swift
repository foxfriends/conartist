//
//  ViewControllerNavigation.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-06-22.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

enum Storyboard: String {
    case Main
    case SignIn
    case Convention
    case Records
    case Sale
    case Settings
}

protocol ViewControllerNavigation {
    static var Storyboard: Storyboard { get }
    static var ID: String { get }
}

extension ViewControllerNavigation {
    static func instantiate() -> Self {
        return UIStoryboard(name: Storyboard.rawValue, bundle: nil).instantiateViewController(withIdentifier: ID) as! Self
    }
}
