//
//  OtherConventionInfoTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-09.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import RxCocoa

class OtherConventionInfoTableViewCell: UITableViewCell {
    @IBOutlet weak var infoLabel: UILabel!
    @IBOutlet weak var revenueLabel: UILabel!
    @IBOutlet weak var salesLabel: UILabel!
    @IBOutlet weak var salesAmountLabel: UILabel!
    @IBOutlet weak var expensesLabel: UILabel!
    @IBOutlet weak var expensesAmountLabel: UILabel!
    @IBOutlet weak var netProfitLabel: UILabel!
    @IBOutlet weak var netProfitAmountLabel: UILabel!
    @IBOutlet weak var userSuppliedInfoPreview: UIStackView!
    @IBOutlet weak var revenueSection: UIView!

    @IBOutlet weak var seeAllInfoButton: UIButton!
    @IBOutlet weak var viewRecordsButton: UIButton!

    fileprivate var disposeBag = DisposeBag()
}

// MARK: - Lifecycle

extension OtherConventionInfoTableViewCell {
    override func prepareForReuse() {
        super.prepareForReuse()
        disposeBag = DisposeBag()
    }
}

// MARK: - Setup

extension OtherConventionInfoTableViewCell {
    static let ID = "OtherConventionInfo"

    func setup(with convention: Convention) {
        for label in [infoLabel, revenueLabel, salesLabel, expensesLabel, netProfitLabel] {
            label!.font = label!.font.usingFeatures([.smallCaps])
        }
        for button in [viewRecordsButton, seeAllInfoButton] {
            button!.conArtistStyle()
        }
        for label in [salesAmountLabel, expensesAmountLabel, netProfitAmountLabel] {
            label!.font = label!.font.usingFeatures([.tabularFigures])
        }

        infoLabel.text = "Info"¡
        revenueLabel.text = "Revenue"¡
        salesLabel.text = "Sales"¡
        expensesLabel.text = "Expenses"¡
        netProfitLabel.text = "Net profit"¡

        viewRecordsButton.setTitle("View records"¡, for: .normal)
        seeAllInfoButton.setTitle("See all"¡, for: .normal)

        seeAllInfoButton.rx.tap
            .subscribe(onNext: { _ in ConventionUserInfoListViewController.show(for: convention) })
            .disposed(by: disposeBag)

        viewRecordsButton.rx.tap
            .subscribe(onNext: { _ in RecordsOverviewViewController.show(for: convention) })
            .disposed(by: disposeBag)

        let calculatedSalesTotal = convention.records
            .map { $0.map { $0.price } }
            .map { $0.reduce(Money.zero, +) }

        let calculatedExpensesTotal = convention.expenses
            .map { $0.map { $0.price } }
            .map { $0.reduce(Money.zero, +) }

        let salesTotal = Observable
            .merge(
                Observable.just(convention.recordTotal ?? Money.zero),
                calculatedSalesTotal
            )

        salesTotal
            .map { $0.toString() }
            .bind(to: salesAmountLabel.rx.text)
            .disposed(by: disposeBag)

        let expenseTotal = Observable
            .merge(
                Observable.just(convention.expenseTotal ?? Money.zero),
                calculatedExpensesTotal
        )

        expenseTotal
            .map { $0.toString() }
            .bind(to: expensesAmountLabel.rx.text)
            .disposed(by: disposeBag)

        Observable.combineLatest(salesTotal, expenseTotal)
            .map(-)
            .map { $0.toString() }
            .bind(to: netProfitAmountLabel.rx.text)
            .disposed(by: disposeBag)

        Observable.combineLatest(salesTotal, expenseTotal)
            .map { $0.0 == Money.zero && $0.1 == Money.zero }
            .bind(to: revenueSection.rx.isHidden)
            .disposed(by: disposeBag)

        convention.userInfo
            .map { Array($0.prefix(2)) }
            .map {
                $0.map { info in
                    let label = UILabel()
                    label.text = info.info
                    label.textColor = .text
                    label.font = UIFont.systemFont(ofSize: 15)
                    return label
                }
            }
            .asDriver(onErrorJustReturn: [] as [UILabel])
            .drive(onNext: { [userSuppliedInfoPreview] labels in
                guard let userSuppliedInfoPreview = userSuppliedInfoPreview else { return }
                userSuppliedInfoPreview.subviews.forEach { $0.removeFromSuperview() }
                labels.forEach(userSuppliedInfoPreview.addArrangedSubview)
                if labels.count == 0 {
                    let label = UILabel()
                    label.textAlignment = .center
                    label.font = UIFont.systemFont(ofSize: 15).usingFeatures([.smallCaps])
                    label.textColor = UIColor.textPlaceholder.withAlphaComponent(0.25)
                    label.text = "There's nothing here..."¡
                    userSuppliedInfoPreview.addArrangedSubview(label)
                }
            })
            .disposed(by: disposeBag)
    }
}
