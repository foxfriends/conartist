//  This file was automatically generated and should not be edited.

import Apollo

public final class ImageQuery: GraphQLQuery {
  /// query Image($imageId: String!) {
  ///   image(imageId: $imageId)
  /// }
  public let operationDefinition =
    "query Image($imageId: String!) { image(imageId: $imageId) }"

  public let operationName = "Image"

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

    public private(set) var resultMap: ResultMap

    public init(unsafeResultMap: ResultMap) {
      self.resultMap = unsafeResultMap
    }

    public init(image: String) {
      self.init(unsafeResultMap: ["__typename": "Query", "image": image])
    }

    public var image: String {
      get {
        return resultMap["image"]! as! String
      }
      set {
        resultMap.updateValue(newValue, forKey: "image")
      }
    }
  }
}
