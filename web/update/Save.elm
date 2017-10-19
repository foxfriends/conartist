module Save exposing (update)
import Http
import Json.Encode as Json
import Json.Decode as Decode

import GraphQL exposing (..)
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
  SaveProducts -> model ! saveProducts model
  CreatedTypes (Ok updates) -> update SaveProducts <| Model.cleanTypes updates model
  UpdatedTypes (Ok updates) -> Model.cleanTypes updates model ! []
  CreatedProducts (Ok updates) -> Model.cleanProducts updates model ! []
  UpdatedProducts (Ok updates) -> Model.cleanProducts updates model ! []
  SavePrices ->
    case Model.validateRequest model of
      Ok _ -> model ! [ savePrices model ]
      Err error -> UDialog.update (ShowErrorMessage (Debug.log "Error:" error)) model
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
      , if List.length news > 0 then mutation CreatedTypes (createProductTypes news) model else Cmd.batch <| saveProducts model ]
  else saveProducts <| model

saveProducts : Model -> List (Cmd Msg)
saveProducts model =
  if Product.allValid model.user.products then
    let
      mods = List.filterMap Product.dirtyData model.user.products
      news = List.filterMap Product.newData model.user.products
    in
      [ if List.length mods > 0 then mutation UpdatedProducts (updateProducts mods) model else Cmd.none
      , if List.length news > 0 then mutation CreatedProducts (createProducts news) model else Cmd.none ]
  else []

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
