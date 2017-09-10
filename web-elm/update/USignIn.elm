module USignIn exposing (update)
import Http
import Json.Decode as Decode
import Json.Encode as Json

import Model exposing (Model)
import Page exposing (Page(..))
import Status exposing (Status(..))
import Msg exposing (Msg(..))
import ConRequest

validateForm : Page -> Page
validateForm p = case p of
  SignIn page ->
    let { email, c_email, password, c_password, terms_accepted, is_sign_in } = page in
      if is_sign_in then p
      else
        if      not <| c_email == email       then SignIn { page | status = Failure "Emails do not match" }
        else if not <| c_password == password then SignIn { page | status = Failure "Passwords do not match" }
        else if not <| terms_accepted         then SignIn { page | status = Failure "Please accept the terms and conditions" }
        else                                       SignIn { page | status = Success "" }
  _ -> p

update : Msg -> Model -> Maybe (Model, Cmd Msg)
update msg model = case model.page of
  SignIn page ->
    Just (
      case msg of
        -- TODO: make form validation more user friendly
        Email new ->
          ({ model | page = validateForm <| SignIn { page | email = new } }
          , if page.is_sign_in
            then Cmd.none
            else Http.send DidCheckExistingEmail <| Http.get
              ("http://localhost:8080/api/account/exists/" ++ new)
              (ConRequest.decode Decode.bool))
        DidCheckExistingEmail (Ok (ConRequest.Success False)) -> (model, Cmd.none)
        DidCheckExistingEmail (Ok _) -> ({ model | page = SignIn { page | status = Failure "That email is already in use" }}, Cmd.none)
        CEmail new    -> ({ model | page = validateForm <| SignIn { page | c_email = new } }, Cmd.none)
        Password new  -> ({ model | page = validateForm <| SignIn { page | password = new } }, Cmd.none)
        CPassword new -> ({ model | page = validateForm <| SignIn { page | c_password = new } }, Cmd.none)
        ToggleTerms   -> ({ model | page = validateForm <| SignIn { page | terms_accepted = not page.terms_accepted } }, Cmd.none)
        ToggleSignIn ->
          ( { model
            | page = SignIn { page
                            | is_sign_in = not page.is_sign_in
                            , c_email = ""
                            , c_password = ""
                            , terms_accepted = False
                            , status = Success "" } }
          , Cmd.none)
        DoSignIn ->
          ( { model | page = SignIn { page | status = Progress 0 } }
          , Http.send DidSignIn <| Http.post "http://localhost:8080/api/auth"
              (Http.jsonBody <| Json.object
                [ ("usr", Json.string page.email)
                , ("psw", Json.string page.password) ] )
              (ConRequest.decode Decode.string))
        DidSignIn (Ok (ConRequest.Success authtoken)) -> let user = model.user in
          ( { model
            | user = Just { email = page.email, authtoken = authtoken }
            , page = Dashboard }
          , Cmd.none)
        DidSignIn (Ok (ConRequest.Failure error)) ->
          ({ model | page = SignIn { page | status = Failure error } }, Cmd.none)
        DoCreateAccount ->
          let valid = validateForm <| SignIn page in
            case valid of
              SignIn { status } -> case status of
                Success _ ->
                  ( { model | page = SignIn { page | status = Progress 0 } }
                  , Http.send DidCreateAccount <| Http.post "http://localhost:8080/api/account/new"
                      (Http.jsonBody <| Json.object
                        [ ("usr", Json.string page.email)
                        , ("psw", Json.string page.password) ] )
                      (ConRequest.decode <| Decode.succeed ()) )
                _ -> ( { model | page = valid }, Cmd.none )
              _ -> ( { model | page = valid }, Cmd.none )
        DidCreateAccount (Ok (ConRequest.Success _)) ->
          ( { model | page = SignIn
              { page
              | status = Success "Account created successfully! Log in to get started"
              , is_sign_in = True } }
          , Cmd.none)
        DidCreateAccount (Ok (ConRequest.Failure reason)) ->
          ( { model | page = SignIn { page | status = Failure reason } } , Cmd.none)
        DidSignIn (Err _) ->
          ({ model | page = SignIn { page | status = Failure "Something went wrong. Try again later!" } }, Cmd.none)
        DidCreateAccount (Err _) ->
          ({ model | page = SignIn { page | status = Failure "Something went wrong. Try again later!" } }, Cmd.none)
        DidCheckExistingEmail (Err _) ->
          ({ model | page = SignIn { page | status = Failure "Something went wrong. Try again later!" } }, Cmd.none)
      )
  _ -> Nothing
