//
//  SettingsSelectViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-01.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class SettingsSelectViewController: UIViewController {
    let disposeBag = DisposeBag()

    fileprivate var navBarTitle: String?
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var optionsTableView: UITableView!

    fileprivate var value: Variable<String>!
    fileprivate var options: [String]!
}

// MARK: - Lifecycle
extension SettingsSelectViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        navBar.title = navBarTitle

        value
            .asDriver()
            .drive(onNext: { [optionsTableView] _ in optionsTableView?.reloadData() })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .subscribe(onNext: { ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension SettingsSelectViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return options.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: SettingsSelectOptionTableViewCell.ID, for: indexPath) as! SettingsSelectOptionTableViewCell
        cell.setup(title: options[indexPath.row], selected: value.value == options[indexPath.row])
        return cell
    }
}

// MARK: - UITableViewDelegate
extension SettingsSelectViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        value.value = options[indexPath.row]
    }
}

// MARK: - Navigation
extension SettingsSelectViewController: ViewControllerNavigation {
    static let StoryboardName = "Main"
    static let ID = "SettingsSelect"

    static func show(title: String, value: Variable<String>, options: [String]) {
        let controller = instantiate()
        controller.value = value
        controller.options = options
        controller.navBarTitle = title
        ConArtist.model.navigate(present: controller)
    }
}
