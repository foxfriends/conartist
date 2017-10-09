module UDashboard exposing (update)
import Http
import Json.Encode as Json
import Json.Decode as Decode

import Model exposing (Model)
import Msg exposing (Msg(..))
import Convention exposing (Convention(..))
import ConRequest

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    AddConvention con ->
      let user = model.user in
      { model | user =  { user
                        | conventions = Meta con :: user.conventions
                        , keys = user.keys - 1 } } ! [ purchaseConvention model con.code ]
    _ -> model ! []

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
