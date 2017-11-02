module Util.Date exposing (..)
import Date exposing (Date)
import Date.Extra as Date

utcWeekdayNumber : Date -> Int
utcWeekdayNumber date = Date.toUtcFormattedString "e" date
  |> String.toInt
  |> Result.withDefault 0
