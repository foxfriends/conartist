module ProductType exposing (..)
-- TODO: remove decoder
import Json.Decode as Decode exposing (Decoder)
import Validation exposing (Validation(..), valueOf, invalidate, validate, empty)
import Either exposing (Either(..))
import List_
import Either_ exposing (both)
import MD5 exposing (hex)

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

newData : ProductType -> Maybe NewType
newData p = case p of
  New d -> Just d
  _ -> Nothing

dirtyData : ProductType -> Maybe InternalType
dirtyData p = case p of
  Dirty d -> Just d
  _ -> Nothing

normalize : ProductType -> FullType
normalize t = case t of
  Clean t -> t
  Dirty t -> FullType t.id (Either.unpack identity valueOf t.name) (both t.color) (both t.discontinued)
  New   t -> FullType -t.localId (valueOf t.name) t.color False

individualClean : List (String, FullType) -> ProductType -> ProductType
individualClean updates ptype =
  let
    replaceNew p = updates
      |> List_.find (Tuple.first >> (==) (hex <| valueOf p.name))
      |> Maybe.map (Clean << Tuple.second)
      |> Maybe.withDefault (New p)
    replaceDirty p = updates
      |> List_.find (Tuple.first >> (==) (hex <| Either.unpack identity valueOf p.name))
      |> Maybe.map (Clean << Tuple.second)
      |> Maybe.withDefault (Dirty p)
  in
    case ptype of
      Clean _ -> ptype
      Dirty p -> replaceDirty p
      New   p -> replaceNew p

clean : List (String, FullType) -> List ProductType -> List ProductType
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

validateAll : List ProductType -> List ProductType
validateAll types =
  let
    names = List.map (normalize >> .name) types
    isBad name = List.filter ((==) name) names |> List.length |> (<) 1
    rec types =
      case types of
        item :: rest ->
          case item of
            Clean i -> Clean i :: rec rest
            New i ->
              let name = valueOf i.name in
                (if name == "" then
                  New { i | name = invalidate i.name "Name is empty" }
                else if isBad name then
                  New { i | name = invalidate i.name "Name is duplicated" }
                else
                  New { i | name = validate i.name }) :: rec rest
            Dirty i ->
              case i.name of
                Left name -> Dirty i :: rec rest
                Right name -> let nameValue = valueOf name in
                  (if nameValue == "" then
                    Dirty { i | name = Right <| invalidate name "Name is empty" }
                  else if isBad nameValue then
                    Dirty { i | name = Right <| invalidate name "Name is duplicated" }
                  else
                    Dirty { i | name = Right <| validate name }) :: rec rest
        [] -> []
  in rec types

allValid : List ProductType -> Bool
allValid types =
  let isValid type_ =
    case type_ of
      New t   -> Validation.isValid t.name
      Clean _ -> True
      Dirty t -> (Either.unpack (always True) Validation.isValid t.name)
  in List.all isValid types
