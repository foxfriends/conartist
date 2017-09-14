module UDashboard exposing (update)
import Model exposing (Model)
import Page exposing (Page(..))
import Msg exposing (Msg(..))

update : Msg -> Model -> Maybe (Model, Cmd Msg)
update msg model = case model.page of
  Inventory page -> case msg of
    ChangeInventoryTab tab -> Just ( { model | page = Inventory { page | current_tab = tab} }, Cmd.none )
    _ -> Nothing
  _ -> Nothing
