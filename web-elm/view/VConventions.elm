module VConventions exposing (view)
import Html exposing (Html, div, text, span)
import Html.Attributes exposing (class, tabindex)
import Html.Events exposing (onClick)

import Model exposing (Model)
import Convention exposing (Convention, MetaConvention)
import Msg exposing (Msg(..))
import Routing exposing (conventionPath)
import Table exposing (tableHeader, tableRow)
import Fancy exposing (ButtonStyle(..), TooltipAlignment(..))

view : Model -> Html Msg
view model =
  div [ class "conventions" ]
    [ div [ class "conventions__list" ]
      (tableHeader [ "Name", "Code", "Date" ] ::
        (model.user.conventions
          |> List.map Convention.asMeta
          |> List.map conListRow))
    , div [ class "pricing__footer" ] (footer model) ]

conListRow : MetaConvention -> Html Msg
conListRow con =
  div
    [ onClick (DoNav (conventionPath con.code)), class "conventions__row--clickable", tabindex 0 ]
    [ tableRow conTableRow con ]

conTableRow : MetaConvention -> List (Html msg)
conTableRow { name, code, start, end } =
  [ text name
  , span [ class "conventions__placeholder" ] [ text code ]
  , text <| (Convention.formatDate start) ++ "–" ++ (Convention.formatDate end) ]

footer : Model -> List (Html Msg)
footer _ = [ Fancy.alignedTooltip Right "Add a convention" <| Fancy.button Icon "add" [ onClick OpenChooseConvention ] ]
