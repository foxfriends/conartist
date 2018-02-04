//
//  SettingsBooleanTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-03.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import RxCocoa

class SettingsBooleanTableViewCell: UITableViewCell {
    static let ID = "SettingsBooleanCell"
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var valueSwitch: UISwitch!

    func setup(title: String, value: Variable<Bool>) {
        titleLabel.text = title

        valueSwitch.isOn = value.value
        valueSwitch.rx
            .isOn
            .subscribe(onNext: { on in value.value = on })
    }
}
