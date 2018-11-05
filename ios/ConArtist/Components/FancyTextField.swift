//
//  FancyTextField.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-14.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxCocoa
import RxSwift

class FancyTextField: UITextField {
    private let disposeBag = DisposeBag()
    private let underlineView = HighlightableView()
    private let titleLabel = UILabel()
    private let formattedLabel = UILabel()

    let isValid = BehaviorRelay(value: true)
    private let isUnderlineHighlighted = BehaviorRelay(value: false)

    var format: ((String) -> String)?

    @IBInspectable var title: String? {
        didSet {
            titleLabel.text = title?.lowercased()
            titleLabel.sizeToFit()
        }
    }

    override var text: String? {
        didSet {
            super.text = text
            titleLabel.alpha = (text?.isEmpty ?? true) ? 0 : 1
            formattedLabel.text = format?(text ?? "") ?? text
            formattedLabel.isHidden = underlineView.isHighlighted || format == nil || isSecureTextEntry
            textColor = formattedLabel.isHidden ? textColor?.withAlphaComponent(1) : textColor?.withAlphaComponent(0)
        }
    }

    override var placeholder: String? {
        didSet {
            attributedPlaceholder = placeholder?.withColor(.textPlaceholder)
        }
    }

    private func onInit() {
        addSubview(underlineView)
        addSubview(titleLabel)
        addSubview(formattedLabel)

        formattedLabel.font = font
        formattedLabel.textColor = textColor
        formattedLabel.textAlignment = textAlignment

        // TODO: should this be done with autolayout instead?
        underlineView.frame = CGRect(x: 10, y: frame.height - 1, width: frame.width - 20, height: 1)
        titleLabel.frame = CGRect(x: 20, y: 0, width: frame.width - 20, height: frame.height)
        titleLabel.alpha = 0
        titleLabel.font = UIFont.systemFont(ofSize: 12).usingFeatures([.smallCaps])
        titleLabel.textColor = .textPlaceholder
        formattedLabel.frame = editingRect(forBounds: bounds.offsetBy(dx: 0, dy: -0.5)) // NOTE: not sure why this has to be -0.5, but it works...
        attributedPlaceholder = placeholder?.withColor(.textPlaceholder)

        rx.text
            .map { $0?.isEmpty ?? true }
            .map { $0 ? 0 : 1 }
            .subscribe(onNext: { [titleLabel] alpha in UIView.animate(withDuration: 0.1) { titleLabel.alpha = alpha } })
            .disposed(by: disposeBag)

        rx.text
            .map { $0 ?? "" }
            .map({ [weak self] text in text.isEmpty ? text : self?.format?(text) ?? text })
            .bind(to: formattedLabel.rx.text)
            .disposed(by: disposeBag)

        Observable
            .combineLatest(
                isValid.asObservable(),
                isUnderlineHighlighted.asObservable(),
                rx.text.map { $0 ?? "" }
            )
            .subscribe(onNext: { [weak self, underlineView, titleLabel, formattedLabel] valid, highlighted, text in
                UIView.animate(withDuration: 0.1) {
                    if valid || text.isEmpty {
                        underlineView.highlightColor = .brand
                        titleLabel.textColor = .textPlaceholder
                    } else {
                        underlineView.highlightColor = .warn
                        titleLabel.textColor = .warn
                    }
                    underlineView.isHighlighted = highlighted || (!valid && !text.isEmpty)
                    formattedLabel.isHidden = underlineView.isHighlighted || self?.format == nil || self?.isSecureTextEntry != false
                    self?.textColor = formattedLabel.isHidden ? self!.textColor?.withAlphaComponent(1) : self!.textColor?.withAlphaComponent(0)
                }
            })
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

    override func clearButtonRect(forBounds bounds: CGRect) -> CGRect {
        return CGRect(x: bounds.width - 40, y: bounds.minY, width: 20, height: bounds.height)
    }

    @discardableResult
    override func becomeFirstResponder() -> Bool {
        let success = super.becomeFirstResponder()
        isUnderlineHighlighted.accept(success)
        return success
    }

    @discardableResult
    override func resignFirstResponder() -> Bool {
        let success = super.resignFirstResponder()
        isUnderlineHighlighted.accept(false)
        return success
    }
}
