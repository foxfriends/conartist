module Model.ChartSettings exposing (..)
import Plot exposing (Point)

type alias Inventory =
  { product_type: Maybe Int
  , hovering: Maybe Point }

inventory : Maybe Int -> Inventory
inventory = flip Inventory Nothing
