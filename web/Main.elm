import Model exposing (Model)
import Init exposing (init)
import Msg exposing (Msg)
import Update exposing (update)
import View.View exposing (view)
import Subscriptions exposing (subscriptions)
import Navigation

main : Program Never Model Msg
main = Navigation.program Msg.DidNav { init = init, update = update, view = view, subscriptions = subscriptions }
