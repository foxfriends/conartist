port module Emit exposing (emit, inventoryTabChange)

port emit : String -> Cmd msg

inventoryTabChange : Int -> String
inventoryTabChange = toString >> (++) "inventoryTab:"
