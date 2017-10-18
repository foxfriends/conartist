module ProductType exposing (..)
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Json
import Validation exposing (Validation(..), valueOf)
import Either exposing (Either(..))
import List_
import Either_ exposing (both)

type alias NewType =
  { localId: Int
  , name: Validation String
  , color: Int }

type alias FullType =
  { id: Int
  , name: String
  , color: Int
  , discontinued: Bool }

type alias InternalType =
  { id: Int
  , name: Either String (Validation String)
  , color: Either Int Int
  , discontinued: Either Bool Bool }

type ProductType
  = Clean FullType
  | Dirty InternalType
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
  Dirty t -> FullType t.id (Either.unpack identity valueOf t.name) (both t.color) (both t.discontinued)
  New   t -> FullType -t.localId (valueOf t.name) t.color False

requestFormat : ProductType -> Maybe RequestProductType
requestFormat ptype = case ptype of
  New t   -> Just <| RequestProductType "create" Nothing t.color (valueOf t.name) False
  Clean t -> Nothing
  Dirty t -> Just <| RequestProductType "modify" (Just t.id) (both t.color) (Either.unpack identity valueOf t.name) (both t.discontinued)

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
      |> List_.find (.name >> (==) (valueOf p.name))
      |> Maybe.map Clean
      |> Maybe.withDefault (New p)
  in
    case ptype of
      Clean _ -> ptype
      Dirty p -> Clean (normalize <| Dirty p)
      New   p -> replaceNew p

clean : List FullType -> List ProductType -> List ProductType
clean = List.map << individualClean

new : Int -> ProductType
new id = New (NewType id (Valid <| "New Type " ++ toString id) 0xFFFFFF)

setName : String -> ProductType -> ProductType
setName name type_ = case type_ of
  New p   -> New   { p | name = Valid name }
  Clean p -> Dirty
    { p
    | name = Right (Valid name)
    , color = Left p.color
    , discontinued = Left p.discontinued }
  Dirty p -> Dirty { p | name = Right (Valid name) }

setColor : Int -> ProductType -> ProductType
setColor color type_ = case type_ of
  New p   -> New   { p | color = color }
  Clean p -> Dirty
    { p
    | color = Right color
    , name = Left p.name
    , discontinued = Left p.discontinued }
  Dirty p -> Dirty { p | color = Right color }

toggleDiscontinued : ProductType -> Maybe ProductType
toggleDiscontinued type_ = case type_ of
  New p   -> Nothing
  Clean p -> Just <| Dirty
    { p
    | discontinued = Right (not p.discontinued)
    , name = Left p.name
    , color = Left p.color}
  Dirty p -> Just <| Dirty { p | discontinued = Either.mapRight not p.discontinued }

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
