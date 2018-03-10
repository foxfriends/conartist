//
//  TableHeaderView.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-21.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class TableHeaderView: UIView {
    let titleLabel = UILabel().customizable()
    let hbar = HighlightableView().customizable()
    let seeAllButton = UIButton().customizable().conArtistStyle()

    init(title: String, showBar: Bool, showMore: Bool) {
        super.init(frame: CGRect.zero)
        doInit(title: title, showBar: showBar, showMore: showMore)
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        doInit(title: "", showBar: true, showMore: false)
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        doInit(title: "", showBar: true, showMore: false)
    }

    private func doInit(title: String, showBar: Bool, showMore: Bool) {
        addSubview(titleLabel)

        titleLabel.text = title
        titleLabel.font = UIFont.systemFont(ofSize: 12).usingFeatures([.smallCaps])
        titleLabel.textColor = ConArtist.Color.TextPlaceholder

        NSLayoutConstraint.activate([
            NSLayoutConstraint(item: titleLabel, attribute: .leading, relatedBy: .equal, toItem: self, attribute: .leading, multiplier: 1, constant: 20),
            NSLayoutConstraint(item: self, attribute: .centerY, relatedBy: .equal, toItem: titleLabel, attribute: .centerY, multiplier: 1, constant: 0)
        ])

        if showMore {
            addSubview(seeAllButton)
            NSLayoutConstraint.activate([
                NSLayoutConstraint(item: seeAllButton, attribute: .trailing, relatedBy: .equal, toItem: self, attribute: .trailing, multiplier: 1, constant: 20),
                NSLayoutConstraint(item: self, attribute: .centerY, relatedBy: .equal, toItem: seeAllButton, attribute: .centerY, multiplier: 1, constant: 0)
            ])
        }

        if showBar {
            addSubview(hbar)
            NSLayoutConstraint.activate([
                NSLayoutConstraint(item: hbar, attribute: .leading, relatedBy: .equal, toItem: titleLabel, attribute: .trailing, multiplier: 1, constant: 10),
                NSLayoutConstraint(item: hbar, attribute: .height, relatedBy: .equal, toItem: nil, attribute: .notAnAttribute, multiplier: 1, constant: 1),
                NSLayoutConstraint(item: self, attribute: .centerY, relatedBy: .equal, toItem: hbar, attribute: .centerY, multiplier: 1, constant: 0)
            ])

            if showMore {
                NSLayoutConstraint.activate([NSLayoutConstraint(item: seeAllButton, attribute: .leading, relatedBy: .equal, toItem: hbar, attribute: .trailing, multiplier: 1, constant: 10)])
            } else {
                NSLayoutConstraint.activate([NSLayoutConstraint(item: self, attribute: .trailing, relatedBy: .equal, toItem: hbar, attribute: .trailing, multiplier: 1, constant: 20)])
            }
        }
    }
}
