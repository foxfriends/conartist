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

decodePagination : (Decoder a) -> Decoder (Pagination a)
decodePagination decoder =
  Decode.map3 Pagination
    (Decode.field "data" (Decode.list decoder))
    (Decode.field "pages" (Decode.int))
    (Decode.field "page" (Decode.int))
