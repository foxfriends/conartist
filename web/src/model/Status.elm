module Status exposing (Status(..))

type Status
  = Success String
  | Progress Int
  | Failure String
