module Model.ChartSettings exposing (Inventory(..), inventory)
{-| Defines the options that are available for the different charts.

# Inventory chart
@docs Inventory, inventory
-}
import Plot exposing (Point)

{-| The settings for an Inventory chart.

`product_type`: The ID of the product type to show the information for. `Nothing` shows all types at
once.

-- `hovering`: The position to show hover information at (mouse position).

    Inventory (Just 1) Nothing
-}
type alias Inventory =
  { product_type: Maybe Int
  , hovering: Maybe Point
  }

{-| Creates a new Inventory object for the provided product type

    inventory (Just 3)
-}
inventory : Maybe Int -> Inventory
inventory = flip Inventory Nothing
