//
//  RootNavigationController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit

class RootNavigationController: UITableViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        self.ensureSignedIn()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

}
