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
      { model | page = Pricing { page | open_selector = TypeSelector index } } ! []
    SelectProduct index ->
      { model | page = Pricing { page | open_selector = ProductSelector index } } ! []
    PricingProductType index type_id ->
      case type_id of
        Just type_id ->
          let user = model.user in
          let prices = user.prices in
            { model
            | page = Pricing { page | open_selector = None }
            , user =
              { user
              | prices = List_.flatUpdateAt
                  (Price.index >> (==) index)
                  (\p ->
                    List.filterMap identity
                    [ Just <| Price.setTypeId type_id <| Price.setProduct Nothing p
                    , Price.delete (Price.setIndex (List.length prices + 1) p) ] )
                  prices
              }
            } ! []
        Nothing -> { model | page = Pricing { page | open_selector = None } } ! []
    PricingProduct index product ->
      let user = model.user in
      let prices = user.prices in
        { model
        | page = Pricing { page | open_selector = None }
        , user =
          { user
          | prices = List_.flatUpdateAt
              (Price.index >> (==) index)
              (\p ->
                List.filterMap identity
                  [ Just <| Price.setProduct product p
                  , Price.delete (Price.setIndex (List.length prices + 1) p) ] )
              prices
          }
        } ! []
    PricingPrice index price ->
      let user = model.user in
      let prices = user.prices in
        { model
        | user =
          { user
          | prices = List_.updateAt
              (Price.index >> (==) index)
              (Price.setPrice price)
              prices
          }
        } ! []
    PricingQuantity index quantity ->
      let user = model.user in
      let prices = user.prices in
        { model
        | user =
          { user
          | prices = List_.updateAt
              (Price.index >> (==) index)
              (Price.setQuantity quantity)
              prices
          }
        } ! []
    PricingAdd ->
      let user = model.user in
      let prices = user.prices in
        { model
        | page = Pricing { page | open_selector = None }
        , user = { user | prices = prices ++ [ Price.new (List.length prices) ] }
        } ! []
    PricingRemove index ->
      let user = model.user in
      let prices = user.prices in
        { model
        | page = Pricing { page | open_selector = None }
        , user = { user | prices = Price.removeRow index prices }
        } ! []
    SortPricingTable col ->
      { model
      | page = Pricing { page | table_sort = updateSort col page.table_sort }
      } ! []
    _ -> model ! []
  _ -> model ! []
