//
//  ViewControllerNavigation.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-06-22.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

protocol ViewControllerNavigation {
    static var StoryboardName: String { get }
    static var ID: String { get }
}

extension ViewControllerNavigation {
    static func instantiate() -> Self {
        return UIStoryboard(name: StoryboardName, bundle: nil).instantiateViewController(withIdentifier: ID) as! Self
    }
}
