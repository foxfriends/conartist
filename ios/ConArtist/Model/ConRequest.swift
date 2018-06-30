//
//  ConRequest.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

enum ConRequest<T: Decodable>: Decodable {
    case success(data: T)
    case failure(error: String)
    
    private enum Status: String, Codable {
        case success = "Success"
        case failure = "Failure"
    }
    
    // MARK: - Deserialization

    private enum CodingKeys: String, CodingKey {
        case status
        case data
        case error
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        switch try container.decode(Status.self, forKey: .status) {
        case .success:
            self = .success(data: try container.decode(T.self, forKey: .data))
        case .failure:
            self = .failure(error: try container.decode(String.self, forKey: .error))
        }
    }
}
