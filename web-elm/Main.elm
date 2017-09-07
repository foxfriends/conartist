import Html exposing (Html)
import Model exposing (Model, model)
import Update exposing (Msg, update)
import View exposing (view)

main : Program Never Model Msg
main = Html.beginnerProgram { model = model, update = update, view = view }
