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

class ConventionSearchTableViewCell: UITableViewCell {
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
        let starred = ConArtist.model.conventions.value.contains { $0.id == convention.id }
        starButton.setImage(
            starred
                ? SVGKImage.star.uiImage.withRenderingMode(.alwaysTemplate)
                : SVGKImage.starOutline.uiImage.withRenderingMode(.alwaysTemplate),
            for: .normal
        )
        starButton.tintColor = starred
            ? .brandVariant
            : .text

        starButtonTapped = starButton.rx.tap
            .do(onNext: { [starButton] _ in // invert color of button preemptively
                starButton?.tintColor = !starred
                    ? .brandVariant
                    : .text
            })
            .flatMapLatest { _ in
                starred
                    ? ConArtist.API.GraphQL
                        .observe(mutation: AddUserConventionMutation(conId: convention.id))
                        .discard()
                    : ConArtist.API.GraphQL
                        .observe(mutation: DeleteUserConventionMutation(conId: convention.id))
                        .discard()
            }
            .subscribe(
                onNext: { _ in
                    _ = ConArtist.API.GraphQL
                        .observe(query: FullUserQuery(), cachePolicy: .fetchIgnoringCacheData)
                        .observeOn(MainScheduler.instance)
                        .map{ $0.user.fragments.fullUserFragment }
                        .subscribe(onNext: { fragment in
                            ConArtist.model.merge(graphQL: fragment)
                        })
                },
                onError: { [starButton] _ in
                    starButton?.tintColor = starred
                        ? .brandVariant
                        : .text
                    RootNavigationController.singleton.currentViewController?.showAlert(
                        title: "It seems something went wrong."¡,
                        message: "Some actions might not have been saved. Please try again later"¡
                    )
                }
            )
    }
}
