module Model.Money exposing
  ( currency
  , toString
  , fromString
  , prettyprint
  , parse
  , numeric
  , money
  , add
  , Money(..)
  , Currency(..)
  )
import Util.Util as Util
import FormatNumber exposing (format)
import FormatNumber.Locales as Locales
-- TODO: can this file be auto-generated from a list?

type Currency
  = CAD
  | USD

currency : String -> Maybe Currency
currency str = case str of
  "CAD" -> Just CAD
  "USD" -> Just USD
  _ -> Nothing

currencyString : Currency -> String
currencyString c = case c of
  CAD -> "CAD"
  USD -> "USD"

type Money = Money Currency Int

toString : Money -> String
toString (Money c i) = currencyString c ++ Basics.toString i

fromString : String -> Result String Money
fromString moneyString =
  case (currency <| String.left 3 moneyString, Util.toInt <| String.dropLeft 3 moneyString) of
    (Just cur, Ok int) -> Ok <| Money cur int
    (_, Err msg)       -> Err <| msg
    (Nothing, _)       -> Err <| (String.left 3 moneyString ++ " is not a valid currency code")

prettyprint : Money -> String
prettyprint (Money cur val) = case cur of
  USD -> (++) "$" <| format Locales.usLocale <| flip (/) 100 <| toFloat val
  CAD -> (++) "$" <| format Locales.usLocale <| flip (/) 100 <| toFloat val

parse : String -> Result String Money
parse money =
  case String.uncons money of
    Just ('$', rest) -> parse rest
    _ -> String.toFloat money
      |> Result.map ((*) 100 >> floor >> Money CAD)

numeric : Money -> Int
numeric (Money _ i) = i

-- TODO: come up with some "auto" currency that will resolve itself eventually to the right thing
money : Int -> Money
money = Money CAD

add : Money -> Money -> Maybe Money
add (Money ca va) (Money cb vb) =
  if ca == cb then Just <| Money ca (va + vb) else Nothing
