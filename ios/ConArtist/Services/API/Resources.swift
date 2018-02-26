//  This file was automatically generated and should not be edited.

import Apollo

public final class ImageQuery: GraphQLQuery {
  public static let operationString =
    "query Image($imageId: String!) {\n  image(imageId: $imageId)\n}"

  public var imageId: String

  public init(imageId: String) {
    self.imageId = imageId
  }

  public var variables: GraphQLMap? {
    return ["imageId": imageId]
  }

  public struct Data: GraphQLSelectionSet {
    public static let possibleTypes = ["Query"]

    public static let selections: [GraphQLSelection] = [
      GraphQLField("image", arguments: ["imageId": GraphQLVariable("imageId")], type: .nonNull(.scalar(String.self))),
    ]

    public var snapshot: Snapshot

    public init(snapshot: Snapshot) {
      self.snapshot = snapshot
    }

    public init(image: String) {
      self.init(snapshot: ["__typename": "Query", "image": image])
    }

    public var image: String {
      get {
        return snapshot["image"]! as! String
      }
      set {
        snapshot.updateValue(newValue, forKey: "image")
      }
    }
  }
}