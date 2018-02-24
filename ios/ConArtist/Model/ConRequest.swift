//
//  ConRequest.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import Gloss

enum ConRequest<T>: JSONDecodable {
    case success(data: T)
    case failure(error: String)
    
    private enum Status: String {
        case Success, Failure
    }
    
    // MARK: - Deserialization
    
    init?(json: JSON) {
        guard let status: Status = "status" <~~ json else {
            self = .failure(error: "Invalid response format received")
            return
        }
        
        switch status {
        case .Success:
            guard let data: T = "data" <~~ json else {
                self = .failure(error: "Response data was not of the expected type")
                return
            }
            self = .success(data: data)
        case .Failure:
            self = .failure(error: "error" <~~ json ?? "")
        }
    }
}
