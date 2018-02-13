module GraphQL exposing
  ( query, mutation
  , getUser, getFullConvention, getConventionPage
  , createProductTypes, updateProductTypes
  , createProducts, updateProducts
  , createPrices, deletePrices
  , addConvention )
import Task
import Http
import Json.Decode as Decode
import Date exposing (Date)
import Date.Extra as Date
import Either exposing (Either(..))
import GraphQL.Client.Http exposing (..)
import GraphQL.Request.Builder as GraphQL exposing (..)
import GraphQL.Request.Builder.Arg as Arg
import GraphQL.Request.Builder.Variable as Var

import Util.Util as Util
import Model.Model exposing (Model)
import Model.User exposing (User)
import Model.ProductType as ProductType exposing (FullType, InternalType, NewType, ProductType(..))
import Model.Product as Product exposing (FullProduct, InternalProduct, NewProduct, Product(..))
import Model.Price as Price exposing (FullPrice, CondensedPrice, Price(..))
import Model.Convention as Convention exposing (MetaConvention, FullConvention, Convention(..))
import Model.Record exposing (Record)
import Model.Expense exposing (Expense)
import Model.Pagination exposing (Pagination)
import Model.Validation exposing (valueOf)
import Model.Money as Money exposing (Money(..), Currency)

-- TODO: make use of fragments to reduce request size

-- Types

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

-- TODO: support other currencies
type MoneyType = MoneyType
money : ValueSpec NonNull MoneyType Money vars
money =
  Decode.string
    |> Decode.map Money.fromString
    |> Decode.andThen (\ms -> case ms of
        Ok money -> Decode.succeed money
        Err msg -> Decode.fail msg)
    |> customScalar MoneyType

argMoney : Money -> Arg.Value vars
argMoney = Arg.string << Money.toString

-- Decoders

productType : ValueSpec NonNull ObjectType FullType vars
productType = object FullType
  |> with (field "id" [] int)
  |> with (field "name" [] string)
  |> with (field "color" [] int)
  |> with (field "discontinued" [] bool)

product : ValueSpec NonNull ObjectType FullProduct vars
product = object FullProduct
  |> with (field "id" [] int)
  |> with (field "typeId" [] int)
  |> with (field "name" [] string)
  |> with (field "quantity" [] int)
  |> with (field "discontinued" [] bool)

pricePair : ValueSpec NonNull ObjectType (Int, Money) vars
pricePair = object (,)
  |> with (field "quantity" [] int)
  |> with (field "price" [] money)

price : ValueSpec NonNull ObjectType CondensedPrice vars
price = object CondensedPrice
  |> with (field "typeId" [] int)
  |> with (field "productId" [] (nullable int))
  |> with (field "prices" [] (list pricePair))

priceRow : ValueSpec NonNull ObjectType FullPrice vars
priceRow = object FullPrice
  |> with (field "index" [] int)
  |> with (field "typeId" [] int)
  |> with (field "productId" [] (nullable int))
  |> with (field "price" [] money)
  |> with (field "quantity" [] int)

metaConvention : ValueSpec NonNull ObjectType MetaConvention vars
metaConvention = object MetaConvention
  |> with (field "id" [] int)
  |> with (field "name" [] string)
  |> with (field "start" [] date)
  |> with (field "end" [] date)
  |> with (field "extraInfo" [] string)

fullConvention : ValueSpec NonNull ObjectType FullConvention vars
fullConvention = object FullConvention
  |> with (field "id" [] int)
  |> with (field "name" [] string)
  |> with (field "start" [] date)
  |> with (field "end" [] date)
  |> with (field "extraInfo" [] string)
  |> with (field "products" [] (map (List.map Product.Clean) <| map (List.sortBy .id) (list product)))
  |> with (field "productTypes" [] (map (List.map ProductType.Clean) <| map (List.sortBy .id) (list productType)))
  |> with (field "prices" [] (list <| map Price.Clean priceRow))
  |> with (field "records" [] (list record))
  |> with (field "expenses" [] (list expense))

record : ValueSpec NonNull ObjectType Record vars
record = object Record
  |> with (field "products" [] (list int))
  |> with (field "price" [] money)
  |> with (field "time" [] date)

expense : ValueSpec NonNull ObjectType Expense vars
expense = object Expense
  |> with (field "price" [] money)
  |> with (field "category" [] string)
  |> with (field "description" [] string)
  |> with (field "time" [] date)

user : ValueSpec NonNull ObjectType User vars
user = object User
  |> with (field "email" [] string)
  |> with (field "name" [] string)
  |> with (field "keys" [] int)
  |> with (field "products" [] (map (List.map Product.Clean) <| map (List.sortBy .id) (list product)))
  |> with (field "productTypes" [] (map (List.map ProductType.Clean) <| map (List.sortBy .id) (list productType)))
  |> with (field "prices" [] (list <| map Price.Clean priceRow))
  |> with (field "conventions" [] (list <| map Convention.Meta metaConvention))

pagination : ValueSpec NonNull ObjectType a vars -> ValueSpec NonNull ObjectType (Pagination a) vars
pagination a = object Pagination
  |> with (field "data" [] (list a))
  |> with (field "pages" [] int)
  |> with (field "page" [] int)

-- Queries

getUser : Request Query User
getUser =
  request { id = Nothing } <| queryDocument <| extract <|
    field "user" [ ("id", Arg.variable (Var.required "id" .id (Var.nullable Var.int))) ] user

getFullConvention : Int -> Request Query FullConvention
getFullConvention conId =
  request { conId = conId, userId = Nothing } <| queryDocument <| extract <|
    field "userConvention"
      [ ("userId", Arg.variable (Var.required "userId" .userId (Var.nullable Var.int)))
      , ("conId", Arg.variable (Var.required "conId" .conId Var.int)) ]
      fullConvention

getConventionPage : Int -> Int -> Request Query (Pagination MetaConvention)
getConventionPage page limit =
  request { page = Just page, limit = Just limit, excludeMine = Just True } <| queryDocument <| extract <|
    field "convention"
      [ ("page", Arg.variable (Var.required "page" .page (Var.nullable Var.int)))
      , ("limit", Arg.variable (Var.required "limit" .limit (Var.nullable Var.int)))
      , ("excludeMine", Arg.variable (Var.required "excludeMine" .excludeMine (Var.nullable Var.bool))) ]
      (pagination metaConvention)

-- Mutations

productTypeAdd : NewType -> Arg.Value vars
productTypeAdd type_ =
  Arg.object
    [ ("name", Arg.string (valueOf type_.name))
    , ("color", Arg.int type_.color) ]
createProductType : NewType -> SelectionSpec Field FullType vars
createProductType type_ =
  aliasAs (ProductType.hash (ProductType.New type_)) <|
    field "addUserProductType"
      [ ("productType", productTypeAdd type_) ]
      productType
createProductTypes : List NewType -> Request Mutation (List (String, FullType))
createProductTypes types =
  request {}
    <| mutationDocument
    <| map (List.map <| Tuple.mapFirst (String.dropLeft 1))
    <| keyValuePairs
    <| List.map createProductType types

productTypeMod : InternalType -> Arg.Value vars
productTypeMod type_ =
  Arg.object
    [ ("typeId", Arg.int type_.id)
    , ("name", argIfRight Arg.string (Either.mapRight valueOf type_.name))
    , ("color", argIfRight Arg.int type_.color)
    , ("discontinued", argIfRight Arg.bool type_.discontinued) ]
updateProductType : InternalType -> SelectionSpec Field FullType vars
updateProductType type_ =
  aliasAs (ProductType.hash (ProductType.Dirty type_)) <|
    field "modUserProductType"
      [ ("productType", productTypeMod type_) ]
      productType
updateProductTypes : List InternalType -> Request Mutation (List (String, FullType))
updateProductTypes types =
  request {}
    <| mutationDocument
    <| map (List.map <| Tuple.mapFirst (String.dropLeft 1))
    <| keyValuePairs
    <| List.map updateProductType types

productAdd : NewProduct -> Arg.Value vars
productAdd product =
  Arg.object
    [ ("typeId", Arg.int product.type_id)
    , ("name", Arg.string (valueOf product.name))
    , ("quantity", Arg.int <| (Either.unpack identity (Util.toInt >> Result.withDefault 0) (valueOf product.quantity))) ]
createProduct : NewProduct -> SelectionSpec Field FullProduct vars
createProduct pr =
  aliasAs (Product.hash (Product.New pr)) <|
    field "addUserProduct"
      [ ("product", productAdd pr) ]
      product
createProducts : List NewProduct -> Request Mutation (List (String, FullProduct))
createProducts products =
  request {}
    <| mutationDocument
    <| map (List.map <| Tuple.mapFirst (String.dropLeft 1))
    <| keyValuePairs
    <| List.map createProduct products

productMod : InternalProduct -> Arg.Value vars
productMod product =
  Arg.object
    [ ("productId", Arg.int product.id)
    , ("name", argIfRight Arg.string (Either.mapRight valueOf product.name))
    , ("quantity", argIfRight Arg.int (Either.mapRight (valueOf >> Util.toInt >> Result.withDefault 0) product.quantity))
    , ("discontinued", argIfRight Arg.bool product.discontinued) ]
updateProduct : InternalProduct -> SelectionSpec Field FullProduct vars
updateProduct pr =
  aliasAs (Product.hash (Product.Dirty pr)) <|
    field "modUserProduct"
      [ ("product", productMod pr) ]
      product
updateProducts : List InternalProduct -> Request Mutation (List (String, FullProduct))
updateProducts products =
  request {}
    <| mutationDocument
    <| map (List.map <| Tuple.mapFirst (String.dropLeft 1))
    <| keyValuePairs
    <| List.map updateProduct products

argPricePair : (Int, Money) -> Arg.Value vars
argPricePair (q, p) =
  Arg.object
    [ ("quantity", Arg.int q)
    , ("price", argMoney p) ]
priceAdd : CondensedPrice -> Arg.Value vars
priceAdd pr =
  Arg.object
    [ ("typeId", Arg.int pr.type_id)
    , ("productId", (argNullable Arg.int) pr.product_id)
    , ("prices", (Arg.list << List.map argPricePair) pr.prices) ]
createPrice : CondensedPrice -> SelectionSpec Field CondensedPrice vars
createPrice pr =
  aliasAs (Price.hash (pr.type_id, pr.product_id)) <|
    field "addUserPrice"
      [ ("price", priceAdd pr) ]
      price
createPrices : List CondensedPrice -> Request Mutation (List (String, CondensedPrice))
createPrices prices =
  request {}
    <| mutationDocument
    <| map (List.map <| Tuple.mapFirst (String.dropLeft 1))
    <| keyValuePairs
    <| List.map createPrice prices

priceDel : (Int, Maybe Int) -> Arg.Value vars
priceDel (t, p) =
  Arg.object
    [ ("typeId", Arg.int t)
    , ("productId", (argNullable Arg.int) p) ]
deletePrice : (Int, Maybe Int) -> SelectionSpec Field Bool vars
deletePrice pr =
  aliasAs (Price.hash pr) <|
    field "delUserPrice"
      [ ("price", priceDel pr) ]
      bool
deletePrices : List (Int, Maybe Int) -> Request Mutation (List (String, Bool))
deletePrices prices =
  request {}
    <| mutationDocument
    <| map (List.map <| Tuple.mapFirst (String.dropLeft 1)) -- TODO: don't need -- TODO: what did this mean?
    <| keyValuePairs
    <| List.map deletePrice prices

addConvention : Int -> Request Mutation MetaConvention
addConvention conId =
  request { conId = conId }
    <| mutationDocument
    <| extract
    <| field "addUserConvention"
        [ ("conCode", Arg.variable (Var.required "conId" .conId Var.int)) ]
        metaConvention

-- Requests

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

-- Helpers

argNullable : (a -> Arg.Value vars) -> Maybe a -> Arg.Value vars
argNullable fn = Maybe.map fn >> Maybe.withDefault Arg.null

argIfRight : (a -> Arg.Value vars) ->  Either x a -> Arg.Value vars
argIfRight fn val =
  case val of
    Left _ -> Arg.null
    Right v -> fn v

aliasAs : String -> SelectionSpec Field result vars -> SelectionSpec Field result vars
aliasAs = GraphQL.aliasAs << String.cons '_'
