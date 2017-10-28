module Update.Update exposing (update)

import Model.Model exposing (Model)
import Msg exposing (Msg(..))

import Routing
import Update.Load
import Update.Save
import Update.SignIn
import Update.Inventory
import Update.Pricing
import Update.Dialog
import Update.Convention

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
  |> continue Update.Load.update msg
  |> continue Update.Save.update msg
  |> continue Update.Dialog.update msg
  |> continue Routing.update msg
  |> continue Update.SignIn.update msg
  |> continue Update.Inventory.update msg
  |> continue Update.Pricing.update msg
  |> continue Update.Convention.update msg
