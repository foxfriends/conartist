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
    PricingProductType index type_id ->
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
    _ -> (model, Cmd.none)
  _ -> (model, Cmd.none)
