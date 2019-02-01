//
//  CustomToastView.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2019-01-31.
//  Copyright © 2019 Cameron Eldridge. All rights reserved.
//

import UIKit

class CustomToastView: UIView {
    init(title: String? = nil, message: String? = nil) {
        super.init(frame: .zero)

        let leftBar = UIView().customizable()
        let contentView = UIView().customizable()
        addSubview(leftBar)
        addSubview(contentView)

        backgroundColor = .backgroundVariant
        leftBar.backgroundColor = .brand

        let titleContainer = UIView().customizable()
        let messageContainer = UIView().customizable()
        contentView.addSubview(titleContainer)
        contentView.addSubview(messageContainer)

        NSLayoutConstraint.activate([
            leftBar.widthAnchor.constraint(equalToConstant: 4),
            leftBar.leadingAnchor.constraint(equalTo: leadingAnchor),
            leftBar.topAnchor.constraint(equalTo: topAnchor),
            leftBar.bottomAnchor.constraint(equalTo: bottomAnchor),
            contentView.leadingAnchor.constraint(equalTo: leftBar.trailingAnchor, constant: 20),
            contentView.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -20),
            contentView.topAnchor.constraint(equalTo: topAnchor, constant: 10),
            contentView.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -10),
            titleContainer.topAnchor.constraint(equalTo: contentView.topAnchor),
            titleContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            titleContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            titleContainer.bottomAnchor.constraint(equalTo: messageContainer.topAnchor, constant: -2),
            messageContainer.bottomAnchor.constraint(equalTo: contentView.bottomAnchor),
            messageContainer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            messageContainer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
        ])

        var width: CGFloat = 0
        var height: CGFloat = 0

        if let title = title {
            let titleLabel = UILabel().customizable()
            titleLabel.text = title
            titleLabel.font = UIFont.systemFont(ofSize: 15, weight: .semibold)
            titleLabel.textColor = .text
            titleLabel.numberOfLines = 0
            titleLabel.setContentCompressionResistancePriority(.required, for: .horizontal)
            titleLabel.setContentCompressionResistancePriority(.required, for: .vertical)
            titleContainer.addSubview(titleLabel)

            let size = titleLabel.sizeThatFits(CGSize(width: 291, height: 40))
            titleLabel.frame.size = size
            width = max(width, size.width)
            height += size.height

            NSLayoutConstraint.activate([
                titleLabel.topAnchor.constraint(equalTo: titleContainer.topAnchor),
                titleLabel.bottomAnchor.constraint(equalTo: titleContainer.bottomAnchor),
                titleLabel.leadingAnchor.constraint(equalTo: titleContainer.leadingAnchor),
                titleLabel.trailingAnchor.constraint(equalTo: titleContainer.trailingAnchor),
            ])
        }

        if let message = message {
            let messageLabel = UILabel().customizable()
            messageLabel.text = message
            messageLabel.font = UIFont.systemFont(ofSize: 14)
            messageLabel.textColor = .text
            messageLabel.numberOfLines = 0
            messageLabel.setContentCompressionResistancePriority(.required, for: .horizontal)
            messageLabel.setContentCompressionResistancePriority(.required, for: .vertical)
            messageContainer.addSubview(messageLabel)

            let size = messageLabel.sizeThatFits(CGSize(width: 291, height: 100))
            messageLabel.frame.size = size
            width = max(width, size.width)
            height += size.height

            NSLayoutConstraint.activate([
                messageLabel.topAnchor.constraint(equalTo: messageContainer.topAnchor),
                messageLabel.bottomAnchor.constraint(equalTo: messageContainer.bottomAnchor),
                messageLabel.leadingAnchor.constraint(equalTo: messageContainer.leadingAnchor),
                messageLabel.trailingAnchor.constraint(equalTo: messageContainer.trailingAnchor),
            ])
        }

        frame = CGRect(x: 0, y: 0, width: 291, height: height + 20)
        addShadow(radius: 4, opacity: 0.5)
    }

    required init?(coder: NSCoder) {
        fatalError("Not available")
    }
}
