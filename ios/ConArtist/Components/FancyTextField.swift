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
    private let formattedLabel = UILabel()

    let isValid = Variable<Bool>(true)
    private let isUnderlineHighlighted = Variable<Bool>(false)

    var format: ((String) -> String)?

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

    override var placeholder: String? {
        didSet {
            attributedPlaceholder = placeholder?.withColor(ConArtist.Color.TextPlaceholder)
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
        titleLabel.textColor = ConArtist.Color.TextPlaceholder
        formattedLabel.frame = editingRect(forBounds: bounds.offsetBy(dx: 0, dy: -0.5)) // NOTE: not sure why this has to be -0.5, but it works...
        attributedPlaceholder = placeholder?.withColor(ConArtist.Color.TextPlaceholder)

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
                        underlineView.highlightColor = ConArtist.Color.Brand
                        titleLabel.textColor = ConArtist.Color.TextPlaceholder
                    } else {
                        underlineView.highlightColor = ConArtist.Color.Warn
                        titleLabel.textColor = ConArtist.Color.Warn
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
        isUnderlineHighlighted.value = success
        return success
    }

    @discardableResult
    override func resignFirstResponder() -> Bool {
        let success = super.resignFirstResponder()
        isUnderlineHighlighted.value = false
        return success
    }
}
