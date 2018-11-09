//
//  ConventionDetailsViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class ConventionDetailsViewController  : ConArtistViewController {
    fileprivate let disposeBag = DisposeBag()

    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var infoTableView: UITableView!
    @IBOutlet weak var newSaleButton: UIButton!
    @IBOutlet weak var newExpenseButton: UIButton!

    var convention: Convention!

    fileprivate let refreshControl = UIRefreshControl()
}

// MARK: - Lifecycle
extension ConventionDetailsViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupLocalization()
        setupSubscriptions()
        setupRefreshControl()
    }

    private func setupRefreshControl() {
        infoTableView.refreshControl = refreshControl
        refreshControl.rx.controlEvent([.valueChanged])
            .flatMapLatest { [convention] _ in convention!.fill(true) }
            .subscribe(onNext: { [refreshControl] in refreshControl.endRefreshing() })
            .disposed(by: disposeBag)
    }
}

// MARK: - UI
extension ConventionDetailsViewController {
    fileprivate func setupUI() {
        navBar.title = convention.name
    }
}

// MARK: - Localization
extension ConventionDetailsViewController {
    fileprivate func setupLocalization() {
        navBar.leftButtonTitle = "Back"¡
        newSaleButton.setTitle("New sale"¡, for: .normal)
        newExpenseButton.setTitle("New expense"¡, for: .normal)
    }
}

// MARK: - Subscriptions
extension ConventionDetailsViewController {
    fileprivate func setupSubscriptions() {
        let _ = convention.fill().subscribe()

        if convention.isEnded {
            newSaleButton.isHidden = true
            newExpenseButton.isHidden = true
            infoTableView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
        } else {
            infoTableView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: 90, right: 0)
        }
        if !convention.isStarted {
            newSaleButton.isHidden = true
        }

        navBar.leftButton.rx.tap
            .subscribe(onNext: { ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        newSaleButton.rx.tap
            .flatMap { [convention] _ in ProductTypeListViewController.show(for: convention!) }
            .map { products, price, info in Record(products: products.map { $0.id }, price: price, info: info) }
            .flatMap { [convention] in
                convention!
                    .addRecord($0)
                    .catchErrorJustReturn(())
            }
            .subscribe()
            .disposed(by: disposeBag)

        newExpenseButton.rx.tap
            .flatMap { _ in NewExpenseViewController.show() }
            .map(Expense.init)
            .flatMap { [convention] in
                convention!
                    .addExpense($0)
                    .catchErrorJustReturn(())
            }
            .subscribe()
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension ConventionDetailsViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 2
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? convention.extraInfo.count : 1
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        switch indexPath.section {
        case 0:
            let item = convention.extraInfo[indexPath.row]
            let cell = tableView.dequeueReusableCell(withIdentifier: item.cellIdentifier, for: indexPath) as! ConventionExtraInfoTableViewCell
            cell.setup(with: item)
            return cell
        case 1:
            let cell = tableView.dequeueReusableCell(withIdentifier: OtherConventionInfoTableViewCell.ID, for: indexPath) as! OtherConventionInfoTableViewCell
            cell.setup(with: convention)
            return cell
        default:
            fatalError("Unreachable case")
        }
    }
}

//MARK: - UITableViewDelegate
extension ConventionDetailsViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        convention.extraInfo.nth(indexPath.row)?.performAction()
    }

    func tableView(_ tableView: UITableView, didHighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = true
    }

    func tableView(_ tableView: UITableView, didUnhighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = false
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return UITableView.automaticDimension
    }
}

// MARK: - Navigation
extension ConventionDetailsViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .convention
    static let ID = "ConventionDetails"

    static func show(for convention: Convention) {
        let controller = instantiate()
        controller.convention = convention
        ConArtist.model.navigate(push: controller)
    }
}
