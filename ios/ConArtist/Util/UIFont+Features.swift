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

        fileprivate var features: [[UIFontDescriptor.FeatureKey: Int]] {
            switch self {
            case .smallCaps:
                let upperCaseFeature = [
                    UIFontDescriptor.FeatureKey.featureIdentifier: kUpperCaseSmallCapsSelector,
                    .typeIdentifier: kUpperCaseType
                ]
                let lowerCaseFeature = [
                    UIFontDescriptor.FeatureKey.featureIdentifier: kLowerCaseSmallCapsSelector,
                    .typeIdentifier: kLowerCaseType
                ]
                return [upperCaseFeature, lowerCaseFeature]
            case .tabularFigures:
                let tabularFigures = [
                    UIFontDescriptor.FeatureKey.featureIdentifier: kProportionalNumbersSelector,
                    .typeIdentifier: kNumberSpacingType
                ]
                return [tabularFigures]
            }
        }
    }

    func usingFeatures(_ features: Set<Feature>) -> UIFont {
        let descriptor = fontDescriptor.addingAttributes([.featureSettings: features.flatMap { $0.features } ])
        return UIFont(descriptor: descriptor, size: pointSize)
    }

}
