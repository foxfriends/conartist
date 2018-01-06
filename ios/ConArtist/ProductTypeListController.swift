//
//  ProductTypeListController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit

class ProductTypeListController: UITableViewController {
    // NOTE: product types are cached here, and do not respond to updates in the model (beyond the initial fill from `viewDidLoad`
    //       this should not be a problem because the product types should not change from within the app, and server updates aren't
    //       fetched until the app reloads anyway (for now)
    private let productTypes: Cache<[ProductType]> = Cache { ConArtist.model?.focusedConvention?.productTypes ?? [] }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // TODO: display loading indicator
        ConArtist.model?.focusedConvention?.fill().then { _ in
            self.refresh()
            // TODO: hide loading indicator
        }
    }
    
    // MARK: - TableView
    
    private func refresh() {
        productTypes.clear()
        tableView.reloadData()
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? productTypes.value.count : 0
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ProductTypeCell", for: indexPath) as! ProductTypeListRow
        if indexPath.row < productTypes.value.count {
            let item = productTypes.value[indexPath.row]
            cell.typeSymbolLabel.text = String(item.name.first ?? "?")
            cell.typeSymbolLabel.backgroundColor = UIColor.from(hex: item.color)
            cell.nameLabel.text = item.name
            cell.priceLabel.text = "$2.00"
        }
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        // TODO:
        // -   Set focused product type
        // -   Navigate to product page
    }
}
