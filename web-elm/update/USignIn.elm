module USignIn exposing (update)
import Model exposing (Model)
import Page exposing (Page(..))
import Status exposing (Status(..))
import Msg exposing (Msg(..))
import Http
import ConRequest
import Json.Decode as Decode
import Json.Encode as Json

update : Msg -> Model -> Maybe (Model, Cmd Msg)
update msg model = case model.page of
  SignIn page ->
    Just (
      case msg of
        Email new -> ({ model | page = SignIn { page | email = new } }, Cmd.none)
        CEmail new -> ({ model | page = SignIn { page | c_email = new } }, Cmd.none)
        Password new -> ({ model | page = SignIn { page | password = new } }, Cmd.none)
        CPassword new -> ({ model | page = SignIn { page | c_password = new } }, Cmd.none)
        ToggleTerms -> ({ model | page = SignIn { page | terms_accepted = not page.terms_accepted } }, Cmd.none)
        ToggleSignIn -> ({ model | page = SignIn { page | is_sign_in = not page.is_sign_in, terms_accepted = False } }, Cmd.none)
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
        DidSignIn (Ok (ConRequest.Failure  error)) ->
          ({ model | page = SignIn { page | status = Failure error } }, Cmd.none)
        DidSignIn (Err _) ->
          ({ model | page = SignIn { page | status = Failure "Something went wrong. Try again later!" } }, Cmd.none)
      )
  _ -> Nothing
