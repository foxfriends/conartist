module UPricing exposing (update)
import Model exposing (Model)
import Page exposing (Page(..), Selector(..))
import Msg exposing (Msg(..))
import List_
import Price

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case model.page of
  Pricing page -> case msg of
    SelectProductType index ->
      ( { model | page = Pricing { page | open_selector = TypeSelector index } }
      , Cmd.none )
    SelectProduct index ->
      ( { model | page = Pricing { page | open_selector = ProductSelector index } }
      , Cmd.none )
    PricingProductType index type_id ->
      case type_id of
        Just type_id ->
          let user = model.user in
          let prices = user.prices in
            ( { model
              | page = Pricing { page | open_selector = None }
              , user = { user
                | prices = List_.updateAt
                    (\p -> Price.index p == index)
                    (Price.setTypeId type_id >> Price.setProduct Nothing)
                    prices } }
            , Cmd.none )
        Nothing -> ( { model | page = Pricing { page | open_selector = None } }, Cmd.none)
    PricingProduct index product ->
      let user = model.user in
      let prices = user.prices in
        ( { model
          | page = Pricing { page | open_selector = None }
          , user = { user
            | prices = List_.updateAt
                (\p -> Price.index p == index)
                (Price.setProduct product)
                prices } }
        , Cmd.none )
    PricingPrice index price ->
      let user = model.user in
      let prices = user.prices in
        ( { model
          | page = Pricing { page | open_selector = None }
          , user = { user
            | prices = List_.updateAt
                (\p -> Price.index p == index)
                (Price.setPrice price)
                prices } }
        , Cmd.none )
    PricingQuantity index quantity ->
      let user = model.user in
      let prices = user.prices in
        ( { model
          | page = Pricing { page | open_selector = None }
          , user = { user
            | prices = List_.updateAt
                (\p -> Price.index p == index)
                (Price.setQuantity quantity)
                prices } }
        , Cmd.none )
    PricingAdd ->
      let user = model.user in
      let prices = user.prices in
        ( { model
          | page = Pricing { page | open_selector = None }
          , user = { user | prices = prices ++ [ Price.new (List.length prices) ] } }
        , Cmd.none )
    PricingRemove index ->
      let user = model.user in
      let prices = user.prices in
        ( { model
          | page = Pricing { page | open_selector = None }
          , user = { user | prices = Price.removeRow index prices } }
        , Cmd.none )
    _ -> (model, Cmd.none)
  _ -> (model, Cmd.none)
