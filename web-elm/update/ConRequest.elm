module ConRequest exposing (ConRequest(..), decode)
import Json.Decode as Decode exposing (Decoder)

type ConRequest a
  = Success a
  | Failure String

decode : Decoder a -> Decoder (ConRequest a)
decode decoder =
  Decode.at ["status"] Decode.string
    |> Decode.andThen (\s ->
      if s == "Success"
      then
        Decode.at ["data"] decoder |> Decode.map (\v -> Success v)
      else
        Decode.at ["error"] Decode.string |> Decode.map (\v -> Failure v)
    )
