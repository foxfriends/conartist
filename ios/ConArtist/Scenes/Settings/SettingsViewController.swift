//
//  SettingsViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-03.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxCocoa
import RxSwift

class SettingsViewController: UIViewController {
    enum Setting {
        case Action(String, () -> Void)
        case Boolean(String, BehaviorRelay<Bool>)
        case Select(String, BehaviorRelay<String>, [String])
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
        navBar.title = "Settings"¡
        navBar.leftButtonTitle = "Back"¡
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
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
        case .Select(let title, let value, _):
            let cell = tableView.dequeueReusableCell(withIdentifier: SettingsSelectTableViewCell.ID, for: indexPath) as! SettingsSelectTableViewCell
            cell.setup(title: title, value: value)
            return cell
        }
    }
}

// MARK: - UITableViewDelegate
extension SettingsViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let item = settings[indexPath.section].items[indexPath.row]
        switch item {
        case .Action(_, let action):
            action()
        case .Select(let title, let value, let options):
            SettingsSelectViewController.show(title: title, value: value, options: options)
        default: break
        }
    }

    func tableView(_ tableView: UITableView, didHighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = true
    }

    func tableView(_ tableView: UITableView, didUnhighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = false
    }

    func tableView(_ tableView: UITableView, willSelectRowAt indexPath: IndexPath) -> IndexPath? {
        let item = settings[indexPath.section].items[indexPath.row]
        switch item {
        case .Action,
             .Select:   return indexPath
        default:        return nil
        }
    }

    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        return self.tableView(tableView, titleForHeaderInSection: section).map { TableHeaderView(title: $0, showBar: false, showMore: false) }
    }
}

// MARK: - Navigation
extension SettingsViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .Settings
    static let ID = "Settings"

    static func show(for settings: [Group]) {
        let controller = instantiate()
        controller.settings = settings
        ConArtist.model.navigate(present: controller)
    }
}
