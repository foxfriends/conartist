//
//  ExpenseDetailsOverlayViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-18.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class ExpenseDetailsOverlayViewController: UIViewController {
    fileprivate static let ID = "ExpenseDetailsOverlay"
    fileprivate static let AnimationDuration = 0.25

    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var sheetView: UIView!
    @IBOutlet weak var categoryLabel: UILabel!
    @IBOutlet weak var amountLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var noteLabel: UILabel!

    @IBOutlet var smallCapsLabels: [UILabel]!

    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var backgroundButton: UIButton!

    @IBOutlet weak var bottomConstraint: NSLayoutConstraint!

    fileprivate let disposeBag = DisposeBag()

    fileprivate var expense: Expense!
    fileprivate var convention: Convention!
}

// MARK: - Lifecycle
extension ExpenseDetailsOverlayViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLocalization()
        setupSubscriptions()
        setupUI()
        bottomConstraint.constant = -sheetView.frame.height
        view.layoutIfNeeded()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        DispatchQueue.main.async {
            self.animateEntry()
        }
    }
}

// MARK: - Localization
extension ExpenseDetailsOverlayViewController {
    fileprivate func setupLocalization() {
        titleLabel.text = "Expense"¡
        for label in smallCapsLabels {
            label.text = label.text?¡
        }
        navBar.rightButtonTitle = "Edit"¡
        navBar.leftButtonTitle = "Back"¡
    }
}

// MARK: - Subscriptions
extension ExpenseDetailsOverlayViewController {
    fileprivate func setupSubscriptions() {
        Observable
            .merge(
                backgroundButton.rx.tap.discard(),
                navBar.leftButton.rx.tap.discard()
            )
            .subscribe { [weak self] _ in self?.animateExit() }
            .disposed(by: disposeBag)

        navBar.rightButton.rx.tap
            .flatMap { [unowned self] _ in NewExpenseViewController.show(editing: self.expense) }
            .map { [unowned self] category, description, price in
                let newExpense = Expense(id: self.expense.id, category: category, description: description, price: price, time: self.expense.time)
                self.expense = newExpense
                DispatchQueue.main.async { self.setupUI() }
                return newExpense
            }
            .flatMap(convention.updateExpense)
            .subscribe(
                onNext: { print("SAVED") },
                onError: { print("FAILED TO SAVE: \($0)") }
            )
            .disposed(by: disposeBag)
    }
}

// MARK: - UI
extension ExpenseDetailsOverlayViewController {
    fileprivate func setupUI() {
        if convention.isEnded {
            navBar.rightButton.isHidden = true
        }
        sheetView.layer.cornerRadius = 35
        sheetView.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
        for label in smallCapsLabels {
            label.font = label.font.usingFeatures([.smallCaps])
        }
        categoryLabel.text = expense.category
        amountLabel.font = amountLabel.font.usingFeatures([.tabularFigures])
        amountLabel.text = expense.price.toString()
        timeLabel.text = expense.time.toString("EEEE MMMM d, yyyy. h:mm a"¡)
        noteLabel.text = expense.description.isEmpty ? "Nothing to say..."¡ : expense.description
        noteLabel.textColor = expense.description.isEmpty ? ConArtist.Color.TextPlaceholder : ConArtist.Color.Text
        backgroundButton.alpha = 0
        navBar.title = convention.name
        navBar.layer.shadowOpacity = 0
    }

    fileprivate func animateEntry() {
        bottomConstraint.constant = 0
        UIView.animate(withDuration: ExpenseDetailsOverlayViewController.AnimationDuration) {
            self.backgroundButton.alpha = 1
            self.view.layoutIfNeeded()
        }
    }

    fileprivate func animateExit() {
        bottomConstraint.constant = -sheetView.frame.height
        UIView.animate(
            withDuration: ExpenseDetailsOverlayViewController.AnimationDuration,
            animations: {
                self.backgroundButton.alpha = 0
                self.view.layoutIfNeeded()
            },
            completion: { _ in
                ConArtist.model.navigate(back: 1)
            }
        )
    }
}

// MARK: - Navigation
extension ExpenseDetailsOverlayViewController {
    class func show(for expense: Expense, in convention: Convention) {
        let controller: ExpenseDetailsOverlayViewController = ExpenseDetailsOverlayViewController.instantiate(withId: ExpenseDetailsOverlayViewController.ID)
        controller.expense = expense
        controller.convention = convention
        ConArtist.model.navigate(show: controller)
    }
}
