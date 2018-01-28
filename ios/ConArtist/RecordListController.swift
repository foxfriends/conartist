//
//  RecordListController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit

class RecordListController: UITableViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // TODO: display loading indicator
        ConArtist.model?.focusedConvention?.fill().then { _ in
            self.refresh()
            // TODO: hide loading indicator
        }
    }
    
    // MARK: - TableView
    
    private var records = {
        get {
            return ConArtist.model?.focusedConvention?.records ?? []
        }
    }
    
    private func refresh() {
        tableView.reloadData()
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? records.value.count : 0
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "RecordListCell", for: indexPath) as! RecordListRow
        if indexPath.row < records.value.count {
            let item = records.value[indexPath.row]
            cell.fill(with: item)
        }
        return cell
    }
}
