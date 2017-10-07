module UDialog exposing (update)
import Model exposing (Model)
import Msg exposing (Msg(..))
import Dialog exposing (Dialog(..))
import Delay exposing (after)
import Time exposing (millisecond)
import Dom exposing (focus)
import Task

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  CloseDialog -> ({ model | dialog = Closed model.dialog }, after 300 millisecond EmptyDialog)
  EmptyDialog -> ({ model | dialog = None }, Cmd.none)
  ShowErrorMessage err -> ({ model | dialog = Error err }, focus "dialog-focus-target" |> Task.attempt (\_ -> Ignore))
  _ -> (model, Cmd.none)
