//
//  EditProductTypeViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-10-31.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class EditProductTypeViewController : ConArtistViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var nameTextField: FancyTextField!
    @IBOutlet weak var discontinuedSwitch: UISwitch!
    @IBOutlet weak var discontinuedLabel: UILabel!

    fileprivate var productType: ProductType?
}

// MARK: - Lifecycle

extension EditProductTypeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        setupUI()
        setupLocalization()
        setupSubscriptions()
    }
}

// MARK: - UI

extension EditProductTypeViewController {
    fileprivate func setupUI() {
        nameTextField.text = productType?.name ?? ""
        discontinuedSwitch.isOn = productType?.discontinued ?? false
        discontinuedSwitch.isHidden = productType == nil
        discontinuedLabel.font = discontinuedLabel.font.usingFeatures([.smallCaps])
        discontinuedLabel.isHidden = discontinuedSwitch.isHidden
    }
}

// MARK: - Localization

extension EditProductTypeViewController {
    fileprivate func setupLocalization() {
        navBar.leftButtonTitle = "Cancel"¡
        navBar.rightButtonTitle = "Save"¡
        navBar.title = (productType?.name).map { "Editing {}"¡ % $0 } ?? "New Product Type"¡
        nameTextField.title = "Name"¡
        nameTextField.placeholder = nameTextField.title
        discontinuedLabel.text = "Discontinued"¡
    }
}

// MARK: - Subscriptions

extension EditProductTypeViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .withLatestFrom(
                Observable.combineLatest(
                    nameTextField.rx.text.map { $0 ?? "" },
                    discontinuedSwitch.rx.isOn
                )
            )
            .flatMapLatest { [productType] (name: String, discontinued: Bool) -> Observable<ProductTypeFragment> in
                if let productType = productType {
                    return ConArtist.API.GraphQL
                        .observe(mutation: ModProductTypeMutation(productType: ProductTypeMod(
                            typeId: productType.id,
                            name: name,
                            color: nil,
                            discontinued: discontinued,
                            sort: nil
                        )))
                        .map { $0.modUserProductType.fragments.productTypeFragment }
                } else {
                    return ConArtist.API.GraphQL
                        .observe(mutation: AddProductTypeMutation(productType: ProductTypeAdd(
                            name: name,
                            color: 0xFFFFFF,
                            sort: ConArtist.model.productTypes.value.count
                        )))
                        .map { $0.addUserProductType.fragments.productTypeFragment }
                }
            }
            .map { ProductType(graphQL: $0) }
            .subscribe(
                onNext: { productType in
                    ConArtist.model.navigate(back: 1)
                    guard let productType = productType else {
                        return
                    }
                    ConArtist.model.update(productType: productType)
                },
                onError: { [weak self] _ in
                    self?.showAlert(
                        title: "An unknown error has occurred"¡,
                        message: "Your changes were not saved. Please try again later"¡
                    )
                }
            )
            .disposed(by: disposeBag)

        nameTextField.rx.text
            .map { $0 ?? "" }
            .map { [productType] name in
                name.isEmpty || ConArtist.model.productTypes.value
                    .filter { productType == nil || $0.id != productType!.id }
                    .map { $0.name }
                    .contains(name)
            }
            .map(!)
            .bind(to: navBar.rightButton.rx.isEnabled)
            .disposed(by: disposeBag)
    }
}

// MARK: - Navigation

extension EditProductTypeViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .products
    static let ID = "EditProductType"

    static func show(for productType: ProductType) {
        let controller = instantiate()
        controller.productType = productType
        ConArtist.model.navigate(push: controller)
    }

    static func createNewProductType() {
        ConArtist.model.navigate(push: instantiate())
    }
}
