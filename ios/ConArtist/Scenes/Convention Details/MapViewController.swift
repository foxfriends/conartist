//
//  MapViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-06-22.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import MapKit
import RxSwift

class MapViewController: UIViewController {
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var mapView: MKMapView!

    fileprivate var location: Location!
    fileprivate var locationName: String!
    fileprivate let disposeBag = DisposeBag()
}

// MARK: - Lifecycle

extension MapViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        let annotation = MKPointAnnotation()
        annotation.coordinate = location.clLocation
        annotation.title = locationName
        mapView.addAnnotation(annotation)
        mapView.region = MKCoordinateRegion(
            center: location.clLocation,
            span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)
        )

        navBar.title = locationName
        setupSubscriptions()
        setupLocalization()
    }
}

// MARK: - Subscriptions

extension MapViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { _ in
                ConArtist.model.navigate(back: 1)
            })
            .disposed(by: disposeBag)
    }
}

// MARK: - Localization

extension MapViewController {
    fileprivate func setupLocalization() {
        navBar.leftButtonTitle = navBar.leftButtonTitle?¡
    }
}

// MARK: - Navigations

extension MapViewController: ViewControllerNavigation {
    static let Storyboard: Storyboard = .convention
    static let ID = "Map"

    static func show(location: Location, name: String) {
        let controller = instantiate()
        controller.location = location
        controller.locationName = name
        ConArtist.model.navigate(push: controller)
    }
}
