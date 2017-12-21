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
    override func viewDidLoad() {
        super.viewDidLoad()
        self.ensureSignedIn()
    }
    
    // MARK: - Navigation
    
    func ensureSignedIn() {
        if ConArtist.API.AuthToken == ConArtist.API.Unauthorized {
            self.performSegue(withIdentifier: SegueIdentifier.ShowSignIn.rawValue, sender: self)
        } else {
            // TODO: store user data and load that before reaching for the server
            Auth.reauthorize().then(execute: self.setUserAndContinue)
        }
    }
    
    func setUserAndContinue(_ user: UserQuery.Data.User?) {
        ConArtist.Model = Model.from(graphQL: user)
        self.tableView.reloadData()
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        switch segue.identifier ?? "" {
        case SegueIdentifier.ShowSignIn.rawValue:
            (segue.destination as? ConArtistViewController)?
                .setCompletionCallback { self.setUserAndContinue($0 as? UserQuery.Data.User) }
        default: break
        }
    }
    
    private enum SegueIdentifier: String {
        case ShowSignIn
    }

    // MARK: - TableView
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return ConArtist.Model?.conventions.count ?? 0
        /*
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
        */
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ConventionListCell", for: indexPath) as! ConventionListRow
        /*
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
        */
        let item = ConArtist.Model?.conventions[indexPath.item]
        cell.titleLabel?.text = item?.name
        cell.dateLabel?.text = "Test date"
        
        return cell
    }
}

