//
//  RecordsOverviewDateHeaderView.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-08.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import SVGKit
import RxSwift

class RecordsOverviewDateHeaderView: UIView {
    private var subscription: Disposable?

    private weak var dateLabel: UILabel!
    private weak var expandIcon: SVGKImageView!
    private weak var toggleButton: UIButton!

    deinit {
        subscription?.dispose()
    }

    func setup(for date: Date, expanded: Bool, onTap handler: @escaping () -> Void) {
        buildSubviews()

        dateLabel.text = date.formatted(date: .complete, time: .omitted)
        expandIcon.image = expanded ? .chevronDown : .chevronUp

        subscription?.dispose()
        subscription = toggleButton.rx.tap
            .subscribe(onNext: { _ in handler() })
    }

    private func buildSubviews() {
        guard subviews.isEmpty else { return }
        let dateLabel = UILabel().customizable()
        let expandIcon = SVGKFastImageView(svgkImage: .chevronDown).customizable()
        let toggleButton = UIButton().customizable()
        addSubview(dateLabel)
        addSubview(expandIcon)
        addSubview(toggleButton)

        dateLabel.font = UIFont.systemFont(ofSize: 14).usingFeatures([.smallCaps])
        dateLabel.textColor = .text

        toggleButton.leadingAnchor.constraint(equalTo: leadingAnchor).isActive = true
        toggleButton.bottomAnchor.constraint(equalTo: bottomAnchor).isActive = true
        toggleButton.topAnchor.constraint(equalTo: topAnchor).isActive = true
        toggleButton.trailingAnchor.constraint(equalTo: trailingAnchor).isActive = true
        expandIcon.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 20).isActive = true
        expandIcon.centerYAnchor.constraint(equalTo: centerYAnchor).isActive = true
        dateLabel.leadingAnchor.constraint(equalTo: expandIcon.trailingAnchor, constant: 6).isActive = true
        dateLabel.centerYAnchor.constraint(equalTo: centerYAnchor).isActive = true

        backgroundColor = .backgroundOverlay

        self.dateLabel = dateLabel
        self.expandIcon = expandIcon
        self.toggleButton = toggleButton
    }
}
