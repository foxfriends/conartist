//
//  ConventionSearchTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-29.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import SVGKit
import RxSwift

class ConventionSearchTableViewCell: ConArtistTableViewCell {
    static let ID = "ConventionSearchCell"
    @IBOutlet weak var starButton: UIButton!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var locationLabel: UILabel!

    fileprivate var starButtonTapped: Disposable?

    deinit {
        starButtonTapped?.dispose()
    }
}

// MARK: - Lifecycle

extension ConventionSearchTableViewCell {
    override func prepareForReuse() {
        super.prepareForReuse()
        starButtonTapped?.dispose()
    }
}

// MARK: - Setup

extension ConventionSearchTableViewCell {
    func setup(convention: Convention) {
        nameLabel.text = convention.name
        dateLabel.text = "{} - {}"¡
            % convention.start.toString("MMM. d, yyyy"¡)
            % convention.end.toString("MMM. d, yyyy"¡)

        var starred = ConArtist.model.conventions.value.contains { $0.id == convention.id }
        setStar(starred: starred)

        starButtonTapped = starButton.rx.tap
            .do(onNext: { [weak self] _ in
                // invert color of button preemptively
                self?.setStar(starred: !starred)
            })
            .flatMapLatest { _ in
                !starred
                    ? ConArtist.API.GraphQL
                        .observe(mutation: AddUserConventionMutation(conId: convention.id))
                        .map { _ in }
                    : ConArtist.API.GraphQL
                        .observe(mutation: DeleteUserConventionMutation(conId: convention.id))
                        .map { _ in }
            }
            .subscribe(
                onNext: { _ in
                    starred = !starred
                    _ = ConArtist.API.GraphQL
                        .observe(query: FullUserQuery(), cachePolicy: .fetchIgnoringCacheData)
                        .observeOn(MainScheduler.instance)
                        .map{ $0.user.fragments.fullUserFragment }
                        .subscribe(onSuccess: { fragment in
                            ConArtist.model.merge(graphQL: fragment)
                        })
                },
                onError: { [weak self] _ in
                    self?.setStar(starred: starred)
                    RootNavigationController.singleton.currentViewController?.showAlert(
                        title: "It seems something went wrong."¡,
                        message: "Some actions might not have been saved. Please try again later"¡
                    )
                }
            )
    }

    fileprivate func setStar(starred: Bool) {
        starButton.setImage(
            starred
                ? SVGKImage.star.uiImage.withRenderingMode(.alwaysTemplate)
                : SVGKImage.starOutline.uiImage.withRenderingMode(.alwaysTemplate),
            for: .normal
        )
        starButton.tintColor = starred
            ? .brandVariant
            : .text
    }
}
