module Util.Result exposing (isErr)

isErr : Result a b -> Bool
isErr v = case v of
  Ok _ -> False
  Err _ -> True
