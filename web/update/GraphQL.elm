module GraphQL exposing (query, mutation, getUser, getFullConvention, getConventionPage)
import Task
import Http
import Json.Decode as Decode
import Date exposing (Date)
import Date.Extra as Date
import Either exposing (Either(Right))
import GraphQL.Client.Http exposing (..)
import GraphQL.Request.Builder exposing (..)
import GraphQL.Request.Builder.Arg as Arg
import GraphQL.Request.Builder.Variable as Var

import Model exposing (Model)
import User exposing (User)
import ProductType exposing (FullType, ProductType(..))
import Product exposing (FullProduct, Product(..))
import Price exposing (FullPrice, Price(..))
import Convention exposing (MetaConvention, FullConvention, Convention(..))
import Record exposing (Record)
import Pagination exposing (Pagination)

type DateType = DateType

date : ValueSpec NonNull DateType Date vars
date =
  Decode.string
    |> Decode.andThen
        (\timeString ->
          case Date.fromIsoString timeString of
            Just date -> Decode.succeed date
            Nothing -> Decode.fail "Date format is incorrect"
        )
    |> customScalar DateType

time : ValueSpec NonNull DateType Date vars
time =
  Decode.float
    |> Decode.map Date.fromTime
    |> customScalar DateType

productType : ValueSpec NonNull ObjectType FullType vars
productType = object FullType
  |> with (field "id" [] int)
  |> with (field "name" [] string)
  |> with (field "color" [] int)
  |> with (field "discontinued" [] bool)

product : ValueSpec NonNull ObjectType FullProduct vars
product = object FullProduct
  |> with (field "id" [] int)
  |> with (field "name" [] string)
  |> with (field "quantity" [] int)
  |> with (field "typeId" [] int)
  |> with (field "discontinued" [] bool)

priceRow : ValueSpec NonNull ObjectType FullPrice vars
priceRow = object FullPrice
  |> with (field "index" [] int)
  |> with (field "typeId" [] int)
  |> with (field "productId" [] (nullable int))
  |> with (field "price" [] (map Right float))
  |> with (field "quantity" [] int)

metaConvention : ValueSpec NonNull ObjectType MetaConvention vars
metaConvention = object MetaConvention
  |> with (field "name" [] string)
  |> with (field "code" [] string)
  |> with (field "start" [] date)
  |> with (field "end" [] date)

fullConvention : ValueSpec NonNull ObjectType FullConvention vars
fullConvention = object FullConvention
  |> with (field "name" [] string)
  |> with (field "code" [] string)
  |> with (field "start" [] date)
  |> with (field "end" [] date)
  |> with (field "product" [] (map (List.map Product.Clean) <| map (List.sortBy .id) (list product)))
  |> with (field "productType" [] (map (List.map ProductType.Clean) <| map (List.sortBy .id) (list productType)))
  |> with (field "price" [] (list <| map Price.Clean priceRow))
  |> with (field "record" [] (list record))

record : ValueSpec NonNull ObjectType Record vars
record = object Record
  |> with (field "products" [] (list int))
  |> with (field "price" [] float)
  |> with (field "time" [] time)

user : ValueSpec NonNull ObjectType User vars
user = object User
  |> with (field "email" [] string)
  |> with (field "keys" [] int)
  |> with (field "product" [] (map (List.map Product.Clean) <| map (List.sortBy .id) (list product)))
  |> with (field "productType" [] (map (List.map ProductType.Clean) <| map (List.sortBy .id) (list productType)))
  |> with (field "price" [] (list <| map Price.Clean priceRow))
  |> with (field "convention" [] (list <| map Convention.Meta metaConvention))

getUser : Request Query User
getUser =
  request { id = Nothing } <| queryDocument <| extract <|
    field "user" [ ("id", Arg.variable (Var.required "id" .id (Var.nullable Var.int))) ] user

getFullConvention : String -> Request Query FullConvention
getFullConvention code =
  request { code = code, id = Nothing } <| queryDocument <| extract <|
    field "userConvention"
      [ ("id", Arg.variable (Var.required "id" .id (Var.nullable Var.int)))
      , ("code", Arg.variable (Var.required "code" .code Var.string)) ]
      fullConvention

pagination : ValueSpec NonNull ObjectType a vars -> ValueSpec NonNull ObjectType (Pagination a) vars
pagination a = object Pagination
  |> with (field "data" [] (list a))
  |> with (field "page" [] int)
  |> with (field "pages" [] int)

getConventionPage : Int -> Int -> Request Query (Pagination MetaConvention)
getConventionPage page limit =
  request { page = Just page, limit = Just limit, excludeMine = Just True } <| queryDocument <| extract <|
    field "convention"
      [ ("page", Arg.variable (Var.required "page" .page (Var.nullable Var.int)))
      , ("limit", Arg.variable (Var.required "limit" .limit (Var.nullable Var.int)))
      , ("excludeMine", Arg.variable (Var.required "excludeMine" .excludeMine (Var.nullable Var.bool))) ]
      (pagination metaConvention)

authorized : String -> String -> RequestOptions
authorized method authtoken =
  { method = method
  , headers = [ Http.header "Authorization" ("Bearer " ++ authtoken) ]
  , url = "/api/v2"
  , timeout = Nothing
  , withCredentials = False }

query : (Result Error result -> msg) -> Request Query result -> Model -> Cmd msg
query msg query model = Task.attempt msg <| customSendQuery (authorized "GET" model.authtoken) query

mutation : (Result Error result -> msg) -> Request Mutation result -> Model -> Cmd msg
mutation msg query model = Task.attempt msg <| customSendMutation (authorized "POST" model.authtoken) query
