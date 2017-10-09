module UDialog exposing (update)
import Delay exposing (after)
import Time exposing (millisecond)
import Dom exposing (focus)
import Task
import Http
import Json.Encode as Json
import Json.Decode as Decode

import Model exposing (Model)
import Msg exposing (Msg(..))
import Dialog exposing (Dialog(..))
import Convention exposing (Convention(..))
import ConRequest

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  CloseDialog -> ({ model | dialog = Closed model.dialog }, after 300 millisecond EmptyDialog)
  EmptyDialog -> ({ model | dialog = None }, Cmd.none)
  ShowErrorMessage err -> ({ model | dialog = Error err }, focusClose)
  OpenChooseConvention -> ({ model | dialog = ChooseConvention { cons = [], pages = 0, page = 0 } }, Cmd.batch [ focusClose, loadConventions model 0 ])
  DialogPage offset ->
    case model.dialog of
      ChooseConvention { cons, pages, page } ->
        ( { model
          | dialog = ChooseConvention { cons = cons, pages = pages, page = (page + offset) } }, loadConventions model (page + offset))
      _ -> model ! []
  AddConvention con ->
    let user = model.user in
    if user.keys > 0 then
      { model | user =  { user
                        | conventions = Meta con :: user.conventions
                        , keys = user.keys - 1 } } ! [ purchaseConvention model con.code ]
    else model ! [] -- silent fail because the button should be disabled
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

purchaseConvention : Model -> String -> Cmd Msg
purchaseConvention model code =
  Http.send AddedConvention <|
    Http.request
      { method = "PUT"
      , headers = [ Http.header "Authorization" ("Bearer " ++ model.authtoken) ]
      , url = "/api/cons"
      , body = Http.jsonBody <|
        Json.object
          [ ( "conventions"
            , Json.list
              [Json.object
                [ ("type", Json.string "add")
                , ("code", Json.string code ) ] ] ) ]
      , expect = Http.expectJson (ConRequest.decode (Decode.succeed ()))
      , timeout = Nothing
      , withCredentials = False }
