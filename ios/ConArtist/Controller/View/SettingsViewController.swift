//
//  SettingsViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-03.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class SettingsViewController: UIViewController {
    static let ID = "Settings"
    
    enum Setting {
        case Action(String, () -> Void)
        case Boolean(String, Variable<Bool>)
    }
    
    struct Group {
        let title: String?
        let items: [Setting]
    }
    
    fileprivate let disposeBag = DisposeBag()
    
    @IBOutlet weak var settingsTableView: UITableView!
    @IBOutlet weak var navBar: FakeNavBar!

    fileprivate var settings: [Group] = []
}

// MARK: - Lifecycle
extension SettingsViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.goBack() })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension SettingsViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return settings.count
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return settings[section].items.count
    }
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return settings[section].title
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let item = settings[indexPath.section].items[indexPath.row]
        switch item {
        case .Action(let title, _):
            let cell = tableView.dequeueReusableCell(withIdentifier: SettingsActionTableViewCell.ID, for: indexPath) as! SettingsActionTableViewCell
            cell.setup(title: title)
            return cell
        case .Boolean(let title, let value):
            let cell = tableView.dequeueReusableCell(withIdentifier: SettingsBooleanTableViewCell.ID, for: indexPath) as! SettingsBooleanTableViewCell
            cell.setup(title: title, value: value)
            return cell
        }
    }
}

// MARK: - UITableViewDelegate
extension SettingsViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let item = settings[indexPath.section].items[indexPath.row]
        if case .Action(_, let action) = item {
            action()
        }
    }
    
    func tableView(_ tableView: UITableView, willSelectRowAt indexPath: IndexPath) -> IndexPath? {
        let item = settings[indexPath.section].items[indexPath.row]
        if case .Action = item {
            return indexPath
        }
        return nil
    }
}

// MARK: - Navigation
extension SettingsViewController {
    class func create(for settings: [Group]) -> SettingsViewController {
        let controller: SettingsViewController = SettingsViewController.instantiate(withId: SettingsViewController.ID)
        controller.settings = settings
        return controller
    }
}
