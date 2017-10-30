module Update.Actions exposing (..)
import Http
import Json.Decode as Decode
import Html
import Html.Attributes exposing (href)
import Html.Events exposing (onWithOptions)

import Model.Model exposing (Model)
import Model.Convention as Convention
import Msg exposing (Msg(..))
import Paths exposing (signInPath)
import Util.List as List
import GraphQL exposing (query, getFullConvention)
import Model.ConRequest as ConRequest

fillConvention : Model -> String -> Cmd Msg
fillConvention model code =
  case List.find (Convention.asMeta >> .code >> (==) code) model.user.conventions of
    -- TODO: this will not update a convention if it has changed between now and
    --       the next time the conventions page is opened
    --       need to get some sort of notes from server when things change?
    Just (Convention.Full _) -> Cmd.none
    _ -> query DidLoadConvention (getFullConvention code) model

reauthorize : Model -> Cmd Msg
reauthorize model =
  Http.send Reauthorized <|
    Http.request
      { method = "Get"
      , headers = [ Http.header "Authorization" ("Bearer " ++ model.authtoken) ]
      , url = "/api/auth/"
      , body = Http.emptyBody
      , expect = Http.expectJson (ConRequest.decode Decode.string)
      , timeout = Nothing
      , withCredentials = False }

doSignOut : List (Html.Attribute Msg)
doSignOut =
  let
    options =
      { stopPropagation = False
      , preventDefault = True }
    url = signInPath
  in
     [ onWithOptions "click" options (Decode.succeed <| DoSignOut )
     , href url ]
