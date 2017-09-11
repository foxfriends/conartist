module Update exposing (update)
import Lazy exposing (lazy)

import Model exposing (Model)
import Msg exposing (Msg)

import Load
import USignIn
import UDashboard
import Routing
import Maybe_ exposing (..)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  Load.update msg model
    |> or_else (lazy (\() -> Routing.update msg model))
    |> or_else (lazy (\() -> USignIn.update msg model))
    |> or_else (lazy (\() -> UDashboard.update msg model))
    |> unwrap_or (model, Cmd.none)
