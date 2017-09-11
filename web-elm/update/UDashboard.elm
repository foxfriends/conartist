module UDashboard exposing (update)
import Model exposing (Model)
import Msg exposing (Msg(..))

update : Msg -> Model -> Maybe (Model, Cmd Msg)
update msg model = case model.page of
  
  _ -> Nothing
