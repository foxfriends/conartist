module Util.Date exposing (utcWeekdayNumber)
import Date exposing (Date)
import Date.Extra as Date

{-| Determines the day of the week as an integer, according to the UTC standard.
-}
utcWeekdayNumber : Date -> Int
utcWeekdayNumber date = Date.toUtcFormattedString "e" date
  |> String.toInt
  |> Result.withDefault 0
