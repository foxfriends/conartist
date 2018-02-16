module Paths exposing (..)
{-| Constructors for URLs to the different routes accepted by the app
-}

dashboardPath : String
dashboardPath = "/dashboard"

inventoryPath : String
inventoryPath = "/inventory"

pricingPath : String
pricingPath = "/prices"

conventionsPath : String
conventionsPath = "/conventions"

conventionPath : Int -> String
conventionPath = toString >> (++) "/conventions/"

settingsPath : String
settingsPath = "/settings"

signInPath : String
signInPath = "/sign-in"
