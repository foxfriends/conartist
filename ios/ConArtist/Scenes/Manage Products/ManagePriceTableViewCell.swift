//
//  ManagePriceTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-05.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class ManagePriceTableViewCell: UITableViewCell {
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var quantityLabel: UILabel!
    @IBOutlet weak var priceLabel: UILabel!
}

// MARK: - Setup

extension ManagePriceTableViewCell {
    static let ID = "ManagePriceCell"

    func setup(with price: Price) {
        nameLabel.text = price.product?.name ?? "Any"¡
        nameLabel.textColor = price.productId == nil ? .textPlaceholder : .text
        quantityLabel.text = "{}x"¡ % price.quantity
        priceLabel.text = price.price.toString()
    }
}
