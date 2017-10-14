module ProductType exposing (..)
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Json
import List_

type alias NewType =
  { localId: Int
  , name: String
  , color: Int }

type alias FullType =
  { id: Int
  , name: String
  , color: Int
  , discontinued: Bool }

type ProductType
  = Clean FullType
  | Dirty FullType
  | New NewType

type alias RequestProductType =
  { kind: String
  , id: Maybe Int
  , color: Int
  , name: String
  , discontinued: Bool }

isDirty : ProductType -> Bool
isDirty pt = case pt of
  Clean _ -> False
  Dirty _ -> True
  New   _ -> True

decode : Decoder FullType
decode =
  Decode.map4 FullType
    (Decode.field "id" Decode.int)
    (Decode.field "name" Decode.string)
    (Decode.field "color" Decode.int)
    (Decode.field "discontinued" Decode.bool)

normalize : ProductType -> FullType
normalize t = case t of
  Clean t -> t
  Dirty t -> t
  New   t -> FullType -t.localId t.name t.color False

requestFormat : ProductType -> Maybe RequestProductType
requestFormat ptype = case ptype of
  New t   -> Just <| RequestProductType "create" Nothing t.color t.name False
  Clean t -> Nothing
  Dirty t -> Just <| RequestProductType "modify" (Just t.id) t.color t.name t.discontinued

requestJson : RequestProductType -> Json.Value
requestJson request = Json.object
  [ ("kind", Json.string request.kind)
  , ("id", request.id |> Maybe.map Json.int |> Maybe.withDefault Json.null )
  , ("name", Json.string request.name)
  , ("color", Json.int request.color)
  , ("discontinued", Json.bool request.discontinued) ]

individualClean : List FullType -> ProductType -> ProductType
individualClean updates ptype =
  let replaceNew p =
    updates
      |> List_.find (.name >> (==) p.name)
      |> Maybe.map Clean
      |> Maybe.withDefault (New p)
  in
    case ptype of
      Clean _ -> ptype
      Dirty p -> Clean p
      New   p -> replaceNew p

clean : List FullType -> List ProductType -> List ProductType
clean = List.map << individualClean

new : Int -> ProductType
new id = New (NewType id ("New Type " ++ toString id) 0xFFFFFF)

setName : String -> ProductType -> ProductType
setName name type_ = case type_ of
  New p   -> New   { p | name = name }
  Clean p -> Dirty { p | name = name }
  Dirty p -> Dirty { p | name = name }

setColor : Int -> ProductType -> ProductType
setColor color type_ = case type_ of
  New p   -> New   { p | color = color }
  Clean p -> Dirty { p | color = color }
  Dirty p -> Dirty { p | color = color }

toggleDiscontinued : ProductType -> Maybe ProductType
toggleDiscontinued type_ = case type_ of
  New p   -> Nothing
  Clean p -> Just <| Dirty { p | discontinued = not p.discontinued }
  Dirty p -> Just <| Dirty { p | discontinued = not p.discontinued }

validateRequest : List ProductType -> Result String (List ProductType)
validateRequest types =
  let validate types bad =
    case types of
      item :: rest ->
        let { name } = normalize item in
          if name == "" then
            Err "You cannot leave a product type's name blank!"
          else if List.member name bad then
            Err ("You have two product types named " ++ name ++ ". Please rename one of them before you save! (Note: one of them might be discontinued)")
          else
            validate rest (name :: bad)
              |> Result.andThen ((::) item >> Ok)
      [] -> Ok []
  in validate types []