module Update.Save exposing (update)
import Set
import Html exposing (Html)

import GraphQL exposing (..)
import Model.Model as Model exposing (Model)
import Model.Price as Price
import Model.Product as Product
import Model.ProductType as ProductType
import Msg exposing (Msg(..))
import Update.Dialog

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  Save -> update SaveTypes model
  SaveTypes -> saveTypes model
  SaveProducts -> saveProducts model
  SavePrices -> savePrices model
  CreatedTypes (Ok updates) -> update SaveProducts <| Model.cleanTypes updates model
  CreatedTypes (Err err) -> Update.Dialog.update (ShowErrorMessageComplex (typeUpdateError (toString err)) Ignore) model
  UpdatedTypes (Ok updates) -> Model.cleanTypes updates model ! []
  UpdatedTypes (Err err) -> Update.Dialog.update (ShowErrorMessageComplex (typeUpdateError (toString err)) Ignore) model
  CreatedProducts (Ok updates) -> update SavePrices <| Model.cleanProducts updates model
  CreatedProducts (Err err) -> Update.Dialog.update (ShowErrorMessageComplex (productUpdateError (toString err)) Ignore) model
  UpdatedProducts (Ok updates) -> Model.cleanProducts updates model ! []
  UpdatedProducts (Err err) -> Update.Dialog.update (ShowErrorMessageComplex (productUpdateError (toString err)) Ignore) model
  CreatedPrices (Ok updates) -> Model.cleanPrices updates model ! []
  CreatedPrices (Err err) -> Update.Dialog.update (ShowErrorMessageComplex (pricesUpdateError (toString err)) Ignore) model
  DeletedPrices (Ok updates) -> Model.removeDeletedPrices model ! []
  DeletedPrices (Err err) -> Update.Dialog.update (ShowErrorMessageComplex (pricesUpdateError (toString err)) Ignore) model

  _ -> model ! []

saveTypes : Model -> (Model, Cmd Msg)
saveTypes model =
  if ProductType.allValid model.user.productTypes then
    let
      mods = List.filterMap ProductType.dirtyData model.user.productTypes
      news = List.filterMap ProductType.newData model.user.productTypes
      (spm, spc) = saveProducts model
    in
      (if List.length news > 0 then model else spm) !
        [ if List.length mods > 0 then mutation UpdatedTypes (updateProductTypes mods) model else Cmd.none
        , if List.length news > 0 then mutation CreatedTypes (createProductTypes news) model else spc ]
  else
    let
      errorMessages = ProductType.errorMessages model.user.productTypes
    in
      Update.Dialog.update
        (ShowErrorMessageComplex
          (Html.div [] <|
            List.map (Html.text >> List.singleton >> Html.div []) errorMessages)
          Ignore)
        model

saveProducts : Model -> (Model, Cmd Msg)
saveProducts model =
  if Product.allValid model.user.products then
    let
      mods = List.filterMap Product.dirtyData model.user.products
      news = List.filterMap Product.newData model.user.products
      (spm, spc) = savePrices model
    in
      (if List.length news > 0 then model else spm) !
        [ if List.length mods > 0 then mutation UpdatedProducts (updateProducts mods) model else Cmd.none
        , if List.length news > 0 then mutation CreatedProducts (createProducts news) model else spc ]
  else
    let
      errorMessages = Product.errorMessages model.user.products
    in
      Update.Dialog.update
        (ShowErrorMessageComplex
          (Html.div [] <|
            List.map (Html.text >> List.singleton >> Html.div []) errorMessages)
          Ignore)
        model

savePrices : Model -> (Model, Cmd Msg)
savePrices model =
  let
    news = List.foldl Price.collectPrices [] model.user.prices
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
    model !
      [ if List.length news > 0 then mutation CreatedPrices (createPrices news) model else Cmd.none
      , if List.length dels > 0 then mutation DeletedPrices (deletePrices dels) model else Cmd.none ]
  else
    let
      errorMessages = Price.errorMessages model.user.prices
    in
      Update.Dialog.update
        (ShowErrorMessageComplex
          (Html.div [] <|
            List.map (Html.text >> List.singleton >> Html.div []) errorMessages)
          Ignore)
        model

typeUpdateError : String -> Html msg
typeUpdateError = Update.Dialog.errorWithMsg
  """
  We messed up! Your new product types weren't saved properly! Don't worry though,
  they're still safe right here. It's most likely something weird going on with
  the names. Try renaming some of the ones you changed and saving again. Also,
  send the note below to the developers so this doesn't happen to anyone else!
  """

productUpdateError : String -> Html msg
productUpdateError = Update.Dialog.errorWithMsg
  """
  We messed up! Your new products weren't saved properly! Don't worry though,
  they're still safe right here. It's most likely something weird going on with
  the names. Try renaming some of the ones you changed and saving again. Also,
  send the note below to the developers so this doesn't happen to anyone else!
  """

pricesUpdateError : String -> Html msg
pricesUpdateError = Update.Dialog.errorWithMsg
  """
  We messed up! Your new prices weren't saved properly! Don't worry though,
  they're still safe right here. It's most likely something weird going on with
  the names. Check over the numbers and see if any aren't actually numbers, or if
  you have some repeats, then try saving again. Also, send the note below to the
  developers so this doesn't happen to anyone else!
  """
