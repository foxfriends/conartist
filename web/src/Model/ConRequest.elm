module Model.ConRequest exposing
  ( ConRequest(..)
  , decode
  )
{-| A ConRequest is returned from the server for all requests that aren't done as GraphQL. Someday
in the future it may be desirable to use actually HTTP errors.

# Definition
@docs ConRequest

# JSON
@docs decode
-}

import Json.Decode as Decode exposing (Decoder)

{-| The actual ConRequest data type.

    case conRequest of
      Success value -> -- do something
      Failure error -> -- do something
-}
type ConRequest a
  = Success a
  | Failure String

{-| Decodes a ConRequest from its JSON representation. Takes a decoder to decode the contained
success value as a parameter.

    ConRequest.decode Decode.string
-}
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
