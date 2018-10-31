//
//  UIView+Alerts.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-10-31.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

extension UIViewController {
    func showAlert(
        title: String? = nil,
        message: String? = nil,
        dismiss: String = "Ok"¡
    ) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: dismiss, style: .default))
        self.present(alert, animated: true)
    }
}
