module Save exposing (update)

import GraphQL exposing (..)
import Model exposing (Model)
import ConRequest exposing (ConRequest(..))
import Product
import ProductType
import Msg exposing (Msg(..))

-- TODO: messages for errors
update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  Save -> update SaveTypes model
  SaveTypes -> model ! saveTypes model
  SaveProducts -> model ! saveProducts model
  SavePrices -> model ! savePrices model
  CreatedTypes (Ok updates) -> update SaveProducts <| Model.cleanTypes updates model
  UpdatedTypes (Ok updates) -> Model.cleanTypes updates model ! []
  CreatedProducts (Ok updates) -> Model.cleanProducts updates model ! []
  UpdatedProducts (Ok updates) -> Model.cleanProducts updates model ! []
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

savePrices : Model -> List (Cmd Msg)
savePrices model = []
