//
//  RecordListViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class RecordListViewController: UIViewController {
    fileprivate static let ID = "RecordList"
    @IBOutlet weak var recordsTableView: UITableView!
    @IBOutlet weak var navBar: FakeNavBar!

    fileprivate var convention: Convention!
    fileprivate let ørecords = Variable<[Record]>([])
    fileprivate let øproducts = Variable<[Product]>([])

    fileprivate var after: Date?
    fileprivate var before: Date?

    fileprivate let disposeBag = DisposeBag()

    override func viewDidLoad() {
        super.viewDidLoad()

        convention.records
            .map { [after, before] records in records.filter { record in (after.map { record.time >= $0 } ?? true) && (before.map { record.time <= $0 } ?? true) } }
            .bind(to: ørecords)
            .disposed(by: disposeBag)

        convention.products
            .bind(to: øproducts)
            .disposed(by: disposeBag)

        navBar.leftButton.rx.tap
            .subscribe(onNext: { ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        Observable.merge(øproducts.asObservable().discard(), ørecords.asObservable().discard())
            .asDriver(onErrorJustReturn: ())
            .drive(onNext: { [recordsTableView] in recordsTableView?.reloadData() })
            .disposed(by: disposeBag)

        navBar.title = convention.name
        navBar.subtitle = after?.roundToDay().toString("MMM. d, yyyy"¡)
    }
}

// MARK: - UITableViewDataSource
extension RecordListViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? ørecords.value.count : 0
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: RecordTableViewCell.ID, for: indexPath) as! RecordTableViewCell
        if let record = ørecords.value.nth(indexPath.row) {
            cell.setup(for: record, with: øproducts.value)
        }
        return cell
    }
}

// MARK: - UITableViewDelegate
extension RecordListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        // show record info popup
    }

    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        // delete button
        return UISwipeActionsConfiguration()
    }
}

// MARK: - Navigation
extension RecordListViewController {
    class func show(for convention: Convention, after: Date, before: Date) {
        let controller: RecordListViewController = RecordListViewController.instantiate(withId: RecordListViewController.ID)
        controller.convention = convention
        controller.after = after
        controller.before = before

        ConArtist.model.navigate(push: controller)
    }
}
