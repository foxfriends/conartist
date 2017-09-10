module Update exposing (update)
import Lazy exposing (Lazy, lazy, force)

import Model exposing (Model)
import Msg exposing (Msg)

import Load
import USignIn

or_else : Lazy (Maybe a) -> Maybe a -> Maybe a
or_else d m = case m of
  Nothing -> force d
  _ -> m

unwrap_or : a -> Maybe a -> a
unwrap_or d m = case m of
  Nothing -> d
  Just v -> v

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  Load.update msg model
    |> or_else (lazy (\() -> USignIn.update msg model))
    |> unwrap_or (model, Cmd.none)
