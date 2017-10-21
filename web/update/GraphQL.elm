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

import Util
import Model exposing (Model)
import User exposing (User)
import ProductType exposing (FullType, InternalType, NewType, ProductType(..))
import Product exposing (FullProduct, InternalProduct, NewProduct, Product(..))
import Price exposing (FullPrice, CondensedPrice, Price(..))
import Convention exposing (MetaConvention, FullConvention, Convention(..))
import Record exposing (Record)
import Expense exposing (Expense)
import Pagination exposing (Pagination)
import Validation exposing (valueOf)

-- TODO: make user of fragments to reduce request size

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

time : ValueSpec NonNull DateType Date vars
time =
  Decode.float
    |> Decode.map Date.fromTime
    |> customScalar DateType

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

pricePair : ValueSpec NonNull ObjectType (Int, Float) vars
pricePair = object (,)
  |> with (field "quantity" [] int)
  |> with (field "price" [] float)

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
  |> with (field "price" [] float)
  |> with (field "quantity" [] int)

metaConvention : ValueSpec NonNull ObjectType MetaConvention vars
metaConvention = object MetaConvention
  |> with (field "id" [] int)
  |> with (field "name" [] string)
  |> with (field "code" [] string)
  |> with (field "start" [] date)
  |> with (field "end" [] date)

fullConvention : ValueSpec NonNull ObjectType FullConvention vars
fullConvention = object FullConvention
  |> with (field "id" [] int)
  |> with (field "name" [] string)
  |> with (field "code" [] string)
  |> with (field "start" [] date)
  |> with (field "end" [] date)
  |> with (field "product" [] (map (List.map Product.Clean) <| map (List.sortBy .id) (list product)))
  |> with (field "productType" [] (map (List.map ProductType.Clean) <| map (List.sortBy .id) (list productType)))
  |> with (field "price" [] (list <| map Price.Clean priceRow))
  |> with (field "record" [] (list record))
  |> with (field "expense" [] (list expense))

record : ValueSpec NonNull ObjectType Record vars
record = object Record
  |> with (field "products" [] (list int))
  |> with (field "price" [] float)
  |> with (field "time" [] time)

expense : ValueSpec NonNull ObjectType Expense vars
expense = object Expense
  |> with (field "price" [] float)
  |> with (field "category" [] string)
  |> with (field "description" [] string)
  |> with (field "spendTime" [] time)

user : ValueSpec NonNull ObjectType User vars
user = object User
  |> with (field "email" [] string)
  |> with (field "name" [] string)
  |> with (field "keys" [] int)
  |> with (field "product" [] (map (List.map Product.Clean) <| map (List.sortBy .id) (list product)))
  |> with (field "productType" [] (map (List.map ProductType.Clean) <| map (List.sortBy .id) (list productType)))
  |> with (field "price" [] (list <| map Price.Clean priceRow))
  |> with (field "convention" [] (list <| map Convention.Meta metaConvention))

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

getFullConvention : String -> Request Query FullConvention
getFullConvention code =
  request { code = code, id = Nothing } <| queryDocument <| extract <|
    field "userConvention"
      [ ("id", Arg.variable (Var.required "id" .id (Var.nullable Var.int)))
      , ("code", Arg.variable (Var.required "code" .code Var.string)) ]
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

pricePairArg : (Int, Float) -> Arg.Value vars
pricePairArg (q, p) =
  Arg.object
    [ ("quantity", Arg.int q)
    , ("price", Arg.float p) ]
priceAdd : CondensedPrice -> Arg.Value vars
priceAdd pr =
  Arg.object
    [ ("typeId", Arg.int pr.type_id)
    , ("productId", (argNullable Arg.int) pr.product_id)
    , ("prices", (Arg.list << List.map pricePairArg) pr.prices) ]
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
    <| map (List.map <| Tuple.mapFirst (String.dropLeft 1)) -- TODO don't need
    <| keyValuePairs
    <| List.map deletePrice prices

addConvention : String -> Request Mutation MetaConvention
addConvention code =
  request { conCode = code }
    <| mutationDocument
    <| extract
    <| field "addUserConvention"
        [ ("conCode", Arg.variable (Var.required "conCode" .conCode Var.string)) ]
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
