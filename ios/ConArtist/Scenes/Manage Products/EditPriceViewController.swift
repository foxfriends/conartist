//
//  EditPriceViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-05.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import RxCocoa

class EditPriceViewController : ConArtistViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var productLabel: UILabel!
    @IBOutlet weak var productButton: UIButton!
    @IBOutlet weak var quantityTextField: FancyTextField!
    @IBOutlet weak var priceTextField: FancyTextField!

    fileprivate var typeId: Int?
    fileprivate var price: Price?
    fileprivate let products = BehaviorRelay<[Product]>(value: [])
    fileprivate let product = BehaviorRelay<Product?>(value: nil)
    fileprivate let disposeBag = DisposeBag()
}

// MARK: - Lifecycle

extension EditPriceViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        product.accept(price?.product)
        setupUI()
        setupLocalization()
        setupSubscriptions()
    }
}

// MARK: - UI

extension EditPriceViewController {
    fileprivate func setupUI() {
        quantityTextField.text = "\(price?.quantity ?? 0)"
        priceTextField.text = "\(price?.price.numericValue() ?? 0.0)"
    }
}

// MARK: - Localization

extension EditPriceViewController {
    fileprivate func setupLocalization() {
        navBar.leftButtonTitle = "Cancel"¡
        navBar.rightButtonTitle = "Save"¡
        productLabel.text = "Product"¡
        productLabel.font = productLabel.font.usingFeatures([.smallCaps])
        quantityTextField.title = "Quantity"¡
        quantityTextField.placeholder = quantityTextField.title
        priceTextField.title = "Price"¡
        priceTextField.placeholder = priceTextField.title
        navBar.title = price == nil ? "New Price"¡ : "Editing Price"¡
    }
}

// MARK: - Subscriptions

extension EditPriceViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        ConArtist.model.products
            .map { [price, typeId] in $0.filter { $0.typeId == (price?.typeId ?? typeId!) } }
            .bind(to: products)
            .disposed(by: disposeBag)

        product.asDriver()
            .map { $0?.name ?? "Any"¡ }
            .drive(productButton.rx.title(for: .normal))
            .disposed(by: disposeBag)

        productButton.rx.tap
            .subscribe(onNext: { [products, product] _ in
                SettingsSelectViewController.show(
                    title: "Product"¡,
                    value: product.value.flatMap { products.value.firstIndex(of: $0) }.map { $0 + 1 } ?? 0,
                    options: ["Any"¡] + products.value.map { $0.name },
                    handler: { index in
                        product.accept(products.value.nth(index - 1))
                    }
                )
            })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .withLatestFrom(
                Observable.combineLatest(
                    product.map { $0?.id },
                    quantityTextField.rx.text
                        .map { Int($0 ?? "") ?? 0 },
                    priceTextField.rx.text
                        .map { Money.parse(as: ConArtist.model.settings.value.currency, $0 ?? "") ?? Money.zero }
                )
            )
            .flatMapLatest { [price, typeId] (productId: Int?, quantity: Int, amount: Money) -> Observable<PriceFragment> in
                if let price = price {
                    return ConArtist.API.GraphQL
                        .observe(mutation: AddPriceMutation(price: PriceAdd(
                            typeId: price.typeId,
                            productId: productId,
                            quantity: quantity,
                            price: amount.toJSON()
                        )))
                        .map { $0.addUserPrice.fragments.priceFragment }
                } else if let typeId = typeId {
                    return ConArtist.API.GraphQL
                        .observe(mutation: AddPriceMutation(price: PriceAdd(
                            typeId: typeId,
                            productId: productId,
                            quantity: quantity,
                            price: amount.toJSON()
                        )))
                        .map { $0.addUserPrice.fragments.priceFragment }
                } else {
                    fatalError("Unreachable case")
                }
            }
            .map { Price(graphQL: $0) }
            .subscribe(
                onNext: { price in
                    ConArtist.model.navigate(back: 1)
                    guard let price = price else {
                        return
                    }
                    ConArtist.model.update(price: price)
                },
                onError: { [weak self] _ in
                    self?.showAlert(
                        title: "An unknown error has occurred"¡,
                        message: "Your changes were not saved. Please try again later"¡
                    )
                }
            )
            .disposed(by: disposeBag)

        Driver
            .combineLatest(
                priceTextField.rx.text.asDriver()
                    .map { $0 ?? "" }
                    .map { Money.parse(as: ConArtist.model.settings.value.currency, $0) }
                    .map { (price: Money?) -> Bool in price != nil },
                quantityTextField.rx.text.asDriver()
                    .map { $0 ?? "" }
                    .map { Int($0) ?? 0 }
                    .map { (qty: Int) -> Bool in qty > 0 }
            )
            .map { (price: Bool, quantity: Bool) -> Bool in price && quantity }
            .drive(navBar.rightButton.rx.isEnabled)
            .disposed(by: disposeBag)
    }
}

// MARK: - Navigation

extension EditPriceViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .products
    static let ID = "EditPrice"

    static func show(for price: Price) {
        let controller = instantiate()
        controller.price = price
        ConArtist.model.navigate(push: controller)
    }

    static func createNewPrice(ofType productType: ProductType) {
        let controller = instantiate()
        controller.typeId = productType.id
        ConArtist.model.navigate(push: controller)
    }
}
