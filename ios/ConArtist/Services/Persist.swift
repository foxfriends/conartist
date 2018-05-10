//
//  Persist.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-05-09.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import Foundation

extension ConArtist {
    struct Persist {
        private static var CachePath: URL {
            let path = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
            return path.appendingPathComponent("ConArtist-Cache")
        }

        static func persist() {
            let encoder = JSONEncoder()
            do {
                let jsonModel = try encoder.encode(ConArtist.model)
                try jsonModel.write(to: CachePath)
                print("Model is persisted")
            } catch {
                print("FAILED TO PERSIST \(error)")
            }
        }

        static func load() -> Model {
            do {
                let jsonModel = try Data(contentsOf: CachePath)
                let decoder = JSONDecoder()
                print("Model loaded")
                return try decoder.decode(Model.self, from: jsonModel)
            } catch {
                print("FAILED TO LOAD \(error)")
                return Model()
            }
        }
    }
}
