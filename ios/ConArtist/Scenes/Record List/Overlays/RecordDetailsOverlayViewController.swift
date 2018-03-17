//
//  RecordDetailsOverlayViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-15.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class RecordDetailsOverlayViewController: UIViewController {
    fileprivate static let ID = "RecordDetailsOverlay"
    fileprivate static let AnimationDuration = 0.25

    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var sheetView: UIView!
    @IBOutlet weak var backgroundButton: UIButton!
    @IBOutlet weak var itemsTableView: UITableView!
    @IBOutlet weak var amountLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var noteLabel: UILabel!
    @IBOutlet weak var titleLabel: UILabel!

    @IBOutlet weak var bottomConstraint: NSLayoutConstraint!

    @IBOutlet var smallCapsLabels: [UILabel]!

    fileprivate var record: Record!
    fileprivate var convention: Convention!
    fileprivate var after: Date?

    fileprivate let disposeBag = DisposeBag()

    fileprivate var products: [Product] {
        return record.products
            .filterMap(convention.product(withId:))
    }

    fileprivate var productTypes: [ProductType] {
        return products
            .map { $0.typeId }
            .unique()
            .filterMap(convention.productType(withId:))
    }
}

// MARK: - Lifecycle
extension RecordDetailsOverlayViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLocalization()
        setupSubscriptions()
        setupUI()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        animateEntry()
    }
}

// MARK: - Localization
extension RecordDetailsOverlayViewController {
    fileprivate func setupLocalization() {
        titleLabel.text = "Sale"¡
        for label in smallCapsLabels {
            label.text = label.text?¡
        }
        navBar.rightButtonTitle = "Edit"¡
        navBar.leftButtonTitle = "Back"¡
    }
}

// MARK: - Subscriptions
extension RecordDetailsOverlayViewController {
    fileprivate func setupSubscriptions() {
        Observable
            .merge(
                backgroundButton.rx.tap.discard(),
                navBar.leftButton.rx.tap.discard()
            )
            .subscribe { [weak self] _ in self?.animateExit() }
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .flatMap { [convention, record] _ in ProductTypeListViewController.show(for: convention!, editing: record!) }
            .subscribe()
            .disposed(by: disposeBag)
    }
}

// MARK: - UI
extension RecordDetailsOverlayViewController {
    fileprivate func setupUI() {
        sheetView.layer.cornerRadius = 35
        sheetView.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
        for label in smallCapsLabels {
            label.font = label.font.usingFeatures([.smallCaps])
        }
        amountLabel.font = amountLabel.font.usingFeatures([.tabularFigures])
        amountLabel.text = record.price.toString()
        timeLabel.text = record.time.toString("EEEE MMMM d, yyyy. h:mm a"¡)
        noteLabel.text = record.info.isEmpty ? "Nothing to say…"¡ : record.info
        noteLabel.textColor = record.info.isEmpty ? ConArtist.Color.TextPlaceholder : ConArtist.Color.Text
        bottomConstraint.constant = -view.frame.height
        backgroundButton.alpha = 0
        let height = productTypes
            .map { productType in self.products.filter { $0.typeId == productType.id }.count }
            .map(RecordDetailsItemsTableViewCell.height)
            .reduce(0, +)
        itemsTableView.heightAnchor.constraint(equalToConstant: CGFloat(height)).isActive = true
        navBar.title = convention.name
        navBar.subtitle = after?.toString("MMM. d, yyyy"¡)
        navBar.layer.shadowOpacity = 0
    }

    fileprivate func animateEntry() {
        bottomConstraint.constant = 0
        UIView.animate(withDuration: RecordDetailsOverlayViewController.AnimationDuration) {
            self.backgroundButton.alpha = 1
            self.view.layoutIfNeeded()
        }
    }

    fileprivate func animateExit() {
        bottomConstraint.constant = -view.frame.height
        UIView.animate(
            withDuration: RecordDetailsOverlayViewController.AnimationDuration,
            animations: {
                self.backgroundButton.alpha = 0
                self.view.layoutIfNeeded()
            },
            completion: { _ in
                ConArtist.model.navigate(back: 1)
            }
        )
    }
}

// MARK: - UITableViewDataSource
extension RecordDetailsOverlayViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return productTypes.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: RecordDetailsItemsTableViewCell.ID, for: indexPath) as! RecordDetailsItemsTableViewCell
        let productType = productTypes[indexPath.row]
        let products = self.products.filter { $0.typeId == productType.id }
        cell.setup(for: productType, with: products)
        return cell
    }
}

// MARK: - UITableViewDelegate
extension RecordDetailsOverlayViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return UITableViewAutomaticDimension
    }

    func tableView(_ tableView: UITableView, estimatedHeightForRowAt indexPath: IndexPath) -> CGFloat {
        return 60
    }
}

// MARK: - Navigation
extension RecordDetailsOverlayViewController {
    class func show(for record: Record, in convention: Convention, after: Date?) {
        let controller: RecordDetailsOverlayViewController = RecordDetailsOverlayViewController.instantiate(withId: RecordDetailsOverlayViewController.ID)
        controller.record = record
        controller.convention = convention
        controller.after = after
        ConArtist.model.navigate(show: controller)
    }
}
