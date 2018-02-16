module Update.SignIn exposing (update)
import Http
import Json.Decode as Decode
import Json.Encode as Json
import Navigation exposing (newUrl)

import Msg exposing (Msg(..))
import Constants exposing (baseURL)
import Paths exposing (dashboardPath)
import Ports.LocalStorage as LocalStorage
import Update.Load as Load
import Model.Model exposing (Model)
import Model.Page exposing (Page(..), SignInPageState, validateSignInForm)
import Model.Status exposing (Status(..))
import Model.ConRequest as ConRequest
import Model.Validation as Validation exposing (Validation(..), valueOf, validate, invalidate, empty, errorFor, toResult)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model = case model.page of
  SignIn page ->
    case msg of
      -- TODO: make form validation more user friendly
      Email new ->
        { model
        | page = SignIn <| validateSignInForm { page | email = Valid new }
        } ! [ if page.is_sign_in then Cmd.none else checkExistingEmail new ]
      DidCheckExistingEmail (Ok (ConRequest.Success False)) ->
        { model | page = SignIn { page | email = validate page.email }} ! []
      DidCheckExistingEmail (Ok _) -> { model | page = SignIn { page | email = invalidate "That email is already in use" page.email }} ! []
      CEmail new    -> { model | page = SignIn <| validateSignInForm { page | c_email = Valid new } } ! []
      Password new  -> { model | page = SignIn <| validateSignInForm { page | password = Valid new } } ! []
      CPassword new -> { model | page = SignIn <| validateSignInForm { page | c_password = Valid new } } ! []
      Name new      -> { model | page = SignIn <| validateSignInForm { page | name = Valid new } } ! []
      Terms terms   -> { model | page = SignIn <| validateSignInForm { page | terms_accepted = Valid terms } } ! []
      ToggleSignIn  ->
        { model
        | page = SignIn <| validateSignInForm
          { page
          | is_sign_in = not page.is_sign_in
          , c_email = Valid ""
          , c_password = Valid ""
          , terms_accepted = Valid False
          , status = Success "" }
        } ! []
      DoSignIn ->
        case page.status of
          Progress _ -> model ! []
          _ ->
            case isValid page of
              Ok () -> { model | page = SignIn { page | status = Progress 0 } } ! [ doSignIn (valueOf page.email) (valueOf page.password) ]
              Err reason -> { model | page = SignIn { page | status = Failure reason }} ! []
      DidSignIn (Ok (ConRequest.Success authtoken)) ->
        let
          newmodel =
            { model
            | user = { email = valueOf page.email, name = "", keys = 0, products = [], productTypes = [], prices = [], conventions = [] }
            , authtoken = authtoken
            , page = Dashboard }
        in
          newmodel
          ! [ newUrl dashboardPath
            , Load.user newmodel
            , LocalStorage.set ("authtoken", authtoken) ]
      DidSignIn (Ok (ConRequest.Failure error)) ->
        { model | page = SignIn { page | status = Failure error } } ! []
      DoCreateAccount ->
        case page.status of
          Progress _ -> model ! []
          _ ->
            case isValid page of
              Ok () ->
                { model
                | page = SignIn
                  { page
                  | status = Progress 0
                  }
                } ! [ createAccount (valueOf page.email) (valueOf page.name) (valueOf page.password) ]
              Err reason -> { model | page = SignIn { page | status = Failure reason } } ! []
      DidCreateAccount (Ok (ConRequest.Success _)) ->
        { model | page = SignIn
          { page
          | status = Success "Account created successfully! Log in to get started"
          , is_sign_in = True }
        } ! []
      DidCreateAccount (Ok (ConRequest.Failure reason)) ->
        { model | page = SignIn { page | status = Failure reason } } ! []
      DidSignIn (Err _) ->
        { model | page = SignIn { page | status = Failure "Something went wrong. Try again later!" } } ! []
      DidCreateAccount (Err _) ->
        { model | page = SignIn { page | status = Failure "Something went wrong. Try again later!" } } ! []
      DidCheckExistingEmail (Err _) ->
        { model | page = SignIn { page | status = Failure "Something went wrong. Try again later!" } } ! []
      _ -> model ! []
  _ -> model ! []

isValid : SignInPageState -> Result String ()
isValid page =
  let fields =
    if page.is_sign_in then
      [ page.email, page.password ]
    else
      [ page.email, page.c_email, page.password, page.c_password, page.name, page.terms_accepted |> Validation.map (always "") ]
  in
    fields
      |> List.map toResult
      |> List.map (Result.map (always ()))
      |> List.foldl (Result.andThen << always) (Ok ())

post : String -> Http.Body -> Decode.Decoder a -> Http.Request a
post url body decoder = Debug.log "request"
  Http.request
    { method = "POST"
    , headers =
      [ Http.header "Origin" baseURL
      -- , Http.header "Access-Control-Request-Method" "POST"
      -- , Http.header "Access-Control-Request-Headers" "X-Custom-Header"
      ]
    , url = baseURL ++ url
    , body = body
    , expect = Http.expectJson decoder
    , timeout = Nothing
    , withCredentials = False
    }

get : String -> Decode.Decoder a -> Http.Request a
get url = Http.get (baseURL ++ url)

checkExistingEmail : String -> Cmd Msg
checkExistingEmail email =
  if not <| email == "" then
    Http.send DidCheckExistingEmail <| get ("/api/account/exists/" ++ email)
      (ConRequest.decode Decode.bool)
  else Cmd.none

doSignIn : String -> String -> Cmd Msg
doSignIn email password =
  Http.send DidSignIn <| post "/api/auth"
      (Http.jsonBody <| Json.object
        [ ("usr", Json.string email)
        , ("psw", Json.string password) ] )
      (ConRequest.decode Decode.string)

createAccount : String -> String -> String -> Cmd Msg
createAccount email name password =
  Http.send DidCreateAccount <| post "/api/account/new"
      (Http.jsonBody <| Json.object
        [ ("email", Json.string email)
        , ("name", Json.string name)
        , ("password", Json.string password) ] )
      (ConRequest.decode <| Decode.succeed ())
