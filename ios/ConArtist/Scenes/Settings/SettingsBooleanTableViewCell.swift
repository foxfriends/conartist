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
    
    private var disposeBag = DisposeBag()
    
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var valueSwitch: UISwitch!

    func setup(title: String, value: BehaviorRelay<Bool>) {
        disposeBag = DisposeBag()
        titleLabel.text = title

        valueSwitch.isOn = value.value
        valueSwitch.rx.isOn
            .bind(to: value)
            .disposed(by: disposeBag)
    }
}
