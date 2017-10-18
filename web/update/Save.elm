module Save exposing (update)
import Http
import Json.Encode as Json
import Json.Decode as Decode

import GraphQL exposing (mutation, createProductTypes, updateProductTypes)
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
  SaveTypes -> model ! saveTypes model
  UpdatedTypes (Ok updates) -> Model.cleanTypes updates model ! []
  CreatedTypes (Ok updates) -> Model.cleanTypes updates model ! []
  SaveProducts ->
    case Model.validateRequest model of
      Ok _ -> model ! [ saveProducts model ]
      Err error -> UDialog.update (ShowErrorMessage (Debug.log "Error:" error)) model
  SavePrices ->
    case Model.validateRequest model of
      Ok _ -> model ! [ savePrices model ]
      Err error -> UDialog.update (ShowErrorMessage (Debug.log "Error:" error)) model
  SavedProducts (Ok (Success updates)) -> update SavePrices (Model.cleanProducts updates model)
  SavedPrices (Ok (Success updates)) -> Model.cleanPrices updates model ! []
  _ -> model ! []

saveTypes : Model -> List (Cmd Msg)
saveTypes model =
  if ProductType.allValid model.user.productTypes then
    let
      mods = List.filterMap ProductType.dirtyData model.user.productTypes
      news = List.filterMap ProductType.newData model.user.productTypes
    in
      [ if List.length mods > 0 then mutation UpdatedTypes (updateProductTypes mods) model else Cmd.none
      , if List.length news > 0 then mutation CreatedTypes (createProductTypes news) model else Cmd.none ]
  else []

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
