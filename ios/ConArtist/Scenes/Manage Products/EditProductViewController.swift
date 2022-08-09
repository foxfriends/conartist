//
//  EditProductViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-10-31.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class EditProductViewController : ConArtistViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var nameTextField: FancyTextField!
    @IBOutlet weak var quantityTextField: FancyTextField!
    @IBOutlet weak var skuTextField: FancyTextField!
    @IBOutlet weak var discontinuedSwitch: UISwitch!
    @IBOutlet weak var discontinuedLabel: UILabel!

    fileprivate var typeId: Int?
    fileprivate var product: Product?
}

// MARK: - Lifecycle

extension EditProductViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupLocalization()
        setupSubscriptions()
    }
}

// MARK: - UI

extension EditProductViewController {
    fileprivate func setupUI() {
        nameTextField.text = product?.name ?? ""
        quantityTextField.text = "\(product?.quantity ?? 0)"
        if let sku = product?.sku {
            skuTextField.text = sku
        }
        discontinuedSwitch.isOn = product?.discontinued ?? false
        discontinuedSwitch.isHidden = product == nil
        discontinuedLabel.font = discontinuedLabel.font.usingFeatures([.smallCaps])
        discontinuedLabel.isHidden = discontinuedSwitch.isHidden
    }
}

// MARK: - Localization

extension EditProductViewController {
    fileprivate func setupLocalization() {
        navBar.leftButtonTitle = "Cancel"¡
        navBar.rightButtonTitle = "Save"¡
        nameTextField.title = "Name"¡
        nameTextField.placeholder = nameTextField.title
        quantityTextField.title = "Quantity"¡
        quantityTextField.placeholder = quantityTextField.title
        skuTextField.title = "SKU"¡
        skuTextField.title = skuTextField.title
        discontinuedLabel.text = "Discontinued"¡
        navBar.title = (product?.name).map { "Editing {}"¡ % $0 } ?? "New Product"¡
    }
}

// MARK: - Subscriptions

extension EditProductViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .withLatestFrom(
                Observable.combineLatest(
                    nameTextField.rx.text.map { $0 ?? "" },
                    quantityTextField.rx.text.map { Int($0 ?? "") ?? 0 },
                    skuTextField.rx.text.map { $0 == "" ? nil : $0 },
                    discontinuedSwitch.rx.isOn
                )
            )
            .flatMapLatest { [product, typeId] (name: String, quantity: Int, sku: String?, discontinued: Bool) -> Single<ProductFragment> in
                if let product = product {
                    return ConArtist.API.GraphQL
                        .observe(mutation: ModProductMutation(product: ProductMod(
                            productId: product.id,
                            name: name,
                            sku: sku,
                            quantity: quantity,
                            discontinued: discontinued,
                            sort: nil
                        )))
                        .map { $0.modUserProduct.fragments.productFragment }
                } else if let typeId = typeId {
                    return ConArtist.API.GraphQL
                        .observe(mutation: AddProductMutation(product: ProductAdd(
                            typeId: typeId,
                            name: name,
                            sku: sku,
                            quantity: quantity,
                            sort: ConArtist.model.products.value.filter { $0.typeId == typeId }.count
                        )))
                        .map { $0.addUserProduct.fragments.productFragment }
                } else {
                    fatalError("Unreachable case")
                }
            }
            .map { Product(graphQL: $0) }
            .subscribe(
                onNext: { product in
                    ConArtist.model.navigate(back: 1)
                    guard let product = product else {
                        return
                    }
                    ConArtist.model.update(product: product)
                },
                onError: { [weak self] _ in
                    self?.showAlert(
                        title: "An unknown error has occurred"¡,
                        message: "Your changes were not saved. Please try again later"¡
                    )
                }
            )
            .disposed(by: disposeBag)

        Observable
            .combineLatest(
                nameTextField.rx.text
                    .map { $0 ?? "" }
                    .map { [product, typeId] in
                        $0.isEmpty || ConArtist.model.products.value
                            .filter { $0.typeId == product?.typeId ?? typeId! }
                            .filter { product == nil || $0.id != product!.id }
                            .map { $0.name }
                            .contains($0)
                    },
                quantityTextField.rx.text
                    .map { $0 ?? "" }
                    .map { Int($0) }
                    .map { (quantity: Int?) -> Bool in quantity == nil || quantity! < 0 }
            )
            .map { (name: Bool, quantity: Bool) -> Bool in name || quantity }
            .map(!)
            .bind(to: navBar.rightButton.rx.isEnabled)
            .disposed(by: disposeBag)
    }
}

// MARK: - Navigation

extension EditProductViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .products
    static let ID = "EditProduct"

    static func show(for product: Product) {
        let controller = instantiate()
        controller.product = product
        ConArtist.model.navigate(push: controller)
    }

    static func createNewProduct(ofType productType: ProductType) {
        let controller = instantiate()
        controller.typeId = productType.id
        ConArtist.model.navigate(push: controller)
    }
}
