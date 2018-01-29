//
//  ConventionListTableViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Strongbox
import Foundation
import RxSwift

class ConventionListTableViewController: UITableViewController {
    fileprivate static let ID = "ConventionList"
    
    fileprivate let øconventions = ConArtist.model.conventions
    
    fileprivate let disposeBag = DisposeBag()
    
    private var _present: [Convention] = []
    private var _past: [Convention] = []
    private var _future: [Convention] = []
    fileprivate var _sectionTitles: [String] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let øpast = øconventions.asObservable().map { cons in cons.filter { $0.end < Date.today() } }
        let øpresent = øconventions.asObservable().map { cons in cons.filter { $0.start <= Date.today() && $0.end >= Date.today() } }
        let øfuture = øconventions.asObservable().map { cons in cons.filter { $0.start > Date.today() } }
        
        øpast.subscribe(onNext: { [weak self] in self?._past = $0 }).disposed(by: disposeBag)
        øfuture.subscribe(onNext: { [weak self] in self?._future = $0 }).disposed(by: disposeBag)
        øpresent.subscribe(onNext: { [weak self] in self?._present = $0 }).disposed(by: disposeBag)
        
        Observable.combineLatest([øpresent, øfuture, øpast])
            .map { $0.map { $0.count > 0 } }
            .map { zip($0, ["Present", "Past", "Future"]) }
            .map { $0.filter { $0.0 } }
            .subscribe(onNext: { [weak self] sections in
                self?._sectionTitles = sections.map { $0.1 }
                self?.tableView.reloadData()
            })
            .disposed(by: disposeBag)
    }
    
    fileprivate func conventions(for section: String) -> [Convention] {
        switch section {
        case "Present":
            return _present
        case "Past":
            return _past
        case "Future":
            return _future
        default:
            return []
        }
    }
}

// MARK: - TableView
extension ConventionListTableViewController {
    override func numberOfSections(in tableView: UITableView) -> Int {
        return _sectionTitles.count
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        guard let section = _sectionTitles.nth(section) else { return 0 }
        return conventions(for: section).count
    }
    
    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return _sectionTitles.nth(section)
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ConventionTableViewCell.ID, for: indexPath) as! ConventionTableViewCell
        if  let section = _sectionTitles.nth(indexPath.section),
            let convention = conventions(for: section).nth(indexPath.row) {
            cell.fill(with: convention)
        }
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard
            let section = _sectionTitles.nth(indexPath.section),
            let convention = conventions(for: section).nth(indexPath.row)
        else { return }
        ConArtist.model.page.value = .Convention(øconventions.asObservable().map { $0.first { $0.id == convention.id }! })
    }
}

// MARK: - Navigation
extension ConventionListTableViewController {
    private class func create() -> ConventionListTableViewController {
        return ConventionListTableViewController.instantiate(withId: ConventionListTableViewController.ID) as! ConventionListTableViewController
    }
    
    class func push(to navigator: UINavigationController) {
        let controller = ConventionListTableViewController.create()
        navigator.pushViewController(controller, animated: true)
    }
    
    class func present(from navigator: UIViewController) {
        let controller = ConventionListTableViewController.create()
        navigator.present(controller, animated: true)
    }
}
