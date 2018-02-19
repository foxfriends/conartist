module Model.Settings exposing (..)
{-| A user's settings.

# Definition
@docs Settings, settings
-}

import Model.Money exposing (Currency(CAD))

{-| A user's settings

    Settings CAD
-}
type alias Settings =
  { currency: Currency
  }

{-| The default settings

    settings
-}
settings : Settings
settings = { currency = CAD }
