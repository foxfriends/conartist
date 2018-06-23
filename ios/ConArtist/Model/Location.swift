//
//  Location.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-06-22.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import MapKit

struct Location: Codable {
    let latitude: Double
    let longitude: Double

    /// The location as a CLLocationCoordinate2D
    var clLocation: CLLocationCoordinate2D {
        return CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
}
