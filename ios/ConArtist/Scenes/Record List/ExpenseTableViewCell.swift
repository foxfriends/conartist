//
//  ExpenseTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-08.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class ExpenseTableViewCell: UITableViewCell {
    static let ID = "ExpenseCell"

    @IBOutlet weak var categoryLabel: UILabel!
    @IBOutlet weak var amountLabel: UILabel!

    func setup(for expense: Expense) {
        categoryLabel.text = expense.category
        amountLabel.text = expense.price.toString()
        amountLabel.font = amountLabel.font.usingFeatures([.tabularFigures])
    }
}
