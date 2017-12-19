module View.Conventions exposing (view, conListRow)
import Html exposing (Html, div, text, span)
import Html.Attributes exposing (class, tabindex)
import Html.Events exposing (onClick)

import Msg exposing (Msg(..))
import Paths exposing (conventionPath)
import Model.Model exposing (Model)
import Model.Convention as Convention exposing (Convention, MetaConvention)
import View.Table exposing (tableHeader, tableRow)
import View.Fancy as Fancy exposing (ButtonStyle(..), TooltipAlignment(..))
import View.Attributes exposing (onInteract)
import View.Convention.Util exposing (dateRange)

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
    ([ class "conventions__row--clickable", tabindex 0 ] ++ onInteract (DoNav (conventionPath con.code)) Ignore)
    [ tableRow conTableRow con ]

conTableRow : MetaConvention -> List (Html msg)
conTableRow { name, code, start, end } =
  [ text name
  , span [ class "text__placeholder" ] [ text code ]
  , text <| dateRange start end ]

footer : Model -> List (Html Msg)
footer _ = List.singleton <|
  Fancy.alignedTooltip Right "Add a convention" <| Fancy.button Icon "add" [ onClick OpenChooseConvention ]
