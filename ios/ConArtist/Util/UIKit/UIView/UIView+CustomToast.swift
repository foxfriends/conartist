//
//  UIView+CustomToast.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2019-01-31.
//  Copyright © 2019 Cameron Eldridge. All rights reserved.
//

import Toast_Swift

extension UIView {
    func customToast(title: String, message: String, duration: Double = 5, point: CGPoint? = nil) {
        let toast = CustomToastView(title: title, message: message)
        let point = point ?? CGPoint(x: bounds.minX + bounds.width / 2, y: bounds.maxY - toast.frame.height / 2 - 40)
        showToast(
            toast,
            duration: duration,
            point: point,
            completion: nil
        )
    }
}
