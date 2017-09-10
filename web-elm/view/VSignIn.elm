module VSignIn exposing (view)
import Html exposing (Html, div, input, button, text)
import Html.Attributes exposing (type_, placeholder, class)
import Html.Events exposing (onInput, onClick)
import Html.Keyed as K

import Model exposing (Model)
import Msg exposing (Msg(..))
import Page
import Status

view : Model -> Html Msg
view model = case model.page of
  Page.SignIn page ->
     div [ class "sign-in"] <|
      [ K.node "div" [ class "sign-in__form"]
        <| if page.is_sign_in
          then
            [ ("username", input [type_ "text", class "sign-in__field", placeholder "Email", onInput Email] [] )
            , ("password", input [type_ "password", class "sign-in__field", placeholder "Password", onInput Password] []) ]
          else
            [ ("username", input [type_ "text", class "sign-in__field", placeholder "Email", onInput Email] [] )
            , ("confirm_email", input [type_ "text", class "sign-in__field", placeholder "Confirm Email", onInput CEmail] [])
            , ("password", input [type_ "password", class "sign-in__field", placeholder "Password", onInput Password] [])
            , ("confirm_password", input [type_ "password", class "sign-in__field", placeholder "Confirm Password", onInput CPassword] [])
            , ("terms", input [type_ "checkbox", class "sign-in__checkbox", onClick ToggleTerms] []) ]
      , div [ class "sign-in__buttons"]
        [ button [ class "sign-in__button", onClick DoSignIn ] [ text "Log In" ]
        , button [ class "sign-in__link", onClick ToggleSignIn ]
            [ text <|
                if page.is_sign_in
                then "Create an account"
                else "Actually, I already have an account" ]]
      , div [ class "sign-in__info" ]
          [ case page.status of
              Status.Success str -> div [ class "sign-in__notification sign-in__notification--neutral"] [text str]
              Status.Progress _ -> div [ class "sign-in__notification sign-in__notification--neutral" ] [text "Logging in"]
              Status.Failure error -> div [ class "sign-in__notification sign-in__notification--error" ] [text error] ]]
  _ -> div [] []
