module Model.ProductType exposing (..)
{-| Defines the ProductType type from the ConArtist data model.

# Definition
@docs ProductType, FullType, NewType
-}
import Either exposing (Either(..))
import Dict
import MD5 exposing (hex)

import Model.Validation as Validation exposing (Validation(..), valueOf, invalidate, validate, empty)
import Model.ErrorString exposing (..)
import Util.List as List
import Util.Either exposing (both)

{-| A subset of the full data required to represent a `ProductType` the server does not yet know of.
-}
type alias NewType =
  { localId: Int
  , name: Validation String
  , color: Int }

{-| The complete data to represent a fresh `ProductType` from the server
-}
type alias FullType =
  { id: Int
  , name: String
  , color: Int
  , discontinued: Bool }

{-| A more complex representation of the ProductType to determine which components have been
modified by a user. Not to be used in the View functions (use accessors instead)
-}
type alias InternalType =
  { id: Int
  , name: Either String (Validation String)
  , color: Either Int Int
  , discontinued: Either Bool Bool }

{-| A ProductType can be in any of 3 states, depending on the user's modifications.
-}
type ProductType
  = Clean FullType
  | Dirty InternalType
  | New NewType

isDirty : ProductType -> Bool
isDirty pt = case pt of
  Clean _ -> False
  Dirty _ -> True
  New   _ -> True

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
      |> List.find (Tuple.first >> (==) (hex <| valueOf p.name))
      |> Maybe.map (Clean << Tuple.second)
      |> Maybe.withDefault (New p)
    replaceDirty p = updates
      |> List.find (Tuple.first >> (==) (hex <| Either.unpack identity valueOf p.name))
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
    check type_ =
      case type_ of
        Clean i -> Clean i
        New i -> New
          { i
          | name = let v = valueOf i.name in
             if v == "" then
               invalidate emptyName i.name
             else if isBad v then
               invalidate duplicateName i.name
             else
               validate i.name
          }
        Dirty i -> Dirty
          { i
          | name = let v = Either.unpack identity valueOf i.name in
              if v == "" then
                Either.mapRight (invalidate emptyName) i.name
              else if isBad v then
                Either.mapRight (invalidate duplicateName) i.name
              else
                Either.mapRight validate i.name
          }
  in List.map check types

errorMessages : List ProductType -> List String
errorMessages types =
  let
    names q = if q == 1 then "a name" else " names"
    is q = if q == 1 then "is" else "are"
    emptyMessage q = toString q ++ " of your product types " ++ is q ++ " missing " ++ names q ++ "."
    nameError name =
      case Validation.errorFor name of
        Just err ->
          if err == emptyName then
            Just (emptyMessage 1)
          else if err == duplicateName then
            Just <| "The product type named \"" ++ valueOf name ++ "\" is duplicated."
          else Nothing
        _ -> Nothing
    errorMessage type_ =
      case type_ of
        New { name } -> nameError name
        Dirty { name } -> Either.unpack (always Nothing) nameError name
        _ -> Nothing
    collect type_ messages =
      case errorMessage type_ of
        Just err ->
          Dict.update
            err
            (Maybe.map ((+) 1) >> Maybe.withDefault 1 >> Just)
            messages
        Nothing -> messages
  in
    List.foldl collect Dict.empty types
      |> Dict.toList
      |> List.map (\(m, q) ->
        if m == (emptyMessage 1) then
          emptyMessage q
        else
          m)

allValid : List ProductType -> Bool
allValid types =
  let isValid type_ =
    case type_ of
      New t   -> Validation.isValid t.name
      Clean _ -> True
      Dirty t -> (Either.unpack (always True) Validation.isValid t.name)
  in List.all isValid types

hash : ProductType -> String
hash pt = case pt of
  New p -> MD5.hex (valueOf p.name)
  Dirty p -> MD5.hex <| (Either.unpack identity valueOf p.name)
  Clean p -> ""
