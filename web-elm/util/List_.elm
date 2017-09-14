module List_ exposing (..)

enumerate : List a -> List (Int, a)
enumerate l = let len = List.length l in
  List.foldr (\c -> \p -> (len - List.length p - 1, c) :: p) [] l

find : (a -> Bool) -> List a -> Maybe a
find pred list =
  case list of
    [] -> Nothing
    a :: rest -> if pred a then Just a else find pred rest
