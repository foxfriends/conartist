module Update exposing (update)

import Model exposing (Model)
import Msg exposing (Msg(..))

import Load
import Save
import USignIn
import UInventory
import UPricing
import Routing
import UDialog
import UConvention

continue : (Msg -> Model -> (Model, Cmd Msg)) -> Msg -> (Model, Cmd Msg) -> (Model, Cmd Msg)
continue action msg (model, cmd) =
  let (md, cm) = action msg model in
    md ! [cmd, cm]

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  (case msg of
    Batch (first :: rest) ->
      let
        (newmodel, cmd) = update first model
        (finalmodel, morecmd) = update (Batch rest) newmodel
      in finalmodel ! [ morecmd, cmd ]
    SetDate now -> { model | now = now } ! []
    MouseMove pos -> { model | mouse = pos } ! []
    ToggleSidenav -> { model | sidenav_visible = not model.sidenav_visible } ! []
    _ -> model ! [] )
  |> continue Load.update msg
  |> continue Save.update msg
  |> continue UDialog.update msg
  |> continue Routing.update msg
  |> continue USignIn.update msg
  |> continue UInventory.update msg
  |> continue UPricing.update msg
  |> continue UConvention.update msg
