//
//  SettingsSelectTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-01.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class SettingsSelectTableViewCell: UITableViewCell {
    static let ID = "SettingsSelectCell"

    private var disposeBag = DisposeBag()

    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var valueLabel: UILabel!

    func setup(title: String, value: Variable<String>) {
        disposeBag = DisposeBag()
        titleLabel.text = title

        value.asDriver().drive(valueLabel.rx.text).disposed(by: disposeBag)
    }
}
