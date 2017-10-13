module Save exposing (update)
import Http
import Json.Encode as Json
import Json.Decode as Decode

import Model exposing (Model)
import ConRequest exposing (ConRequest(..))
import Product
import ProductType
import Price
import Msg exposing (Msg(..))
import UDialog

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  Save -> update SaveTypes model
  SaveTypes ->
    case Model.validateRequest model of
      Ok _ -> model ! [ saveTypes model ]
      Err error -> UDialog.update (ShowErrorMessage (Debug.log "Error:" error)) model
  SaveProducts ->
    case Model.validateRequest model of
      Ok _ -> model ! [ saveProducts model ]
      Err error -> UDialog.update (ShowErrorMessage (Debug.log "Error:" error)) model
  SavePrices ->
    case Model.validateRequest model of
      Ok _ -> model ! [ savePrices model ]
      Err error -> UDialog.update (ShowErrorMessage (Debug.log "Error:" error)) model
  SavedTypes (Ok (Success updates)) -> update SaveProducts (Model.cleanTypes updates model)
  SavedProducts (Ok (Success updates)) -> update SavePrices (Model.cleanProducts updates model)
  SavedPrices (Ok (Success updates)) -> Model.cleanPrices updates model ! []
  _ -> model ! []

saveTypes : Model -> Cmd Msg
saveTypes model =
  model.user.productTypes
    |> List.filter ProductType.isDirty
    |> List.filterMap ProductType.requestFormat
    |> List.map ProductType.requestJson
    |> Json.object << List.singleton << (,) "types" << Json.list
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

saveProducts : Model -> Cmd Msg
saveProducts model =
  model.user.products
    |> List.filter Product.isDirty
    |> List.filterMap Product.requestFormat
    |> List.map Product.requestJson
    |> Json.object << List.singleton << (,) "products" << Json.list
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

savePrices : Model -> Cmd Msg
savePrices model =
  model.user.prices
    |> List.foldl Price.requestFormat []
    |> List.map Price.requestJson
    |> Json.object << List.singleton << (,) "prices" << Json.list
    |> Http.jsonBody
    |> \body ->
      Http.request
        { method = "PUT"
        , headers = [ Http.header "Authorization" ("Bearer " ++ model.authtoken) ]
        , url = "/api/prices"
        , body = body
        , expect = Http.expectJson (ConRequest.decode (Decode.list Price.decode))
        , timeout = Nothing
        , withCredentials = False }
    |> Http.send SavedPrices
