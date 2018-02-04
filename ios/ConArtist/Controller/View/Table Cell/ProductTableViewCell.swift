//
//  ProductTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-03.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class ProductTableViewCell: UITableViewCell {
    static let ID = "ProductCell"
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var quantityLabel: UILabel!
    func setup(with product: Product) {
        nameLabel.text = product.name
        quantityLabel.text = "\(product.quantity)"
    }
}
