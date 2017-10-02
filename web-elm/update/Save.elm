module Save exposing (update)
import Http
import Json.Encode as Json
import Json.Decode as Decode

import Model exposing (Model)
import ConRequest exposing (ConRequest(..))
import Product
import ProductType
import Msg exposing (Msg(..))
import UDialog

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  Save -> update SaveTypes model
  SaveProducts ->
    case Model.validateRequest model of
      Ok _ -> (model, saveProducts model)
      Err error -> UDialog.update (ShowErrorMessage (Debug.log "Error:" error)) model
  SavePrices -> (model, Cmd.none)
  SaveTypes ->
    case Model.validateRequest model of
      Ok _ -> (model, saveTypes model)
      Err error -> UDialog.update (ShowErrorMessage (Debug.log "Error:" error)) model
  SavedProducts (Ok (Success updates)) -> (Model.cleanProducts updates model, Cmd.none)
  SavedPrices (Ok (Success updates)) -> (Model.clean updates model, Cmd.none)
  SavedTypes (Ok (Success updates)) -> update SaveProducts (Model.cleanTypes updates model)
  _ -> (model, Cmd.none)

saveProducts : Model -> Cmd Msg
saveProducts model =
  model.user.products
    |> List.filter Product.isDirty
    |> List.filterMap Product.requestFormat
    |> List.map Product.requestJson
    |> \products -> Json.object [ ("products", Json.list products) ]
    |> Http.jsonBody
    |> \body ->
      Http.request
        { method = "PUT"
        , headers = [ Http.header "Authorization" ("Bearer " ++ model.authtoken) ]
        , url = "/api/products"
        , body = body
        , expect = Http.expectJson (ConRequest.decode (Decode.list Product.decode))
        , timeout = Nothing
        , withCredentials = False }
    |> Http.send SavedProducts

saveTypes : Model -> Cmd Msg
saveTypes model =
  model.user.productTypes
    |> List.filter ProductType.isDirty
    |> List.filterMap ProductType.requestFormat
    |> List.map ProductType.requestJson
    |> \types -> Json.object [ ("types", Json.list types) ]
    |> Http.jsonBody
    |> \body ->
      Http.request
        { method = "PUT"
        , headers = [ Http.header "Authorization" ("Bearer " ++ model.authtoken) ]
        , url = "/api/types"
        , body = body
        , expect = Http.expectJson (ConRequest.decode (Decode.list ProductType.decode))
        , timeout = Nothing
        , withCredentials = False }
    |> Http.send SavedTypes
