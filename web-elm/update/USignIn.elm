module USignIn exposing (update)
import Http
import Json.Decode as Decode
import Json.Encode as Json

import Model exposing (Model)
import Msg exposing (Msg(..))
import Page exposing (Page(..))
import Status exposing (Status(..))
import Load
import ConRequest
import LocalStorage

update : Msg -> Model -> Maybe (Model, Cmd Msg)
update msg model = case model.page of
  SignIn page ->
    case msg of
      LSRetrive ("authtoken", Just authtoken) -> Just
        ( { model
          | page = Dashboard
          , authtoken = authtoken }
        , Cmd.none )
      LSRetrive ("authtoken", Nothing) -> Just
        ( { model
          | page = Page.signIn
          , authtoken = "" }
        , Cmd.none )
      -- TODO: make form validation more user friendly
      Email new -> Just
        ( { model | page = validateForm <| SignIn { page | email = new } }
        , if page.is_sign_in then Cmd.none else checkExistingEmail new )
      DidCheckExistingEmail (Ok (ConRequest.Success False)) -> Just (model, Cmd.none)
      DidCheckExistingEmail (Ok _) -> Just ({ model | page = SignIn { page | status = Failure "That email is already in use" }}, Cmd.none)
      CEmail new    -> Just ({ model | page = validateForm <| SignIn { page | c_email = new } }, Cmd.none)
      Password new  -> Just ({ model | page = validateForm <| SignIn { page | password = new } }, Cmd.none)
      CPassword new -> Just ({ model | page = validateForm <| SignIn { page | c_password = new } }, Cmd.none)
      ToggleTerms   -> Just ({ model | page = validateForm <| SignIn { page | terms_accepted = not page.terms_accepted } }, Cmd.none)
      ToggleSignIn  -> Just
        ( { model
          | page = SignIn { page
                          | is_sign_in = not page.is_sign_in
                          , c_email = ""
                          , c_password = ""
                          , terms_accepted = False
                          , status = Success "" } }
        , Cmd.none)
      DoSignIn -> Just
        ( { model | page = SignIn { page | status = Progress 0 } }
        , doSignIn page.email page.password )
      DidSignIn (Ok (ConRequest.Success authtoken)) -> Just <| let user = model.user in
      let newmodel =
          { model
          | user = Just { email = page.email, keys = 0, products = [], productTypes = [], prices = [], conventions = [] }
          , authtoken = authtoken
          , page = Dashboard } in
        (newmodel , Cmd.batch
          [ Load.user newmodel
          , LocalStorage.set ("authtoken", authtoken) ] )
      DidSignIn (Ok (ConRequest.Failure error)) -> Just
        ( { model | page = SignIn { page | status = Failure error } }
        , Cmd.none )
      DoCreateAccount -> Just <|
        let valid = validateForm <| SignIn page in
          case valid of
            SignIn { status } -> case status of
              Success _ ->
                ( { model | page = SignIn { page | status = Progress 0 } }
                , createAccount page.email page.password )
              _ -> ( { model | page = valid }, Cmd.none )
            _ -> ( { model | page = valid }, Cmd.none )
      DidCreateAccount (Ok (ConRequest.Success _)) -> Just
        ( { model | page = SignIn
            { page
            | status = Success "Account created successfully! Log in to get started"
            , is_sign_in = True } }
        , Cmd.none)
      DidCreateAccount (Ok (ConRequest.Failure reason)) -> Just
        ( { model | page = SignIn { page | status = Failure reason } } , Cmd.none)
      DidSignIn (Err _) -> Just
        ({ model | page = SignIn { page | status = Failure "Something went wrong. Try again later!" } }, Cmd.none)
      DidCreateAccount (Err _) -> Just
        ({ model | page = SignIn { page | status = Failure "Something went wrong. Try again later!" } }, Cmd.none)
      DidCheckExistingEmail (Err _) -> Just
        ({ model | page = SignIn { page | status = Failure "Something went wrong. Try again later!" } }, Cmd.none)
      _ -> Nothing
  _ -> Nothing

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

checkExistingEmail : String -> Cmd Msg
checkExistingEmail email =
  Http.send DidCheckExistingEmail <| Http.get
    ("/api/account/exists/" ++ email)
    (ConRequest.decode Decode.bool)

doSignIn : String -> String -> Cmd Msg
doSignIn email password =
  Http.send DidSignIn <| Http.post "/api/auth"
      (Http.jsonBody <| Json.object
        [ ("usr", Json.string email)
        , ("psw", Json.string password) ] )
      (ConRequest.decode Decode.string)

createAccount : String -> String -> Cmd Msg
createAccount email password =
  Http.send DidCreateAccount <| Http.post "/api/account/new"
      (Http.jsonBody <| Json.object
        [ ("usr", Json.string email)
        , ("psw", Json.string password) ] )
      (ConRequest.decode <| Decode.succeed ())
