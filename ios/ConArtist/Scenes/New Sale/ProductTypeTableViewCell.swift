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
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var quantityLabel: UILabel!
    @IBOutlet weak var quantityView: UIView!

    override var isHighlighted: Bool {
        didSet {
            backgroundColor = isHighlighted ? ConArtist.Color.DividerDark : nil
        }
    }

    func fill(with type: ProductType, selected: [Product]) {
        nameLabel.text = type.name
        let selectedCount = selected.filter { $0.typeId == type.id }.count
        quantityLabel.text = "\(selectedCount)"
        quantityView.isHidden = selectedCount == 0
    }
}
