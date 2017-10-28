import Model.Model exposing (Model)
import Model.Init exposing (init)
import Update.Update exposing (update)
import View.View exposing (view)
import Msg exposing (Msg)
import Subscriptions exposing (subscriptions)
import Navigation

main : Program Never Model Msg
main = Navigation.program Msg.DidNav { init = init, update = update, view = view, subscriptions = subscriptions }
