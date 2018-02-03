//
//  ConventionListViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Strongbox
import Foundation
import RxSwift

class ConventionListViewController: UIViewController {
    fileprivate static let ID = "ConventionList"
    
    @IBOutlet weak var conventionsTableView: UITableView!
    
    fileprivate let øconventions = ConArtist.model.conventions
    fileprivate let disposeBag = DisposeBag()
    
    fileprivate var present: [Convention] = []
    fileprivate var past: [Convention] = []
    fileprivate var future: [Convention] = []
    fileprivate var sectionTitles: [String] = []
}

// MARK: - Lifecycle
extension ConventionListViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        let øpast = øconventions.asObservable().map { cons in cons.filter { $0.end < Date.today() } }
        let øpresent = øconventions.asObservable().map { cons in cons.filter { $0.start <= Date.today() && $0.end >= Date.today() } }
        let øfuture = øconventions.asObservable().map { cons in cons.filter { $0.start > Date.today() } }
        
        øpast.subscribe(onNext: { [weak self] in self?.past = $0 }).disposed(by: disposeBag)
        øfuture.subscribe(onNext: { [weak self] in self?.future = $0 }).disposed(by: disposeBag)
        øpresent.subscribe(onNext: { [weak self] in self?.present = $0 }).disposed(by: disposeBag)
        
        Observable.combineLatest([øpresent, øfuture, øpast])
            .map { $0.map { $0.count > 0 } }
            .map { zip($0, ["Present", "Past", "Future"]) }
            .map { $0.filter { $0.0 } }
            .subscribe(onNext: { [weak self] sections in
                self?.sectionTitles = sections.map { $0.1 }
                self?.conventionsTableView.reloadData()
            })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension ConventionListViewController: UITableViewDataSource {
    // TODO: would be nice if this string was an enum
    fileprivate func conventions(for section: String) -> [Convention] {
        switch section {
        case "Present":
            return present
        case "Past":
            return past
        case "Future":
            return future
        default:
            return []
        }
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return sectionTitles.count
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        guard let section = sectionTitles.nth(section) else { return 0 }
        return conventions(for: section).count
    }
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return sectionTitles.nth(section)
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ConventionTableViewCell.ID, for: indexPath) as! ConventionTableViewCell
        if  let section = sectionTitles.nth(indexPath.section),
            let convention = conventions(for: section).nth(indexPath.row) {
            cell.fill(with: convention)
        }
        return cell
    }
}

// MARK: - UITableViewDelegate
extension ConventionListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard
            let section = sectionTitles.nth(indexPath.section),
            let convention = conventions(for: section).nth(indexPath.row)
        else { return }
        ConArtist.model.page.value.append(.Convention(øconventions.asObservable().map { $0.first { $0.id == convention.id }! }))
    }
}

// MARK: - Navigation
extension ConventionListViewController {
    class func create() -> ConventionListViewController {
        return ConventionListViewController.instantiate(withId: ConventionListViewController.ID)
    }
}
