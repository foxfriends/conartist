//
//  SettingsSelectViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-01.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxCocoa
import RxSwift

class SettingsSelectViewController: UIViewController {
    let disposeBag = DisposeBag()

    fileprivate var navBarTitle: String?
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var optionsTableView: UITableView!

    fileprivate var madeSelection: ((Int) -> Void)!
    fileprivate var value: BehaviorRelay<Int>!
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
            .subscribe(onNext: { [madeSelection, value] _ in
                ConArtist.model.navigate(back: 1)
                madeSelection!(value!.value)
            })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension SettingsSelectViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, didHighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = true
    }

    func tableView(_ tableView: UITableView, didUnhighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = false
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return options.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: SettingsSelectOptionTableViewCell.ID, for: indexPath) as! SettingsSelectOptionTableViewCell
        cell.setup(title: options[indexPath.row], selected: value.value == indexPath.row)
        return cell
    }
}

// MARK: - UITableViewDelegate
extension SettingsSelectViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        value.accept(indexPath.row)
    }
}

// MARK: - Navigation
extension SettingsSelectViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .settings
    static let ID = "SettingsSelect"

    static func show(
        title: String,
        value: Int,
        options: [String],
        handler: @escaping (Int) -> Void
    ) {
        let controller = instantiate()
        controller.value = BehaviorRelay(value: value)
        controller.options = options
        controller.navBarTitle = title
        controller.madeSelection = handler
        ConArtist.model.navigate(present: controller)
    }
}
