//
//  RecordDetailsOverlayViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-15.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import RxCocoa

class RecordDetailsOverlayViewController : ConArtistViewController {
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
    @IBOutlet weak var otherBottomConstraint: NSLayoutConstraint!
    @IBOutlet weak var itemsTableViewHeightConstraint: NSLayoutConstraint!

    @IBOutlet var smallCapsLabels: [UILabel]!

    fileprivate var record: Record!
    fileprivate let _products = BehaviorRelay<[Product]>(value: [])
    fileprivate let _productTypes = BehaviorRelay<[ProductType]>(value: [])
    fileprivate var after: Date?
    fileprivate var convention: Convention?

    fileprivate var products: [Product] {
        return record.products
            .compactMap { id in _products.value.first(where: { product in product.id == id }) }
    }

    fileprivate var productTypes: [ProductType] {
        return products
            .map { $0.typeId }
            .unique()
            .compactMap { id in _productTypes.value.first(where: { type in type.id == id }) }
    }
}

// MARK: - Lifecycle
extension RecordDetailsOverlayViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLocalization()
        setupSubscriptions()
        setupUI()
        bottomConstraint.constant = -sheetView.frame.height
        otherBottomConstraint.constant = -sheetView.frame.height + 25
        view.layoutIfNeeded()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        DispatchQueue.main.async {
            self.animateEntry()
        }
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
            .flatMap { [convention, unowned self] _ in
                ProductTypeListViewController.show(for: convention, editing: self.record)
            }
            .map { [unowned self] products, price, info -> Record in
                let newRecord = Record(
                    id: self.record.id.id ?? ConArtist.NoID,
                    products: products.map { $0.id },
                    price: price,
                    time: self.record.time,
                    info: info
                )
                self.record = newRecord
                DispatchQueue.main.async { self.setupUI() }
                return newRecord
            }
            .flatMap { [convention] record -> Observable<Void> in
                if let convention = convention {
                    return convention
                        .updateRecord(record)
                        .discard()
                } else if let modifications = record.modifications {
                    return ConArtist.API.GraphQL
                        .observe(mutation: UpdateRecordMutation(record: modifications))
                        .map { $0.modUserRecord.fragments.recordFragment }
                        .filterMap(Record.init(graphQL:))
                        .do(onNext: { record in ConArtist.model.replaceRecord(record) })
                        .discard()
                } else {
                    return .empty()
                }
            }
            .subscribe()
            .disposed(by: disposeBag)
    }
}

// MARK: - UI
extension RecordDetailsOverlayViewController {
    fileprivate func setupUI() {
        if convention != nil && convention!.isEnded {
            navBar.rightButton.isHidden = true
        }
        sheetView.layer.cornerRadius = 35
        sheetView.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
        for label in smallCapsLabels {
            label.font = label.font.usingFeatures([.smallCaps])
        }
        amountLabel.font = amountLabel.font.usingFeatures([.tabularFigures])
        amountLabel.text = record.price.toString()
        timeLabel.text = record.time.toString("EEEE MMMM d, yyyy. h:mm a"¡)
        noteLabel.text = record.info.isEmpty ? "Nothing to say..."¡ : record.info
        noteLabel.textColor = record.info.isEmpty ? .textPlaceholder : .text
        backgroundButton.alpha = 0
        let height = productTypes
            .map { productType in self.products.filter { $0.typeId == productType.id }.count }
            .map(RecordDetailsItemsTableViewCell.height)
            .reduce(0, +)
        itemsTableViewHeightConstraint.constant = height
        navBar.title = convention?.name ?? "Sale"¡
        navBar.subtitle = after?.toString("MMM. d, yyyy"¡)
        navBar.layer.shadowOpacity = 0
        itemsTableView.reloadData()
    }

    fileprivate func animateEntry() {
        bottomConstraint.constant = 0
        otherBottomConstraint.constant = 25
        UIView.animate(withDuration: RecordDetailsOverlayViewController.AnimationDuration) {
            self.backgroundButton.alpha = 1
            self.view.layoutIfNeeded()
        }
    }

    fileprivate func animateExit() {
        bottomConstraint.constant = -sheetView.frame.height
        otherBottomConstraint.constant = -sheetView.frame.height + 25
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
        let typeId = productTypes[indexPath.row].id
        return RecordDetailsItemsTableViewCell.height(with: products.filter { $0.typeId == typeId }.count)
    }

    func tableView(_ tableView: UITableView, estimatedHeightForRowAt indexPath: IndexPath) -> CGFloat {
        return 60
    }
}

// MARK: - Navigation
extension RecordDetailsOverlayViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .records
    static let ID = "RecordDetailsOverlay"

    static func show(
        for record: Record,
        products: Observable<[Product]>,
        productTypes: Observable<[ProductType]>,
        after: Date?,
        convention: Convention? = nil
    ) {
        let controller = instantiate()
        controller.record = record
        products
            .bind(to: controller._products)
            .disposed(by: controller.disposeBag)
        productTypes
            .bind(to: controller._productTypes)
            .disposed(by: controller.disposeBag)
        controller.convention = convention
        controller.after = after
        ConArtist.model.navigate(show: controller)
    }
}
