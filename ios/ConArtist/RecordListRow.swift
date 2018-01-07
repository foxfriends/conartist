//
//  RecordListRow.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-06.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class RecordListRow: UITableViewCell {
    @IBOutlet weak var typeSymbolLabel: UILabel!
    @IBOutlet weak var productsListLabel: UILabel!
    @IBOutlet weak var priceLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    
    func fill(with item: Record) {
        let typeId = item.products.first ?? ConArtist.NoID // having no product should be impossible, but defaulting this can't hurt
        let type = ConArtist.model?.focusedConvention?.productType(for: ConArtist.model?.focusedConvention?.product(for: typeId)?.typeId ?? ConArtist.NoID)
        typeSymbolLabel.text = String(type?.name.first ?? "?")
        typeSymbolLabel.backgroundColor = UIColor.from(hex: type?.color ?? 0xFFFFFF)
        productsListLabel.text = item.products
            .reduce([:]) { (prev: [Int: Int], next) in
                // count up the products of each name
                var result = prev
                result[next] = (prev[next] ?? 0) + 1
                return result
            }.reduce("") { prev, pair in
                // turn the counts into a string
                let (productId, quantity) = pair
                guard let product = ConArtist.model?.focusedConvention?.product(for: productId) else {
                    // can just ignore invalid products since they shouldn't happen anyway
                    return prev
                }
                let result = "\(product.name)\(quantity > 1 ? "( \(quantity))" : "")"
                if prev == "" || prev == nil {
                    return result
                } else {
                    return "\(prev!), \(result)"
                }
        }
        priceLabel.text = item.price
        timeLabel.text = item.time.toString("E h:mm")
    }
}
