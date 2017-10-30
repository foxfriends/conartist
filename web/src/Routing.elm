module Routing exposing (..)
import UrlParser exposing (..)
import Navigation exposing (Location)
import Http
import Json.Decode as Decode

import GraphQL exposing (query, getFullConvention)
import Msg exposing (Msg(..), chain)
import Model.Model exposing (Model)
import Model.Page as Page exposing (Page(..))
import Model.ProductType as ProductType
import Model.Convention as Convention
import Model.ConRequest as ConRequest exposing (ConRequest(Success))
import Update.Load as Load
import Ports.LocalStorage as LocalStorage
import Util.List as List

matchers : Model -> Parser ((Page, Cmd Msg) -> a) a
matchers model =
  oneOf
    [ map (Page.signIn, Cmd.none) top
    , map (Page.signIn, Cmd.none) <| s "sign-in"
    , map (Dashboard, Cmd.none) <| s "dashboard"
    , map (Page.inventory, Cmd.none) <| s "inventory"
    , map (Page.pricing, Cmd.none) <| s "prices"
    , map
        (\code ->
          (Page.convention code
            (List.head model.user.productTypes
              |> Maybe.map (ProductType.normalize >> .id))
          , fillConvention model code))
        (s "conventions" </> string)
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
  case List.find (Convention.asMeta >> .code >> (==) code) model.user.conventions of
    -- TODO: this will not update a convention if it has changed between now and
    --       the next time the conventions page is opened
    --       need to get some sort of notes from server when things change?
    Just (Convention.Full _) -> Cmd.none
    _ -> query DidLoadConvention (getFullConvention code) model

reauthorize : Model -> Cmd Msg
reauthorize model =
  Http.send Reauthorized <|
    Http.request
      { method = "Get"
      , headers = [ Http.header "Authorization" ("Bearer " ++ model.authtoken) ]
      , url = "/api/auth/"
      , body = Http.emptyBody
      , expect = Http.expectJson (ConRequest.decode Decode.string)
      , timeout = Nothing
      , withCredentials = False }
