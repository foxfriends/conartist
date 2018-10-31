//
//  ManageProductTypesViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-10-30.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class ManageProductTypesViewController: UIViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var productTypesTableView: UITableView!

    fileprivate let disposeBag = DisposeBag()
}

// MARK: - Lifecycle

extension ManageProductTypesViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupSubscriptions()
        navBar.title = "Manage Products"¡
        navBar.leftButtonTitle = "Back"¡
    }
}

// MARK: - Subscriptions

extension ManageProductTypesViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { [weak self] _ in self?.navigationController?.popViewController(animated: true) })
            .disposed(by: disposeBag)

        ConArtist.model.productTypes
            .subscribe(onNext: { [productTypesTableView] _ in productTypesTableView?.reloadData() })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource

extension ManageProductTypesViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return ConArtist.model.productTypes.value.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ManageProductTypeTableViewCell.ID, for: indexPath) as! ManageProductTypeTableViewCell
        cell.setup(with: ConArtist.model.productTypes.value[indexPath.row])
        return cell
    }
}

// MARK: - UITableViewDelegate

extension ManageProductTypesViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let type = ConArtist.model.productTypes.value[indexPath.row]
        ManageProductsViewController.present(for: type)
    }

    func tableView(_ tableView: UITableView, didHighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = true
    }

    func tableView(_ tableView: UITableView, didUnhighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = false
    }
}

// MARK: - Navigation

extension ManageProductTypesViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .Products
    static let ID = "ManageProductTypes"

    static func present() {
        ConArtist.model.navigate(push: instantiate())
    }
}
