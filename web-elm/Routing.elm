module Routing exposing (..)
import UrlParser exposing (..)
import Navigation exposing (Location)

import Model exposing (Model)
import Msg exposing (Msg(..))
import Page exposing (Page(..))
import Load
import LocalStorage
import Emit exposing (..)

matchers : Parser ((Page, Cmd Msg) -> a) a
matchers =
  oneOf
    [ map (Page.signIn, Cmd.none) top
    , map (Page.signIn, Cmd.none) <| s "sign-in"
    , map (Dashboard, Cmd.none) <| s "dashboard"
    , map (Page.inventory, emit (inventoryTabChange 0)) <| s "inventory"
    , map (Pricing, Cmd.none) <| s "prices"
    , map (\s -> (Convention s, Cmd.none)) <| s "conventions" </> string
    , map (Conventions, Cmd.none) <| s "conventions" ]

parseLocation : Location -> (Page, Cmd Msg)
parseLocation location = case parsePath matchers location of
  Just page -> page
  Nothing -> (Page.signIn, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  LSRetrive ("authtoken", Just authtoken) ->
    case model.page of
      SignIn _ ->
        let newmodel =
          { model
          | page = Dashboard
          , authtoken = authtoken }
        in
          (newmodel, Cmd.batch
            [ Navigation.newUrl dashboardPath
            , Load.user newmodel ] )
      _ ->
        let newmodel = { model | authtoken = authtoken }
        in (newmodel, Load.user newmodel )
  LSRetrive ("authtoken", Nothing) ->
    ( { model
      | page = Page.signIn
      , authtoken = "" }
    , Navigation.newUrl signInPath )
  DoSignOut   ->
    ( { model | sidenav_visible = False, page = Page.signIn, authtoken = "" }
    , Cmd.batch [ LocalStorage.remove "authtoken", Navigation.newUrl signInPath ] )
  DoNav url   -> ( { model | sidenav_visible = False }, Navigation.newUrl url )
  DidNav loc  -> let (page, cmd) = parseLocation loc in ( { model | page = page, sidenav_visible = False }, cmd )
  _           -> (model, Cmd.none)

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
