module Util.Util exposing (..)
{-| Generic utility functions
-}

toInt : String -> Result String Int
toInt str = case str of
  "-" -> Err "Not a number"
  "+" -> Err "Not a number"
  _   -> String.toInt str
