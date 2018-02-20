//
//  UIFont+Features.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-14.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

extension UIFont {
    enum Feature {
        case smallCaps
        case tabularFigures

        fileprivate var features: [[String: Int]] {
            switch self {
            case .smallCaps:
                let upperCaseFeature = [
                    UIFontFeatureSelectorIdentifierKey: kUpperCaseSmallCapsSelector,
                    UIFontFeatureTypeIdentifierKey: kUpperCaseType
                ]
                let lowerCaseFeature = [
                    UIFontFeatureSelectorIdentifierKey: kLowerCaseSmallCapsSelector,
                    UIFontFeatureTypeIdentifierKey: kLowerCaseType
                ]
                return [upperCaseFeature, lowerCaseFeature]
            case .tabularFigures:
                let tabularFigures = [
                    UIFontFeatureSelectorIdentifierKey: kProportionalNumbersSelector,
                    UIFontFeatureTypeIdentifierKey: kNumberSpacingType
                ]
                return [tabularFigures]
            }
        }
    }

    func usingFeatures(_ features: Set<Feature>) -> UIFont {
        let descriptor = fontDescriptor.addingAttributes([UIFontDescriptorFeatureSettingsAttribute: features.flatMap { $0.features } ])
        return UIFont(descriptor: descriptor, size: pointSize)
    }

}
