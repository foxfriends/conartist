//
//  ProductTypeListViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import RxCocoa
import SVGKit

class ProductTypeListViewController : ConArtistViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var productTypeTableView: UITableView!
    @IBOutlet weak var priceField: FancyTextField!
    @IBOutlet weak var infoTextView: UITextView!
    @IBOutlet weak var infoExpandButton: UIButton!
    @IBOutlet weak var infoExpandButtonImage: SVGKImageView!
    @IBOutlet weak var infoViewBottomConstraint: NSLayoutConstraint!
    @IBOutlet weak var noteLabel: UILabel!

    fileprivate let disposeBag = DisposeBag()
    fileprivate let productTypes = BehaviorRelay<[ProductType]>(value: [])
    fileprivate let products = BehaviorRelay<[Product]>(value: [])
    fileprivate let prices = BehaviorRelay<[Price]>(value: [])
    fileprivate let selected = BehaviorRelay<[Product]>(value: [])
    fileprivate let records = BehaviorRelay<[Record]>(value: [])
    fileprivate let money = BehaviorRelay<Money?>(value: nil)

    fileprivate var editingRecord: Record?
    fileprivate let results = PublishSubject<([Product], Money, String)>()

    fileprivate let expectedInfoViewBottomConstraintConstant = BehaviorRelay<CGFloat>(value: -150)
}

// MARK: - Lifecycle
extension ProductTypeListViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLocalization()
        setupSubscriptions()
        infoExpandButtonImage.image = .chevronDown
        noteLabel.font = noteLabel.font.usingFeatures([.smallCaps])
        priceField.format = { Money.parse(as: ConArtist.model.settings.value.currency, $0)?.toString() ?? $0 }
        if let record = editingRecord {
            infoTextView.text = record.info
            selected.accept(record.products.compactMap { id in products.value.first { product in product.id == id } })
            priceField.text = "\(record.price.numericValue)"
            money.accept(record.price)
        }
        startAdjustingForKeyboard()
    }
}

// MARK: - Localization
extension ProductTypeListViewController {
    fileprivate func setupLocalization() {
        navBar.leftButtonTitle = "Cancel"¡
        navBar.rightButtonTitle = "Save"¡
        navBar.title = editingRecord == nil ? "New Sale"¡ : "Editing Sale"¡
        priceField.title = "Price"¡
        priceField.placeholder = "Price"¡
        noteLabel.text = "Note"¡
    }
}

// MARK: - Subscriptions
extension ProductTypeListViewController {
    fileprivate func setupSubscriptions() {
        productTypes.asDriver()
            .drive(onNext: { [productTypeTableView] _ in productTypeTableView?.reloadData() })
            .disposed(by: disposeBag)

        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        Observable
            .merge(
                selected.distinctUntilChanged().discard(),
                priceField.rx.text.distinctUntilChanged().discard()
            )
            .withLatestFrom(priceField.rx.text)
            .map { [unowned self] text -> Money? in
                guard let text = text, !text.isEmpty else {
                    return self.calculatePrice(self.selected.value)
                }
                return Money.parse(as: ConArtist.model.settings.value.currency, text)
            }
            .bind(to: money)
            .disposed(by: disposeBag)

        Observable
            .combineLatest(
                selected.map { !$0.isEmpty },
                money.map { $0 != nil }
            )
            .map { $0 && $1 }
            .bind(to: navBar.rightButton.rx.isEnabled)
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .withLatestFrom(
                Observable.combineLatest(
                    selected,
                    money,
                    infoTextView.rx.text.map { $0 ?? "" }
                )
            )
            .map { products, money, note in
                (products, money ?? self.calculatePrice(self.selected.value) ?? .zero, note)
            }
            .subscribe(onNext: { [results] products, money, note in
                results.onNext((products, money, note))
                ConArtist.model.navigate(back: 1)
            })
            .disposed(by: disposeBag)

        selected
            .distinctUntilChanged()
            .map { [unowned self] selection in self.calculatePrice(selection) }
            .map { [placeholder = priceField.placeholder] money in money?.toString() ?? placeholder }
            .asDriver(onErrorJustReturn: priceField.placeholder)
            .drive(onNext: { [priceField] text in priceField?.placeholder = text })
            .disposed(by: disposeBag)

        selected
            .subscribe(onNext: { [productTypeTableView] _ in productTypeTableView?.reloadData() })
            .disposed(by: disposeBag)

        infoExpandButton.rx.tap
            .subscribe(onNext: { [view, expectedInfoViewBottomConstraintConstant] _ in
                view?.endEditing(true)
                expectedInfoViewBottomConstraintConstant.accept(expectedInfoViewBottomConstraintConstant.value >= 0 ? -150 : 0)
            })
            .disposed(by: disposeBag)

        expectedInfoViewBottomConstraintConstant
            .asDriver()
            .skip(1)
            .drive(onNext: { [view, infoViewBottomConstraint, infoExpandButtonImage] amount in
                infoViewBottomConstraint?.constant = amount
                infoExpandButtonImage?.image = amount == 0 ? .chevronUp : .chevronDown
                UIView.animate(withDuration: 0.25) { view?.layoutIfNeeded() }
            })
            .disposed(by: disposeBag)
    }
}

// MARK: - Keyboard handling
extension ProductTypeListViewController {
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
        let keyboardViewEndFrame = view.convert(keyboardScreenEndFrame, from: view.window)

        if notification.name == UIResponder.keyboardWillHideNotification {
            infoViewBottomConstraint.constant = expectedInfoViewBottomConstraintConstant.value
        } else {
            infoViewBottomConstraint.constant = expectedInfoViewBottomConstraintConstant.value + keyboardViewEndFrame.height
        }
        UIView.animate(withDuration: duration) { self.view.layoutIfNeeded() }
    }
}

// MARK: - UITableViewDataSource
extension ProductTypeListViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? productTypes.value.count : 0
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ProductTypeTableViewCell.ID, for: indexPath) as! ProductTypeTableViewCell
        if indexPath.row < productTypes.value.count {
            let item = productTypes.value[indexPath.row]
            cell.fill(with: item, selected: selected.value)
        }
        return cell
    }
}

// MARK: - UITableViewDelegate
extension ProductTypeListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let productType = productTypes.value[indexPath.row]
        let products = self.products.value.filter { $0.typeId == productType.id }
        ProductListViewController.show(for: productType, and: products, records: records.value, selected: selected)
    }

    func tableView(_ tableView: UITableView, didHighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = true
    }

    func tableView(_ tableView: UITableView, didUnhighlightRowAt indexPath: IndexPath) {
        tableView.cellForRow(at: indexPath)?.isHighlighted = false
    }
}

// MARK: - Price calculation
extension ProductTypeListViewController {
    enum Key: Equatable, Hashable {
        case product(Int)
        case productType(Int)

        static func ==(a: Key, b: Key) -> Bool {
            switch (a, b) {
            case (.product(let a), .product(let b)),
                 (.productType(let a), .productType(let b)): return a == b
            default: return false
            }
        }

        var hashValue: Int {
            switch self {
            case .product(let id): return id
            case .productType(let id): return -id
            }
        }
    }

    fileprivate func calculatePrice(_ selected: [Product]) -> Money? {
        let prices = self.prices.value
        guard prices.count > 0 else { return nil }
        let matters = prices.compactMap { $0.productId }
        let items: [Key: Int] = selected.reduce([:]) { counts, product in
            let id: Key = matters.contains(product.id) ? .product(product.id) : .productType(product.typeId)
            var updated = counts
            updated[id] = 1 + (counts[id] ?? 0)
            return updated
        }
        let newPrice = items.reduce(Money.zero) { price, item in
            let key = item.key
            var count = item.value
            let relevantPrices = prices
                .filter { price in price.productId.map(Key.product).map((==) <- key) ?? (Key.productType(price.typeId) == key) }
                .sorted { $0.quantity < $1.quantity }
            var newPrice = price
            while count > 0 {
                let price = relevantPrices
                    .reduce(nil) { best, price -> Price? in
                        if price.quantity <= count && price.quantity > best?.quantity ?? 0 {
                            return price
                        } else {
                            return best
                        }
                    }
                guard let bestPrice = price else { return newPrice }
                count -= bestPrice.quantity
                newPrice = newPrice + bestPrice.price
            }
            return newPrice
        }
        return newPrice == Money.zero ? nil : newPrice
    }
}

// MARK: Navigation
extension ProductTypeListViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .sale
    static let ID = "ProductTypeList"

    static func show(for convention: Convention? = nil, editing record: Record? = nil) -> Observable<([Product], Money, String)> {
        let controller = instantiate()

        controller.editingRecord = record
        if let convention = convention {
            convention.records
                .bind(to: controller.records)
                .disposed(by: controller.disposeBag)
            convention.products
                .bind(to: controller.products)
                .disposed(by: controller.disposeBag)
            convention.productTypes
                .bind(to: controller.productTypes)
                .disposed(by: controller.disposeBag)
            convention.prices
                .bind(to: controller.prices)
                .disposed(by: controller.disposeBag)
        } else {
            ConArtist.model.products
                .bind(to: controller.products)
                .disposed(by: controller.disposeBag)
            ConArtist.model.productTypes
                .bind(to: controller.productTypes)
                .disposed(by: controller.disposeBag)
            ConArtist.model.prices
                .bind(to: controller.prices)
                .disposed(by: controller.disposeBag)
        }

        ConArtist.model.navigate(present: controller)
        return controller.results.asObservable()
    }
}
