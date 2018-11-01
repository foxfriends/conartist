//
//  EditProductTypeViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-10-31.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class EditProductTypeViewController: UIViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var nameTextField: FancyTextField!
    @IBOutlet weak var discontinuedSwitch: UISwitch!
    @IBOutlet weak var discontinuedLabel: UILabel!

    fileprivate var productType: ProductType!
    fileprivate let disposeBag = DisposeBag()
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
        nameTextField.text = productType.name
        discontinuedSwitch.isOn = productType.discontinued
        discontinuedLabel.font = discontinuedLabel.font.usingFeatures([.smallCaps])
    }
}

// MARK: - Localization

extension EditProductTypeViewController {
    fileprivate func setupLocalization() {
        navBar.leftButtonTitle = "Cancel"¡
        navBar.rightButtonTitle = "Save"¡
        navBar.title = "Editing {}"¡ % productType.name
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
            .flatMapLatest { [productType = productType!] name, discontinued in
                ConArtist.API.GraphQL.observe(mutation: ModProductTypeMutation(productType: ProductTypeMod(
                    typeId: productType.id,
                    name: name,
                    color: nil,
                    discontinued: discontinued,
                    sort: nil
                )))
            }
            .map { ProductType(graphQL: $0.modUserProductType.fragments.productTypeFragment) }
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
            .map { [productType = productType!] name in
                name.isEmpty || ConArtist.model.productTypes.value
                    .filter { $0.id != productType.id }
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
    static let Storyboard: Storyboard = .Products
    static let ID = "EditProductType"

    static func show(for productType: ProductType) {
        let controller = instantiate()
        controller.productType = productType
        ConArtist.model.navigate(push: controller)
    }
}
