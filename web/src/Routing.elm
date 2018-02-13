module Routing exposing (..)
import UrlParser exposing (..)
import Navigation exposing (Location)

import Msg exposing (Msg(..), chain)
import Model.Model exposing (Model)
import Model.Page as Page exposing (Page(..))
import Model.ProductType as ProductType
import Model.ConRequest as ConRequest exposing (ConRequest(Success))
import Update.Load as Load
import Ports.LocalStorage as LocalStorage
import Update.Actions exposing (..)
import Paths exposing (..)

matchers : Model -> Parser ((Page, Cmd Msg) -> a) a
matchers model =
  oneOf
    [ map (Page.signIn, Cmd.none) top
    , map (Page.signIn, Cmd.none) <| s "sign-in"
    , map (Dashboard, Cmd.none) <| s "dashboard"
    , map (Page.inventory, Cmd.none) <| s "inventory"
    , map (Page.pricing, Cmd.none) <| s "prices"
    , map
        (\conId ->
          (Page.convention conId
            (List.head model.user.productTypes
              |> Maybe.map (ProductType.normalize >> .id))
          , fillConvention model conId))
        (s "conventions" </> int)
    , map (Conventions, Cmd.none) <| s "conventions"
    , map (Settings, Cmd.none) <| s "settings" ]

parseLocation : Model -> Location -> (Page, Cmd Msg)
parseLocation model location = case parsePath (matchers model) location of
  Just page -> page
  Nothing -> (Page.signIn, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case msg of
  Reauthorized (Ok (Success authtoken)) ->
    { model | authtoken = authtoken } ! [ LocalStorage.set ("authtoken", authtoken) ]
  LSRetrive ("authtoken", Just authtoken) ->
    let authModel = { model | authtoken = authtoken } in
    let (page, task, url) = case authModel.location of
      Just loc -> case parseLocation authModel loc of
        (SignIn _, t) -> (Dashboard, t, Just dashboardPath)
        (p, t) -> (p, t, Nothing)
      Nothing -> (Dashboard, Cmd.none, Just dashboardPath) in
    let pageModel =
      { authModel
      | page = page
      , location = Nothing } in
    pageModel !
      [ reauthorize pageModel
      , (Load.user pageModel) |> chain task
      , (url |> Maybe.map Navigation.newUrl |> Maybe.withDefault Cmd.none) ]
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
  DidNav loc  -> parseLocation model loc
    |> Tuple.mapFirst (\p -> { model | page = p, sidenav_visible = False })
  _           -> (model, Cmd.none)
