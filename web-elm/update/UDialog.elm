module UDialog exposing (update)
import Delay exposing (after)
import Time exposing (millisecond)
import Dom exposing (focus)
import Task
import Http

import Model exposing (Model)
import Msg exposing (Msg(..))
import Dialog exposing (Dialog(..))
import Convention
import ConRequest

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  CloseDialog -> ({ model | dialog = Closed model.dialog }, after 300 millisecond EmptyDialog)
  EmptyDialog -> ({ model | dialog = None }, Cmd.none)
  ShowErrorMessage err -> ({ model | dialog = Error err }, focusClose)
  OpenChooseConvention -> ({ model | dialog = Loading (ChooseConvention [] 0 0) }, Cmd.batch [ focusClose, loadConventions model 0 ])
  DialogPage offset ->
    case model.dialog of
      ChooseConvention cons pages page ->
        ( { model
          | dialog = ChooseConvention cons pages (page + offset) }, loadConventions model (page + offset))
      _ -> model ! []
  _ -> model ! []

focusClose : Cmd Msg
focusClose = focus "dialog-focus-target" |> Task.attempt (always Ignore)

loadConventions : Model -> Int -> Cmd Msg
loadConventions model page =
  Http.send DidLoadChooseConvention <| Http.request
    { method = "Get"
    , headers = [ Http.header "Authorization" ("Bearer " ++ model.authtoken) ]
    , url = "/api/cons/" ++ toString page ++ "/5"
    , body = Http.emptyBody
    , expect = Http.expectJson (ConRequest.decode (ConRequest.decodePagination Convention.decode))
    , timeout = Nothing
    , withCredentials = False }
