module ConRequest exposing (..)
import Json.Decode as Decode exposing (Decoder)

type ConRequest a
  = Success a
  | Failure String

type alias Pagination a =
  { data: List a
  , pages: Int
  , page: Int }

decode : Decoder a -> Decoder (ConRequest a)
decode decoder =
  Decode.at ["status"] Decode.string
    |> Decode.andThen (\s ->
      if s == "Success"
      then
        Decode.at ["data"] decoder |> Decode.map Success
      else
        Decode.at ["error"] Decode.string |> Decode.map Failure
    )
