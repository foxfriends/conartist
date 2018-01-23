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
    private let cachedConventions: Cache<[[Convention]]> = Cache {
        guard let model = ConArtist.model else {
            return [[], [], []]
        }
        return [
            // TODO: this could be more efficient, but this is clean for now
            // [Present, Past, Future] is the order of the sections
            model.cons(during: Date.today()),
            model.cons(before: Date.today()),
            model.cons(after: Date.today())
        ]
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        ensureSignedIn()
    }
    
    // MARK: - Navigation
    
    private func ensureSignedIn() {
        if ConArtist.API.authToken == ConArtist.API.Unauthorized {
            performSegue(withIdentifier: SegueIdentifier.ShowSignIn.rawValue, sender: self)
        } else {
            // TODO: store user data and load that before reaching for the server
            Auth.reauthorize().then(execute: refresh)
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == SegueIdentifier.ShowSignIn.rawValue {
            (segue.destination as? ConArtistViewController)?.setCompletionCallback { _ in self.refresh() }
        }
    }
    
    private enum SegueIdentifier: String {
        case ShowSignIn, ShowConventionDetails
    }

    // MARK: - TableView

    private func refresh() {
        cachedConventions.clear()
        tableView.reloadData()
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        let present = cachedConventions.value[0].count > 0 ? 1 : 0
        let past = cachedConventions.value[1].count > 0 ? 1 : 0
        let future = cachedConventions.value[2].count > 0 ? 1 : 0
        return past + present + future
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        guard
            section < numberOfSections(in: tableView),
            let adjusted = adjustSection(section)
        else { return 0 }
        return cachedConventions.value[adjusted].count
    }
    
    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        guard
            section < numberOfSections(in: tableView),
            let adjusted = adjustSection(section)
        else { return nil }
        return ["Current", "Previous", "Upcoming"][adjusted]
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ConventionListCell", for: indexPath) as! ConventionListRow
        if indexPath.section < numberOfSections(in: tableView) {
            if let adjusted = adjustSection(indexPath.section) {
                let item = cachedConventions.value[adjusted][indexPath.row]
                cell.fill(with: item)
            }
        }
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard
            indexPath.section < numberOfSections(in: tableView),
            let adjusted = adjustSection(indexPath.section)
        else { return }
        ConArtist.model?.focusedConvention = cachedConventions.value[adjusted][indexPath.row]
        performSegue(withIdentifier: SegueIdentifier.ShowConventionDetails.rawValue, sender: self)
    }
    
    func adjustSection(_ section: Int) -> Int? {
        var caught = 0
        for i in 0...3 {
            if cachedConventions.value[i].count > 0 {
                caught += 1
                if caught > section {
                    return i
                }
            }
        }
        return nil
    }
}
