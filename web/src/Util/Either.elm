module Util.Either exposing (both)
import Either exposing (Either, unpack)

{-| Takes the value of the Either, regardless of which state it is in

    both (Left 5) == 5
    both (Right 6) == 6
-}
both : Either a a -> a
both = unpack identity identity
