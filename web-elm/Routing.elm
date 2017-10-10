module Routing exposing (..)
import UrlParser exposing (..)
import Navigation exposing (Location)
import Http

import Model exposing (Model)
import Msg exposing (Msg(..))
import Page exposing (Page(..))
import Load
import LocalStorage
import ConRequest
import Convention exposing (Convention(..))
import List_

matchers : Model -> Parser ((Page, Cmd Msg) -> a) a
matchers model =
  oneOf
    [ map (Page.signIn, Cmd.none) top
    , map (Page.signIn, Cmd.none) <| s "sign-in"
    , map (Dashboard, Cmd.none) <| s "dashboard"
    , map (Page.inventory, Cmd.none) <| s "inventory"
    , map (Page.pricing, Cmd.none) <| s "prices"
    , map (\code -> (Convention code, fillConvention model code)) (s "conventions" </> string)
    , map (Conventions, Cmd.none) <| s "conventions"
    , map (Settings, Cmd.none) <| s "settings" ]

parseLocation : Model -> Location -> (Page, Cmd Msg)
parseLocation model location = case parsePath (matchers model) location of
  Just page -> page
  Nothing -> (Page.signIn, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  LSRetrive ("authtoken", Just authtoken) ->
    let (page, task, url) = case model.location of
      Just loc -> case parseLocation model loc of
        (SignIn _, t) -> (Dashboard, t, Just dashboardPath)
        (p, t) -> (p, t, Nothing)
      Nothing -> (Dashboard, Cmd.none, Just dashboardPath) in
    let authModel =
      { model
      | page = page
      , authtoken = authtoken
      , location = Nothing } in
    authModel ! [ Load.user authModel, task, url |> Maybe.map Navigation.newUrl |> Maybe.withDefault Cmd.none ]
  LSRetrive ("authtoken", Nothing) ->
    ( { model
      | page = Page.signIn
      , authtoken = ""
      , location = Nothing }
    , Navigation.newUrl signInPath )
  DoSignOut   ->
    ( { model | sidenav_visible = False, page = Page.signIn, authtoken = "" }
    , Cmd.batch [ LocalStorage.remove "authtoken", Navigation.newUrl signInPath ] )
  DoNav url   -> ( { model | sidenav_visible = False }, Navigation.newUrl url )
  DidNav loc  -> let (page, cmd) = parseLocation model loc in ( { model | page = page, sidenav_visible = False }, cmd )
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

settingsPath : String
settingsPath = "/settings"

signInPath : String
signInPath = "/sign-in"

fillConvention : Model -> String -> Cmd Msg
fillConvention model code =
  case List_.find (\c -> c.code == code) (List.filterMap Convention.asFull model.user.conventions) of
    Nothing ->
      Http.send DidLoadConvention <|
        Http.request
          { method = "Get"
          , headers = [ Http.header "Authorization" ("Bearer " ++ model.authtoken) ]
          , url = "/api/con/" ++ code
          , body = Http.emptyBody
          , expect = Http.expectJson (ConRequest.decode Convention.fullDecode)
          , timeout = Nothing
          , withCredentials = False }
    Just _ -> Cmd.none
