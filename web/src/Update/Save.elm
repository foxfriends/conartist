module Update.Save exposing (update)

import GraphQL exposing (..)
import Model exposing (Model)
import Price
import Product
import ProductType
import Set
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
  CreatedProducts (Ok updates) -> update SavePrices <| Model.cleanProducts updates model
  UpdatedProducts (Ok updates) -> Model.cleanProducts updates model ! []
  CreatedPrices (Ok updates) -> Model.cleanPrices updates model ! []
  DeletedPrices (Ok updates) -> Model.removeDeletedPrices model ! []
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
  else []

saveProducts : Model -> List (Cmd Msg)
saveProducts model =
  if Product.allValid model.user.products then
    let
      mods = List.filterMap Product.dirtyData model.user.products
      news = List.filterMap Product.newData model.user.products
    in
      [ if List.length mods > 0 then mutation UpdatedProducts (updateProducts mods) model else Cmd.none
      , if List.length news > 0 then mutation CreatedProducts (createProducts news) model else Cmd.batch <| savePrices model ]
  else []

savePrices : Model -> List (Cmd Msg)
savePrices model =
  let
    news =  List.foldl Price.collectPrices [] model.user.prices
      |> List.filter Tuple.first
      |> List.map Tuple.second
    keep = Set.fromList <| List.filterMap (Price.normalize >> Maybe.map (\p -> (p.type_id, p.product_id |> Maybe.withDefault 0))) model.user.prices
    delSet = Set.fromList
      <| List.filter (not << flip Set.member keep)
      <| List.map (Tuple.mapSecond (Maybe.withDefault 0))
      <| List.filterMap Price.deletedData model.user.prices
    dels = List.map (Tuple.mapSecond (\p -> if p == 0 then Nothing else Just p)) <| Set.toList delSet
  in
  if Price.allValid model.user.prices then
    [ if List.length news > 0 then mutation CreatedPrices (createPrices news) model else Cmd.none
    , if List.length dels > 0 then mutation DeletedPrices (deletePrices dels) model else Cmd.none ]
  else []
