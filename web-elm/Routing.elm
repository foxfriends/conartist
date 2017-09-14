module Routing exposing (..)
import UrlParser exposing (..)
import Navigation exposing (Location)

import Model exposing (Model)
import Msg exposing (Msg(..))
import Page exposing (Page(..))
import Load
import LocalStorage

matchers : Parser (Page -> a) a
matchers =
  oneOf
    [ map Page.signIn top
    , map Page.signIn <| s "sign-in"
    , map Dashboard <| s "dashboard"
    , map Inventory <| s "inventory"
    , map Pricing <| s "prices"
    , map Convention <| s "conventions" </> string
    , map Conventions <| s "conventions" ]

parseLocation : Location -> Page
parseLocation location = case parsePath matchers location of
  Just page -> page
  Nothing -> Page.signIn

update : Msg -> Model -> Maybe (Model, Cmd Msg)
update msg model = case msg of
  LSRetrive ("authtoken", Just authtoken) ->
    case model.page of
      SignIn _ ->
        let newmodel =
          { model
          | page = Dashboard
          , authtoken = authtoken }
        in Just
          (newmodel, Cmd.batch
            [ Navigation.newUrl dashboardPath
            , Load.user newmodel ] )
      _ ->
        let newmodel = { model | authtoken = authtoken }
        in Just (newmodel, Load.user newmodel )
  LSRetrive ("authtoken", Nothing) -> Just
    ( { model
      | page = Page.signIn
      , authtoken = "" }
    , Navigation.newUrl signInPath )
  DoSignOut   -> Just
    ( { model | sidenav_visible = False, page = Page.signIn, authtoken = "" }
    , Cmd.batch [ LocalStorage.remove "authtoken", Navigation.newUrl signInPath ] )
  DoNav url   -> Just ( { model | sidenav_visible = False }, Navigation.newUrl url )
  DidNav loc  -> Just ( { model | page = parseLocation loc, sidenav_visible = False }, Cmd.none )
  _           -> Nothing

dashboardPath : String
dashboardPath = "/dashboard"

inventoryPath : String
inventoryPath = "/inventory"

pricingPath : String
pricingPath = "/prices"

conventionsPath : String
conventionsPath = "/conventions"

conventionPath : String -> String
conventionPath = (++) "/conventions/"

signInPath : String
signInPath = "/sign-in"
