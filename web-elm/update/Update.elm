module Update exposing (update)

import Model exposing (Model)
import Msg exposing (Msg(..))

import Load
import USignIn
import UDashboard
import UInventory
import Routing

continue : (Msg -> Model -> (Model, Cmd Msg)) -> Msg -> (Model, Cmd Msg) -> (Model, Cmd Msg)
continue action msg (model, cmd) =
  let (md, cm) = action msg model in
    (md, Cmd.batch [cmd, cm])

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  (case msg of
    Batch (first :: rest) ->
      let (newmodel, cmd) = update first model in
      let (finalmodel, morecmd) = update (Batch rest) newmodel in
        (finalmodel, Cmd.batch [ morecmd, cmd ])
    SetDate now -> ({ model | now = now }, Cmd.none)
    ToggleSidenav -> ({ model | sidenav_visible = not model.sidenav_visible }, Cmd.none)
    _ -> (model, Cmd.none))
  |> continue Load.update msg
  |> continue Routing.update msg
  |> continue USignIn.update msg
  |> continue UDashboard.update msg
  |> continue UInventory.update msg
