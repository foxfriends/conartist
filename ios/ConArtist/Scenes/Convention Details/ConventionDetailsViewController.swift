//
//  ConventionDetailsViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class ConventionDetailsViewController : UIViewController {
    fileprivate static let ID = "ConventionDetails"
    fileprivate let disposeBag = DisposeBag()

    @IBOutlet weak var navBar: FakeNavBar!

    @IBOutlet weak var pageScrollView: UIScrollView!

    @IBOutlet weak var infoTableView: UITableView!
    @IBOutlet weak var infoTableViewHeightConstraint: NSLayoutConstraint!
    @IBOutlet weak var headerImage: NetworkImageView!
    @IBOutlet weak var seeAllInfoButton: UIButton!
    @IBOutlet weak var seeAllRecordsButton: UIButton!

    @IBOutlet weak var userSuppliedInfoPreview: UIStackView!
    @IBOutlet weak var revenueSection: UIView!

    @IBOutlet weak var salesAmountLabel: UILabel!
    @IBOutlet weak var expensesAmountLabel: UILabel!
    @IBOutlet weak var netRevenueAmountLabel: UILabel!

    @IBOutlet weak var newSaleButton: UIButton!
    @IBOutlet weak var newExpenseButton: UIButton!

    @IBOutlet var smallCapsLabels: [UILabel]!

    var convention: Convention!

    fileprivate let refreshControl = UIRefreshControl()
}

// MARK: - Lifecycle
extension ConventionDetailsViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupLocalization()
        setupSubscriptions()
        setupRefreshControl()
    }

    // NOTE: not the quickest calculation, but it should only be called once anyway...
    //       if this starts to cause problems it can be memoized
    private var tableViewHeight: CGFloat {
        return (0..<tableView(infoTableView, numberOfRowsInSection: 0))
            .map { infoTableView.cellForRow(at: IndexPath(row: $0, section: 0))!.frame.height }
            .reduce(0, +)
    }

    override func updateViewConstraints() {
        super.updateViewConstraints()
        infoTableViewHeightConstraint.constant = tableViewHeight + infoTableView.tableHeaderView!.frame.height
    }

    private func setupRefreshControl() {
        pageScrollView.refreshControl = refreshControl
        refreshControl.addTarget(self, action: #selector(reloadConvention), for: .valueChanged)
    }

    @objc private func reloadConvention() {
        let _ = convention
            .fill(true)
            .subscribe { [refreshControl] _ in refreshControl.endRefreshing() }
    }
}

// MARK: - UI
extension ConventionDetailsViewController {
    fileprivate func setupUI() {
        navBar.title = convention.name

        for label in smallCapsLabels {
            label.font = label.font.usingFeatures([.smallCaps])
        }

        infoTableView.isScrollEnabled = false
        salesAmountLabel.font = salesAmountLabel.font.usingFeatures([.tabularFigures])
        expensesAmountLabel.font = expensesAmountLabel.font.usingFeatures([.tabularFigures])
        netRevenueAmountLabel.font = netRevenueAmountLabel.font.usingFeatures([.tabularFigures])
        headerImage.imageId = convention.images.first
        infoTableView.reloadData()
        updateViewConstraints()
    }
}

// MARK: - Localization
extension ConventionDetailsViewController {
    fileprivate func setupLocalization() {
        navBar.leftButtonTitle = "Back"¡
        seeAllRecordsButton.setTitle("View records"¡, for: .normal)
        newSaleButton.setTitle("New sale"¡, for: .normal)
        newExpenseButton.setTitle("New expense"¡, for: .normal)
        seeAllInfoButton.setTitle("See all"¡, for: .normal)
        smallCapsLabels.forEach { $0.text = $0.text?¡ }
    }
}

// MARK: - Subscriptions
extension ConventionDetailsViewController {
    fileprivate func setupSubscriptions() {
        let _ = convention.fill().subscribe()

        if convention.isEnded {
            newSaleButton.isHidden = true
            newExpenseButton.isHidden = true
        }
        if !convention.isStarted {
            newSaleButton.isHidden = true
        }

        navBar.leftButton.rx.tap
            .subscribe(onNext: { ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        seeAllRecordsButton.rx.tap
            .subscribe(onNext: { [convention] in RecordsOverviewViewController.show(for: convention!) })
            .disposed(by: disposeBag)

        newSaleButton.rx.tap
            .flatMap { [convention] _ in ProductTypeListViewController.show(for: convention!) }
            .map { products, price, info in Record(products: products.map { $0.id }, price: price, info: info) }
            .flatMap { [convention] in
                convention!
                    .addRecord($0)
                    .catchErrorJustReturn(())
            }
            .subscribe()
            .disposed(by: disposeBag)

        newExpenseButton.rx.tap
            .flatMap { _ in NewExpenseViewController.show() }
            .map(Expense.init)
            .flatMap { [convention] in
                convention!
                    .addExpense($0)
                    .catchErrorJustReturn(())
            }
            .subscribe()
            .disposed(by: disposeBag)

        seeAllInfoButton.rx.tap
            .subscribe(onNext: { [convention] _ in ConventionUserInfoListViewController.show(for: convention!) })
            .disposed(by: disposeBag)

        let øcalculatedSalesTotal = convention.records
            .map { $0.map { $0.price } }
            .map { $0.reduce(Money.zero, +) }

        let øcalculatedExpensesTotal = convention.expenses
            .map { $0.map { $0.price } }
            .map { $0.reduce(Money.zero, +) }

        let øsalesTotal = Observable
            .merge(
                Observable.just(convention.recordTotal ?? Money.zero),
                øcalculatedSalesTotal
            )

        øsalesTotal
            .map { $0.toString() }
            .bind(to: salesAmountLabel.rx.text)
            .disposed(by: disposeBag)

        let øexpenseTotal = Observable
            .merge(
                Observable.just(convention.expenseTotal ?? Money.zero),
                øcalculatedExpensesTotal
            )

        øexpenseTotal
            .map { $0.toString() }
            .bind(to: expensesAmountLabel.rx.text)
            .disposed(by: disposeBag)

        Observable.combineLatest(øsalesTotal, øexpenseTotal)
            .map(-)
            .map { $0.toString() }
            .bind(to: netRevenueAmountLabel.rx.text)
            .disposed(by: disposeBag)

        Observable.combineLatest(øsalesTotal, øexpenseTotal)
            .map { $0.0 == Money.zero && $0.1 == Money.zero }
            .bind(to: revenueSection.rx.isHidden)
            .disposed(by: disposeBag)

        convention.userInfo
            .map { Array($0.prefix(2)) }
            .map {
                $0.map { info in
                    let label = UILabel()
                    label.text = info.info
                    label.textColor = ConArtist.Color.Text
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
                    label.textColor = ConArtist.Color.TextPlaceholder.withAlphaComponent(0.25)
                    label.text = "There's nothing here..."¡
                    userSuppliedInfoPreview.addArrangedSubview(label)
                }
            })
            .disposed(by: disposeBag)
    }
}

// MARK: - UITableViewDataSource
extension ConventionDetailsViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return section == 0 ? convention.extraInfo.count : 0
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if let item = convention.extraInfo.nth(indexPath.row) {
            let cell = tableView.dequeueReusableCell(withIdentifier: item.cellIdentifier, for: indexPath) as! ConventionExtraInfoTableViewCell
            cell.setup(with: item)
            return cell
        }
        return UITableViewCell()
    }
}

//MARK: - UITableViewDelegate
extension ConventionDetailsViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard let action = convention.extraInfo.nth(indexPath.row)?.action else { return }
        ConArtist.handleURL(action)
    }
}

// MARK: - Navigation
extension ConventionDetailsViewController {
    class func show(for convention: Convention) {
        let controller: ConventionDetailsViewController = ConventionDetailsViewController.instantiate(withId: ConventionDetailsViewController.ID)
        controller.convention = convention
        ConArtist.model.navigate(push: controller)
    }
}
