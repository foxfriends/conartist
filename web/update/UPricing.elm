module UPricing exposing (update)
import Model exposing (Model)
import Page exposing (Page(..), Selector(..))
import Msg exposing (Msg(..))
import Table exposing (updateSort)
import Join
import ProductType
import Product
import Price
import List_
import Files


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
          let
            user = model.user
            prices = user.prices
          in
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
      let
        user = model.user
        prices = user.prices
      in
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
      let
        user = model.user
        prices = user.prices
      in
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
      let
        user = model.user
        prices = user.prices
      in
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
      let
        user = model.user
        prices = user.prices
      in
        { model
        | page = Pricing { page | open_selector = None }
        , user = { user | prices = prices ++ [ Price.new (List.length prices) ] }
        } ! []
    PricingRemove index ->
      let
        user = model.user
        prices = user.prices
      in
        { model
        | page = Pricing { page | open_selector = None }
        , user = { user | prices = Price.removeRow index prices }
        } ! []
    SortPricingTable col ->
      { model
      | page = Pricing { page | table_sort = updateSort col page.table_sort }
      } ! []
    ReadPricingCSV -> model ! [ Files.read "pricing" ]
    WritePricingCSV ->
      let contents = model.user.prices
        |> List.filterMap Price.normalize
        |> List.sortWith (\a -> \b -> case compare (Maybe.withDefault 0 a.type_id) (Maybe.withDefault 0 b.type_id) of
          EQ -> case compare (Maybe.withDefault 0 a.product_id) (Maybe.withDefault 0 b.product_id) of
            EQ -> compare a.quantity b.quantity
            x -> x
          x -> x)
        |> Join.pricesWithProductsAndTypes
            (List.map ProductType.normalize model.user.productTypes)
            (List.map Product.normalize model.user.products)
        |> List.map (\p ->
               (p.product_type |> Maybe.map .name |> Maybe.withDefault "")
            ++ ","
            ++ (p.product |> Maybe.map .name |> Maybe.withDefault "None")
            ++ ","
            ++ toString p.quantity
            ++ ","
            ++ (toString <| Price.priceFloat p.price)
            ++ "\n"
          )
        |> List.foldl (++) ""
      in model ! [ curry Files.write "pricing.csv" contents ]
    _ -> model ! []
  _ -> model ! []
