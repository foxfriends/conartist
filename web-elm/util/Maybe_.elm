module Maybe_ exposing (..)
import Lazy exposing (Lazy, lazy, force)

or_else : Lazy (Maybe a) -> Maybe a -> Maybe a
or_else d m = case m of
  Nothing -> force d
  _ -> m

unwrap_or : a -> Maybe a -> a
unwrap_or d m = case m of
  Nothing -> d
  Just v -> v
