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
            // TODO: would be nice to make this consistent...
            NSLayoutConstraint(item: navView, attribute: .top, relatedBy: .equal, toItem: self, attribute: .bottom, multiplier: 1, constant: -FakeNavBar.NavBarHeight),
            NSLayoutConstraint(item: navView, attribute: .bottom, relatedBy: .equal, toItem: self, attribute: .bottom, multiplier: 1, constant: 0),
            NSLayoutConstraint(item: navView, attribute: .leading, relatedBy: .equal, toItem: self, attribute: .leading, multiplier: 1, constant: 0),
            NSLayoutConstraint(item: navView, attribute: .trailing, relatedBy: .equal, toItem: self, attribute: .trailing, multiplier: 1, constant: 0),
            leftButton.leadingAnchor.constraint(equalTo: navView.leadingAnchor),
            leftButton.topAnchor.constraint(equalTo: navView.topAnchor),
            leftButton.bottomAnchor.constraint(equalTo: navView.bottomAnchor),
            rightButton.trailingAnchor.constraint(equalTo: navView.trailingAnchor),
            rightButton.topAnchor.constraint(equalTo: navView.topAnchor),
            rightButton.bottomAnchor.constraint(equalTo: navView.bottomAnchor),
            NSLayoutConstraint(item: titleView, attribute: .centerY, relatedBy: .equal, toItem: navView, attribute: .centerY, multiplier: 1, constant: 0),
            NSLayoutConstraint(item: titleView, attribute: .centerX, relatedBy: .equal, toItem: navView, attribute: .centerX, multiplier: 1, constant: 0),
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
        rightButton.isHidden = true
        rightButton.contentEdgeInsets = UIEdgeInsets(top: 0, left: 20, bottom: 0, right: 20)
        titleLabel.font = UIFont.systemFont(ofSize: 15, weight: UIFontWeightSemibold)
        titleLabel.textColor = ConArtist.Color.Text
        titleLabel.textAlignment = .center
        titleLabel.setContentHuggingPriority(UILayoutPriorityDefaultLow, for: .horizontal)
        subtitleLabel.font = UIFont.systemFont(ofSize: 10)
        subtitleLabel.textColor = ConArtist.Color.TextPlaceholder
        subtitleLabel.textAlignment = .center
        subtitleLabel.setContentHuggingPriority(UILayoutPriorityDefaultLow, for: .horizontal)
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
