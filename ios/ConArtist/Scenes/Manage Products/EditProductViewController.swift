//
//  EditProductViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-10-31.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class EditProductViewController: UIViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var nameTextField: FancyTextField!
    @IBOutlet weak var quantityTextField: FancyTextField!
    @IBOutlet weak var discontinuedSwitch: UISwitch!
    @IBOutlet weak var discontinuedLabel: UILabel!

    fileprivate var product: Product!
    fileprivate let disposeBag = DisposeBag()
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
        nameTextField.text = product.name
        quantityTextField.text = "\(product.quantity)"
        discontinuedSwitch.isOn = product.discontinued
        navBar.title = "Editing {}"¡ % product.name
        discontinuedLabel.font = discontinuedLabel.font.usingFeatures([.smallCaps])
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
        discontinuedLabel.text = "Discontinued"¡
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
                    discontinuedSwitch.rx.isOn
                )
            )
            .map { [product = product!] (name: String, quantity: Int, discontinued: Bool) -> ProductMod in
                ProductMod(productId: product.id, name: name, quantity: quantity, discontinued: discontinued, sort: nil)
            }
            .flatMapLatest { ConArtist.API.GraphQL.observe(mutation: ModProductMutation(product: $0)) }
            .map { Product(graphQL: $0.modUserProduct.fragments.productFragment) }
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
                    .map { [product = product!] in
                        $0.isEmpty || ConArtist.model.products.value
                            .filter { $0.typeId == product.typeId }
                            .filter { $0.id != product.id }
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
}
