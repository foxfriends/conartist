module Util.Result exposing (isErr)
{-| Some helpers for working with Results
-}
isErr : Result a b -> Bool
isErr v = case v of
  Ok _ -> False
  Err _ -> True
