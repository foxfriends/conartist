module UPricing exposing (update)
import Model exposing (Model)
import Page exposing (Page(..), Selector(..))
import Msg exposing (Msg(..))
import List_
import Price
import Table exposing (updateSort)

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
                | prices = List_.flatUpdateAt
                    (\p -> Price.index p == index)
                    (\p ->
                      List.filterMap identity
                        [ Just <| Price.setTypeId type_id <| Price.setProduct Nothing p
                        , Price.delete (Price.setIndex (List.length prices + 1) p) ] )
                    prices } }
            , Cmd.none )
        Nothing -> ( { model | page = Pricing { page | open_selector = None } }, Cmd.none)
    PricingProduct index product ->
      let user = model.user in
      let prices = user.prices in
        ( { model
          | page = Pricing { page | open_selector = None }
          , user = { user
            | prices = List_.flatUpdateAt
                (\p -> Price.index p == index)
                (\p ->
                  List.filterMap identity
                    [ Just <| Price.setProduct product p
                    , Price.delete (Price.setIndex (List.length prices + 1) p) ] )
                prices } }
        , Cmd.none )
    PricingPrice index price ->
      let user = model.user in
      let prices = user.prices in
        ( { model
          | user = { user
            | prices = List_.updateAt
                (\p -> Price.index p == index)
                (Price.setPrice price)
                prices } }
        , Cmd.none )
    PricingQuantity index quantity ->
      let user = model.user in
      let prices = user.prices in
        ( { model
          | user = { user
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
    SortPricingTable col ->
      ( { model
        | page = Pricing { page | table_sort = updateSort col page.table_sort } }
      , Cmd.none )
    _ -> (model, Cmd.none)
  _ -> (model, Cmd.none)
