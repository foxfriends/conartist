module Validation exposing (..)

type Validation a
  = Valid a
  | Invalid a String
  | Empty a String

valueOf : Validation a -> a
valueOf v = case v of
  Valid a -> a
  Invalid a _ -> a
  Empty a _ -> a

errorFor : Validation a -> Maybe String
errorFor v = case v of
  Valid _ -> Nothing
  Invalid _ e -> Just e
  Empty a e -> Just e

map : (a -> b) -> Validation a -> Validation b
map f v = case v of
  Valid a -> Valid (f a)
  Invalid a e -> Invalid (f a) e
  Empty a e -> Empty (f a) e

toResult : Validation a -> Result String a
toResult v = case v of
  Valid a -> Ok a
  Invalid _ e -> Err e
  Empty _ e -> Err e

isValid : Validation a -> Bool
isValid v = case v of
  Valid _ -> True
  _ -> False

isInvalid : Validation a -> Bool
isInvalid v = case v of
  Invalid _ _ -> True
  _ -> False

isEmpty : Validation a -> Bool
isEmpty v = case v of
  Empty _ _ -> True
  _ -> False

validate : Validation a -> Validation a
validate v = case v of
  Valid a -> Valid a
  Invalid a _ -> Valid a
  Empty a _ -> Valid a

invalidate : Validation a -> String -> Validation a
invalidate v = case v of
  Valid a -> Invalid a
  Invalid a _ -> Invalid a
  Empty a e -> Invalid a

empty : Validation a -> String -> Validation a
empty v = case v of
  Valid a -> Empty a
  Invalid a _ -> Empty a
  Empty a e -> Empty a
