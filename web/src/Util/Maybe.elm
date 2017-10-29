module Util.Maybe exposing (..)
import Lazy exposing (Lazy, lazy, force)

orElse : Lazy (Maybe a) -> Maybe a -> Maybe a
orElse d m = case m of
  Nothing -> force d
  _ -> m

andThenWithDefault : a -> (a -> Maybe b) -> Maybe a -> Maybe b
andThenWithDefault def fn m = fn (Maybe.withDefault def m)

isSomething : Maybe a -> Bool
isSomething = Maybe.map (always True) >> Maybe.withDefault False
