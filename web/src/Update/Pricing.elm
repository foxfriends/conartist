module Update.Pricing exposing (update)
import Model exposing (Model)
import Page exposing (Page(..), Selector(..))
import Msg exposing (Msg(..))
import View.Table exposing (updateSort)
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
              | prices = Price.validateAll <| List_.flatUpdateAt
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
          | prices = Price.validateAll <| List_.flatUpdateAt
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
          | prices = Price.validateAll <| List_.updateAt
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
          | prices = Price.validateAll <| List_.updateAt
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
        , user = { user | prices = Price.validateAll <| prices ++ [ Price.new (List.length prices) ] }
        } ! []
    PricingRemove index ->
      let
        user = model.user
        prices = user.prices
      in
        { model
        | page = Pricing { page | open_selector = None }
        , user = { user | prices = Price.validateAll <| Price.removeRow index prices }
        } ! []
    SortPricingTable col ->
      { model
      | page = Pricing { page | table_sort = updateSort col page.table_sort }
      } ! []
    ReadPricingCSV -> model ! [ Files.read "pricing" ] -- TODO: implement
    WritePricingCSV ->
      let contents = model.user.prices
        |> List.filter (Price.normalize >> Maybe.map (always True) >> Maybe.withDefault False)
        |> List.sortWith (\wa -> \wb ->
          let
            a = Price.normalize wa
            b = Price.normalize wb
          in
            case compare (Maybe.withDefault 0 <| Maybe.map .type_id a) (Maybe.withDefault 0 <| Maybe.map .type_id b) of
              EQ -> case compare (Maybe.withDefault 0 <| Maybe.andThen .product_id a) (Maybe.withDefault 0 <| Maybe.andThen .product_id b) of
                EQ -> compare (Maybe.withDefault 0 <| Maybe.map .quantity a) (Maybe.withDefault 0 <| Maybe.map .quantity b)
                x -> x
              x -> x)
        |> Join.pricesWithProductsAndTypes
            model.user.productTypes
            model.user.products
        |> List.map (\p ->
               (p.productType |> Maybe.map (ProductType.normalize >> .name) |> Maybe.withDefault "")
            ++ ","
            ++ (p.product |> Maybe.map (Product.normalize >> .name) |> Maybe.withDefault "None")
            ++ ","
            ++ (p.price |> Price.normalize |> Maybe.map .quantity |> Maybe.withDefault 0 |> toString)
            ++ ","
            ++ (p.price |> Price.normalize |> Maybe.map .price |> Maybe.withDefault 0 |> toString)
            ++ "\n"
          )
        |> List.foldl (++) ""
      in model ! [ curry Files.write "pricing.csv" contents ]
    _ -> model ! []
  _ -> model ! []
