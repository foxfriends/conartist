//
//  ConventionListRow.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-21.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit

class ConventionListRow: UITableViewCell {
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var titleLabel: UILabel!
    
    func fill(with item: Convention) {
        titleLabel.text = item.name
        dateLabel.text = item.dateString
    }
}
