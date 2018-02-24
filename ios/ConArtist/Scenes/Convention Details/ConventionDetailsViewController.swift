//
//  ConventionDetailsViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class ConventionDetailsViewController : UIViewController {
    fileprivate static let ID = "ConventionDetails"
    fileprivate let disposeBag = DisposeBag()

    @IBOutlet weak var navBar: FakeNavBar!

    @IBOutlet weak var infoTableView: UITableView!
    @IBOutlet weak var headerImage: UIImageView!
    @IBOutlet weak var seeAllInfoButton: UIButton!
    @IBOutlet weak var seeAllRecordsButton: UIButton!

    @IBOutlet weak var userSuppliedInfoPreview: UIStackView!

    @IBOutlet weak var salesTotalLabel: UILabel!
    @IBOutlet weak var expensesTotalLabel: UILabel!
    @IBOutlet weak var netRevenueLabel: UILabel!

    var convention: Convention!
}

// MARK: - Lifecycle
extension ConventionDetailsViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupSubscriptions()
        setupUI()
    }
}

// MARK: - UI
extension ConventionDetailsViewController {
    fileprivate func setupUI() {
        navBar.title = convention.name
    }
}

// MARK: - Subscriptions
extension ConventionDetailsViewController {
    fileprivate func setupSubscriptions() {
        let _ = convention.fill().subscribe()

        navBar.leftButton.rx.tap
            .subscribe(onNext: { ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)
    }
}

// MARK: - Navigation
extension ConventionDetailsViewController {
    class func show(for convention: Convention) {
        let controller: ConventionDetailsViewController = ConventionDetailsViewController.instantiate(withId: ConventionDetailsViewController.ID)
        controller.convention = convention
        ConArtist.model.navigate(push: controller)
    }
}
