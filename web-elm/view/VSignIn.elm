module VSignIn exposing (view)
import Html exposing (Html, div, input, button, text)
import Html.Attributes exposing (type_, placeholder, class, disabled)
import Html.Events exposing (onInput, onClick)
import Html.Keyed as K

import Model exposing (Model)
import Msg exposing (Msg(..))
import Page
import Status exposing (Status)

view : Model -> Html Msg
view model = case model.page of
  Page.SignIn page ->
     div [ class "sign-in"] <|
      [ K.node "div" [ class "sign-in__form"] <| signInForm page.is_sign_in
      , div [ class "sign-in__buttons"] <| signInButtons page.is_sign_in page.status
      , div [ class "sign-in__info" ] <| signInInfo page.is_sign_in page.status ]
  _ -> div [] []

signInForm : Bool -> List (String, Html Msg)
signInForm sign_in = if sign_in
  then
    [ ("username", input [type_ "text", class "sign-in__field", placeholder "Email", onInput Email] [] )
    , ("password", input [type_ "password", class "sign-in__field", placeholder "Password", onInput Password] []) ]
  else
    [ ("username", input [type_ "text", class "sign-in__field", placeholder "Email", onInput Email] [] )
    , ("confirm_email", input [type_ "text", class "sign-in__field", placeholder "Confirm Email", onInput CEmail] [])
    , ("password", input [type_ "password", class "sign-in__field", placeholder "Password", onInput Password] [])
    , ("confirm_password", input [type_ "password", class "sign-in__field", placeholder "Confirm Password", onInput CPassword] [])
    , ("terms", input [type_ "checkbox", class "sign-in__checkbox", onClick ToggleTerms] []) ]

signInButtons : Bool -> Status -> List (Html Msg)
signInButtons sign_in status =
  [ button [ class "sign-in__button"
           , onClick <| if sign_in then DoSignIn else DoCreateAccount
           , disabled <| case status of
              Status.Progress _ -> True
              _                 -> False ]
           [ text <| if sign_in
               then "Sign in"
               else "Create account" ]
  , button [ class "sign-in__link", onClick ToggleSignIn ]
    [ text <|
        if sign_in
        then "Create an account"
        else "Actually, I already have an account" ] ]

signInInfo : Bool -> Status -> List (Html Msg)
signInInfo sign_in status =
  [ case status of
      Status.Success str -> div [ class "sign-in__notification sign-in__notification--neutral"] [text str]
      Status.Progress _ -> div [ class "sign-in__notification sign-in__notification--neutral" ]
        [ text <| if sign_in then "Logging in" else "Creating account" ]
      Status.Failure error -> div [ class "sign-in__notification sign-in__notification--error" ] [text error] ]
