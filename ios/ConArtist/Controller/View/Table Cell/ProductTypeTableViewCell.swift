//
//  ProductTypeTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-24.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit

class ProductTypeTableViewCell: UITableViewCell {
    static let ID = "ProductTypeCell"
    @IBOutlet weak var typeSymbolLabel: UILabel!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var priceLabel: UILabel!
    
    func fill(with item: ProductType) {
        typeSymbolLabel.text = String(item.name.first ?? "?")
        typeSymbolLabel.backgroundColor = UIColor.from(hex: item.color)
        nameLabel.text = item.name
        priceLabel.text = "$2.00"
    }
}
