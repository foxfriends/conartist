//
//  ConventionDetailsViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-01-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

extension ConventionExtraInfo {
    var cellIdentifier: String {
        switch self {
        case .PrimaryAction: return "PrimaryAction"
        case .SecondaryAction: return "SecondaryAction"
        case .NoAction: return "NoAction"
        }
    }
}

class ConventionDetailsViewController : UIViewController {
    fileprivate static let ID = "ConventionDetails"
    fileprivate let disposeBag = DisposeBag()

    @IBOutlet weak var navBar: FakeNavBar!

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

    @IBOutlet var smallCapsLabels: [UILabel]!

    var convention: Convention!
}

// MARK: - Lifecycle
extension ConventionDetailsViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupSubscriptions()
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

        headerImage.imageURL = convention.imageURL
        infoTableView.reloadData()
        updateViewConstraints()
    }
}

// MARK: - Subscriptions
extension ConventionDetailsViewController {
    fileprivate func setupSubscriptions() {
        let _ = convention.fill().subscribe()
        navBar.leftButton.rx.tap
            .subscribe(onNext: { ConArtist.model.navigate(back: 1) })
            .disposed(by: disposeBag)

        let salesTotal = convention.records
            .map { $0.map { $0.price } }
            .map { $0.reduce(Money.zero, +) }

        let expensesTotal = convention.expenses
            .map { $0.map { $0.price } }
            .map { $0.reduce(Money.zero, +) }

        salesTotal
            .map { $0.toString() }
            .bind(to: salesAmountLabel.rx.text)
            .disposed(by: disposeBag)

        expensesTotal
            .map { $0.toString() }
            .bind(to: expensesAmountLabel.rx.text)
            .disposed(by: disposeBag)

        Observable.combineLatest(salesTotal, expensesTotal)
            .map(-)
            .map { $0.toString() }
            .bind(to: netRevenueAmountLabel.rx.text)
            .disposed(by: disposeBag)

        Observable.combineLatest(salesTotal, expensesTotal)
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
                    label.text = "There's nothing here…" // TODO: localized string
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
