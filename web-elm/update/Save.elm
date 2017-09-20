module Save exposing (update)
import Http
import Json.Encode as Json
import Json.Decode as Decode

import Model exposing (Model)
import ConRequest exposing (ConRequest(..))
import Product
import Msg exposing (Msg(..))

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  SaveProducts -> (model, saveProducts model)
  SavePrices -> (model, Cmd.none)
  SaveTypes -> (model, Cmd.none)
  SavedProducts (Ok (Success updates)) -> (Model.cleanProducts updates model, Cmd.none)
  SavedPrices (Ok (Success updates)) -> (Model.clean updates model, Cmd.none)
  SavedTypes (Ok (Success updates)) -> (Model.clean updates model, Cmd.none)
  _ -> (model, Cmd.none)

saveProducts : Model -> Cmd Msg
saveProducts model =
  model.user.products
    |> List.filter Product.isDirty
    |> List.map Product.requestFormat
    |> List.map Product.requestJson
    |> \products -> Json.object [ ("products", Json.list products) ]
    |> Http.jsonBody
    |> \body ->
      Http.request
        { method = "PUT"
        , headers = [ Http.header "Authorization" <| "Bearer " ++ model.authtoken ]
        , url = "/api/products"
        , body = body
        , expect = Http.expectJson (Decode.field "products" (ConRequest.decode (Decode.list Product.decode)))
        , timeout = Nothing
        , withCredentials = False}
    |> Http.send SavedProducts
