//
//  ConventionListController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Strongbox
import Foundation

class ConventionListController: UITableViewController {
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 3
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0:
            return ConArtist.Model?.cons(before: Date.today()).count ?? 0
        case 1:
            return ConArtist.Model?.cons(during: Date.today()).count ?? 0
        case 2:
            return ConArtist.Model?.cons(after: Date.today()).count ?? 0
        default:
            return 0
        }
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ConventionListCell", for: indexPath) as! ConventionListRow
        
        var item: Convention? = nil
        switch indexPath.section {
        case 0:
            item = ConArtist.Model?.cons(before: Date.today())[indexPath.item]
        case 1:
            item = ConArtist.Model?.cons(during: Date.today())[indexPath.item]
        case 2:
            item = ConArtist.Model?.cons(after: Date.today())[indexPath.item]
        default:
            break
        }
        
        cell.conTitle?.text = item?.name
        cell.conDate?.text = "Test date"
        
        return cell
    }
}

