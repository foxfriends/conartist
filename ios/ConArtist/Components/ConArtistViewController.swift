//
//  ConArtistViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-05.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import RxCocoa

struct KeyboardFrame {
    let frame: CGRect?
    let duration: TimeInterval
    let curve: UIView.AnimationCurve
}

class ConArtistViewController : UIViewController {
    let disposeBag = DisposeBag()

    fileprivate let keyboardFrame = BehaviorRelay<KeyboardFrame>(value: KeyboardFrame(frame: .zero, duration: 0.25, curve: .easeInOut))

    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            isModalInPresentation = true // we must not allow pulldown gesture because that messes up my navigation
        }
        startAdjustingForKeyboard()
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
}

// MARK: - Keyboard handling
extension ConArtistViewController {
    fileprivate func startAdjustingForKeyboard() {
        NotificationCenter.default.rx.notification(UIResponder.keyboardWillHideNotification)
            .subscribe(onNext: { [weak self] notification in self?.adjustForKeyboard(notification: notification) })
            .disposed(by: disposeBag)
        NotificationCenter.default.rx.notification(UIResponder.keyboardWillChangeFrameNotification)
            .subscribe(onNext: { [weak self] notification in self?.adjustForKeyboard(notification: notification) })
            .disposed(by: disposeBag)
    }

    private func adjustForKeyboard(notification: Notification) {
        let keyboardScreenEndFrame = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as! NSValue).cgRectValue
        let duration = (notification.userInfo?[UIResponder.keyboardAnimationDurationUserInfoKey] as! NSNumber).doubleValue
        let curve = UIView.AnimationCurve(rawValue: (notification.userInfo?[UIResponder.keyboardAnimationCurveUserInfoKey] as! NSNumber).intValue)!
        let frame = view.convert(keyboardScreenEndFrame, from: view.window)
        if notification.name == UIResponder.keyboardWillHideNotification {
            keyboardFrame.accept(KeyboardFrame(frame: nil, duration: duration, curve: curve))
        } else {
            keyboardFrame.accept(KeyboardFrame(frame: frame, duration: duration, curve: curve))
        }
    }
}

extension Reactive where Base: ConArtistViewController {
    var keyboardFrame: Driver<KeyboardFrame> {
        return base.keyboardFrame.asDriver()
    }
}
