//
//  FakeNavBar.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-16.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class FakeNavBar: UIView {
    private static let NavBarHeight: CGFloat = 44.0

    private let navView = UIView().customizable()
    private let titleLabel = UILabel().customizable()
    private let subtitleLabel = UILabel().customizable()
    private let titleView = UIView().customizable()
    let leftButton = UIButton().customizable().conArtistStyle()
    let rightButton = UIButton().customizable().conArtistStyle()

    @IBInspectable var title: String? {
        didSet {
            titleLabel.text = title
        }
    }

    @IBInspectable var subtitle: String? {
        didSet {
            subtitleLabel.text = subtitle
        }
    }

    @IBInspectable var leftButtonTitle: String? {
        didSet {
            leftButton.setTitle(leftButtonTitle?.lowercased(), for: .normal)
            leftButton.isHidden = leftButtonTitle == nil
        }
    }

    @IBInspectable var rightButtonTitle: String? {
        didSet {
            rightButton.setTitle(rightButtonTitle?.lowercased(), for: .normal)
            rightButton.isHidden = rightButtonTitle == nil
        }
    }

    private func onInit() {
        addShadow()

        addSubview(navView)
        navView.addSubview(leftButton)
        navView.addSubview(rightButton)
        navView.addSubview(titleView)
        titleView.addSubview(titleLabel)
        titleView.addSubview(subtitleLabel)

        NSLayoutConstraint.activate([
            navView.topAnchor.constraint(equalTo: bottomAnchor, constant: -FakeNavBar.NavBarHeight),
            navView.bottomAnchor.constraint(equalTo: bottomAnchor),
            navView.leadingAnchor.constraint(equalTo: leadingAnchor),
            navView.trailingAnchor.constraint(equalTo: trailingAnchor),
            leftButton.leadingAnchor.constraint(equalTo: navView.leadingAnchor),
            leftButton.topAnchor.constraint(equalTo: navView.topAnchor),
            leftButton.bottomAnchor.constraint(equalTo: navView.bottomAnchor),
            rightButton.trailingAnchor.constraint(equalTo: navView.trailingAnchor),
            rightButton.topAnchor.constraint(equalTo: navView.topAnchor),
            rightButton.bottomAnchor.constraint(equalTo: navView.bottomAnchor),
            titleView.centerYAnchor.constraint(equalTo: navView.centerYAnchor),
            titleView.centerXAnchor.constraint(equalTo: navView.centerXAnchor),
            titleView.leadingAnchor.constraint(equalTo: leftButton.trailingAnchor),
            titleView.trailingAnchor.constraint(equalTo: rightButton.leadingAnchor),
            titleView.centerXAnchor.constraint(equalTo: navView.centerXAnchor),
            titleLabel.leadingAnchor.constraint(equalTo: titleView.leadingAnchor),
            titleLabel.trailingAnchor.constraint(equalTo: titleView.trailingAnchor),
            titleLabel.topAnchor.constraint(equalTo: titleView.topAnchor),
            titleLabel.bottomAnchor.constraint(equalTo: subtitleLabel.topAnchor),
            subtitleLabel.leadingAnchor.constraint(equalTo: titleView.leadingAnchor),
            subtitleLabel.trailingAnchor.constraint(equalTo: titleView.trailingAnchor),
            subtitleLabel.bottomAnchor.constraint(equalTo: titleView.bottomAnchor)
        ])

        leftButton.isHidden = true
        leftButton.contentEdgeInsets = UIEdgeInsets(top: 0, left: 20, bottom: 0, right: 20)
        leftButton.setContentHuggingPriority(.required, for: .horizontal)
        leftButton.setContentCompressionResistancePriority(.required, for: .horizontal)
        rightButton.isHidden = true
        rightButton.contentEdgeInsets = UIEdgeInsets(top: 0, left: 20, bottom: 0, right: 20)
        rightButton.setContentHuggingPriority(.required, for: .horizontal)
        rightButton.setContentCompressionResistancePriority(.required, for: .horizontal)
        titleLabel.font = UIFont.systemFont(ofSize: 15, weight: .semibold)
        titleLabel.textColor = .text
        titleLabel.textAlignment = .center
        titleLabel.setContentHuggingPriority(.defaultLow, for: .horizontal)
        titleLabel.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
        subtitleLabel.font = UIFont.systemFont(ofSize: 10)
        subtitleLabel.textColor = .textPlaceholder
        subtitleLabel.textAlignment = .center
        subtitleLabel.setContentHuggingPriority(.defaultLow, for: .horizontal)
        subtitleLabel.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        onInit()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        onInit()
    }

}
