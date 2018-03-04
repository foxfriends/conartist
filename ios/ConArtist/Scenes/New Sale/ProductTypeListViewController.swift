//
//  ProductTypeListViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-23.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import SVGKit

class ProductTypeListViewController: UIViewController {
    fileprivate static let ID = "ProductTypeList"
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var productTypeTableView: UITableView!
    @IBOutlet weak var priceField: FancyTextField!
    @IBOutlet weak var infoTextView: UITextView!
    @IBOutlet weak var infoExpandButton: UIButton!
    @IBOutlet weak var infoExpandButtonImage: SVGKImageView!
    @IBOutlet weak var infoViewBottomConstraint: NSLayoutConstraint!
    @IBOutlet weak var noteLabel: UILabel!

    fileprivate let disposeBag = DisposeBag()
    fileprivate let øproductTypes = Variable<[ProductType]>([])
    fileprivate let øproducts = Variable<[Product]>([])
    fileprivate let øprices = Variable<[Price]>([])
    fileprivate let øselected = Variable<[Product]>([])

    fileprivate var convention: Convention!

    fileprivate let results = PublishSubject<([Product], Money)>()
}

// MARK: - Lifecycle
extension ProductTypeListViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupSubscriptions()
        navBar.title = convention.name
        infoExpandButtonImage.image = ConArtist.Images.SVG.Chevron.Down
        noteLabel.font = noteLabel.font.usingFeatures([.smallCaps])
    }
}

// MARK: - Subscriptions
extension ProductTypeListViewController {
    fileprivate func setupSubscriptions() {
        øproductTypes.asDriver()
            .drive(onNext: { [productTypeTableView] _ in productTypeTableView?.reloadData() })
            .disposed(by: disposeBag)

        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .subscribe(onNext: { _ in ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        infoExpandButton.rx.tap
            .subscribe(onNext: { [view, infoViewBottomConstraint, infoExpandButtonImage] _ in
                guard let expanded = (infoViewBottomConstraint?.constant).map((==) <- 0) else { return }
                infoViewBottomConstraint?.constant = expanded ? -150 : 0
                infoExpandButtonImage?.image = expanded ? ConArtist.Images.SVG.Chevron.Down : ConArtist.Images.SVG.Chevron.Up
                UIView.animate(withDuration: 0.25) { view?.layoutIfNeeded() }
            })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension ProductTypeListViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? øproductTypes.value.count : 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ProductTypeTableViewCell.ID, for: indexPath) as! ProductTypeTableViewCell
        if indexPath.row < øproductTypes.value.count {
            let item = øproductTypes.value[indexPath.row]
            cell.fill(with: item, selected: øselected.value)
        }
        return cell
    }
}

// MARK: - UITableViewDelegate
extension ProductTypeListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let productType = øproductTypes.value[indexPath.row]
        let products = øproducts.value.filter { $0.typeId == productType.id }
        let prices = øprices.value.filter { $0.typeId == productType.id }
        let _ = ProductListViewController.show(for: productType, products, and: prices)
    }
}

// MARK: Navigation
extension ProductTypeListViewController {
    class func show(for convention: Convention) -> Observable<([Product], Money)> {
        let controller: ProductTypeListViewController = ProductTypeListViewController.instantiate(withId: ProductTypeListViewController.ID)

        controller.convention = convention
        convention.products
            .bind(to: controller.øproducts)
            .disposed(by: controller.disposeBag)
        convention.productTypes
            .bind(to: controller.øproductTypes)
            .disposed(by: controller.disposeBag)
        convention.prices
            .bind(to: controller.øprices)
            .disposed(by: controller.disposeBag)

        ConArtist.model.navigate(present: controller)
        return controller.results.asObservable()
    }
}
