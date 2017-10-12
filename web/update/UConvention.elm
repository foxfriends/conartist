module UConvention exposing (update)
import Model exposing (Model)
import Page exposing (Page(..))
import Msg exposing (Msg(..))

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case model.page of
  Convention page -> case msg of
    ChangeConventionTab tab ->
      ( { model | page = Convention { page | current_tab = tab } }, Cmd.none )
    _ -> (model, Cmd.none)
  _ -> (model, Cmd.none)
