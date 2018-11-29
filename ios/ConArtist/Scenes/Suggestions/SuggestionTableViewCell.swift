//
//  SuggestionTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-11-28.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import SVGKit

class SuggestionTableViewCell: UITableViewCell {
    static let ID: String = "SuggestionCell"
    private static let ThumbsUpImage = SVGKImage.thumbUp.uiImage.withRenderingMode(.alwaysTemplate)

    @IBOutlet weak var suggestionTextLabel: UILabel!
    @IBOutlet weak var rankingLabel: UILabel!
    @IBOutlet weak var votedIcon: UIImageView!
}

// MARK: - Setup

extension SuggestionTableViewCell {
    func setup(suggestion: Suggestion) {
        suggestionTextLabel.text = suggestion.suggestion
        votedIcon.image = SuggestionTableViewCell.ThumbsUpImage
        votedIcon.tintColor = suggestion.voted ? .success : .text
        rankingLabel.text = "\(suggestion.ranking)"
    }
}
