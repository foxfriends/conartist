//
//  RecordsOverviewTotalFooterView.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-09.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class RecordsOverviewTotalFooterView: UIView {
    weak var titleLabel: UILabel!
    weak var amountLabel: UILabel!

    func setup(with total: Money) {
        buildSubviews()

        titleLabel.text = "Total"¡
        amountLabel.text = total.toString()
    }

    private func buildSubviews() {
        guard subviews.isEmpty else { return }
        let titleLabel = UILabel().customizable()
        let amountLabel = UILabel().customizable()
        let lineView = UIView().customizable()
        addSubview(titleLabel)
        addSubview(amountLabel)
        addSubview(lineView)

        titleLabel.setContentHuggingPriority(UILayoutPriorityDefaultHigh, for: .horizontal)
        titleLabel.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 20).isActive = true
        titleLabel.centerYAnchor.constraint(equalTo: centerYAnchor).isActive = true
        titleLabel.trailingAnchor.constraint(equalTo: amountLabel.leadingAnchor, constant: 0).isActive = true
        amountLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -52).isActive = true
        amountLabel.centerYAnchor.constraint(equalTo: centerYAnchor).isActive = true
        lineView.leadingAnchor.constraint(equalTo: leadingAnchor).isActive = true
        lineView.trailingAnchor.constraint(equalTo: trailingAnchor).isActive = true
        lineView.bottomAnchor.constraint(equalTo: bottomAnchor).isActive = true
        lineView.heightAnchor.constraint(equalToConstant: 1).isActive = true
        lineView.backgroundColor = ConArtist.Color.DividerDark

        titleLabel.font = UIFont.systemFont(ofSize: 14, weight: UIFontWeightSemibold)
        titleLabel.textColor = ConArtist.Color.Text
        amountLabel.font = UIFont.systemFont(ofSize: 14, weight: UIFontWeightBold).usingFeatures([.tabularFigures])
        amountLabel.textColor = ConArtist.Color.Text
        amountLabel.textAlignment = .right

        backgroundColor = ConArtist.Color.BackgroundOverlay

        self.titleLabel = titleLabel
        self.amountLabel = amountLabel
    }
}
