module VSignIn exposing (view)
import Html exposing (Html, div, input, button, text)
import Html.Attributes exposing (type_)
import Html.Events exposing (onInput, onClick)
import Html.Keyed as K
import Model exposing (Model)
import Msg exposing (Msg(..))
import Page
import Status

view : Model -> Html Msg
view model = case model.page of
  Page.SignIn page ->
    K.node "div" [] <|
      [ ("username", input [type_ "text", onInput Email] [] )]
      ++ (if page.is_sign_in
          then [ ("password", input [type_ "password", onInput Password] []) ]
          else [ ("confirm_email", input [type_ "text", onInput CEmail] [])
               , ("password", input [type_ "password", onInput Password] [])
               , ("confirm_password", input [type_ "password", onInput CPassword] [])
               , ("terms", input [type_ "checkbox", onClick ToggleTerms] []) ])
      ++ [ ("submit", button [ onClick DoSignIn ] [ text "Log In" ])
         , ("toggle_sign_in", button [ onClick ToggleSignIn ] [ text "Create an account" ]) ]
      ++ case page.status of
        Status.Success str -> [("success", div [] [text str])]
        Status.Progress _ -> [("progress", div [] [text "Logging in"])]
        Status.Failure error -> [("error", div [] [text error])]
  _ -> div [] []
