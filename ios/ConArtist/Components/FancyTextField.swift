//
//  FancyTextField.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-14.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

@IBDesignable
class FancyTextField: UITextField {
    private let disposeBag = DisposeBag()
    private let underlineView = HighlightableView()
    private let titleLabel = UILabel()

    @IBInspectable var title: String? {
        didSet {
            titleLabel.text = title?.lowercased()
            titleLabel.sizeToFit()
        }
    }

    override var text: String? {
        didSet {
            titleLabel.alpha = (text?.isEmpty ?? true) ? 0 : 1
        }
    }

    private func onInit() {
        addSubview(underlineView)
        addSubview(titleLabel)

        underlineView.frame = CGRect(x: 10, y: frame.height - 1, width: frame.width - 20, height: 1)
        titleLabel.frame = CGRect(x: 20, y: 0, width: frame.width - 20, height: frame.height)
        titleLabel.alpha = 0
        titleLabel.font = UIFont.systemFont(ofSize: 12).usingFeatures([.smallCaps])
        titleLabel.textColor = ConArtist.Color.TextPlaceholder
        attributedPlaceholder = placeholder?.withColor(ConArtist.Color.TextPlaceholder)

        rx.text
            .map { $0?.isEmpty ?? true }
            .map { $0 ? 0 : 1 }
            .subscribe(onNext: { [titleLabel] alpha in UIView.animate(withDuration: 0.1) { titleLabel.alpha = alpha } })
            .disposed(by: disposeBag)
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        onInit()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        onInit()
    }

    override func textRect(forBounds bounds: CGRect) -> CGRect {
        return bounds.insetBy(dx: 20, dy: 0).offsetBy(dx: 0, dy: 5)
    }

    override func editingRect(forBounds bounds: CGRect) -> CGRect {
        return bounds.insetBy(dx: 20, dy: 0).offsetBy(dx: 0, dy: 5)
    }

    @discardableResult
    override func becomeFirstResponder() -> Bool {
        let success = super.becomeFirstResponder()
        underlineView.isHighlighted = success
        return success
    }

    @discardableResult
    override func resignFirstResponder() -> Bool {
        let success = super.resignFirstResponder()
        underlineView.isHighlighted = false
        return success
    }
}
