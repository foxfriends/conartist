module Model.Status exposing (Status(..))
{-| The status of something in progress.

# Definition
@docs Status
-}


{-| The status of something in progress.
-}
type Status
  = Success String
  | Progress Int
  | Failure String
