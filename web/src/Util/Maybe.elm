module Util.Maybe exposing (..)
import Lazy exposing (Lazy, lazy, force)

or_else : Lazy (Maybe a) -> Maybe a -> Maybe a
or_else d m = case m of
  Nothing -> force d
  _ -> m

and_then_with_default : a -> (a -> Maybe b) -> Maybe a -> Maybe b
and_then_with_default def fn m = fn (Maybe.withDefault def m)
