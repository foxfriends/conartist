module UDialog exposing (update)
import Delay exposing (after)
import Time exposing (millisecond)
import Dom exposing (focus)
import Task
import Http
import Json.Encode as Json
import Json.Decode as Decode

import GraphQL exposing (query, getConventionPage)
import Model exposing (Model)
import Msg exposing (Msg(..))
import Dialog exposing (Dialog(..))
import Convention exposing (Convention(..))
import ConRequest

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  CloseDialog -> { model | dialog = Closed model.dialog } ! [ after 300 millisecond EmptyDialog ]
  EmptyDialog -> { model | dialog = None } ! []
  ShowErrorMessage err -> { model | dialog = Error err } ! [ focusClose ]
  OpenChooseConvention -> { model | dialog = ChooseConvention { data = [], pages = 0, page = 0 } } ![ focusClose, loadConventions model 0 ]
  DialogPage offset ->
    case model.dialog of
      ChooseConvention { data, pages, page } ->
        { model
        | dialog = ChooseConvention { data = data, pages = pages, page = (page + offset) }
        } ! [ loadConventions model (page + offset) ]
      _ -> model ! []
  AddConvention con ->
    let user = model.user in
    if user.keys > 0 then
      { model
      | user =
        { user
        | conventions = Meta con :: user.conventions
        , keys = user.keys - 1
        }
      } ! [ purchaseConvention model con.code ]
    else model ! [] -- silent fail because the button should be disabled
  _ -> model ! []

focusClose : Cmd Msg
focusClose = focus "dialog-focus-target" |> Task.attempt (always Ignore)

loadConventions : Model -> Int -> Cmd Msg
loadConventions = flip (query DidLoadChooseConvention << (flip getConventionPage 5))

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
