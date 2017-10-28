module ChartSettings exposing (..)
import Plot exposing (Point)

type alias Inventory =
  { product_type: Int
  , hovering: Maybe Point }

inventory : Int -> Inventory
inventory = flip Inventory Nothing
