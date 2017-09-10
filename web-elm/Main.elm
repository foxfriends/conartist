import Html exposing (Html)
import Model exposing (Model, init)
import Msg exposing (Msg)
import Update exposing (update)
import View exposing (view)
import Subscriptions exposing (subscriptions)

main : Program Never Model Msg
main = Html.program { init = init, update = update, view = view, subscriptions = subscriptions }
