module Tree exposing (..)

type Tree a = Root (a -> a -> Order) (InnerTree a)

type InnerTree a
  = Empty
  | Node a (InnerTree a) (InnerTree a)

toList : Tree a -> List a
toList tree =
  case tree of
    Root cmp t ->
      let rec t =
        case t of
          Node a l r -> rec l ++ a :: rec r
          Empty -> [] in
      rec t

insert : a -> Tree a -> Tree a
insert a tree =
  case tree of
    Root cmp t ->
      let rec t =
        case t of
          Node b l r ->
            case cmp a b of
              LT -> Node b (rec l) r
              GT -> Node b l (rec r)
              EQ -> t
          Empty ->
            Node a Empty Empty in
      Root cmp (rec t)

unwrap : Tree a -> InnerTree a
unwrap tree = case tree of Root _ t -> t

min : Tree a -> Maybe a
min tree = (unwrap >> min_) tree


max : Tree a -> Maybe a
max tree = (unwrap >> max_) tree

min_ : InnerTree a -> Maybe a
min_ t = case t of
  Node b Empty _ -> Just b
  Node b l _ -> min_ l
  Empty -> Nothing

max_ : InnerTree a -> Maybe a
max_ t = case t of
  Node b _ Empty -> Just b
  Node b _ r -> max_ r
  Empty -> Nothing

remove : a -> Tree a -> Tree a
remove a tree = case tree of
  Root cmp t ->
    let rec a t =
      case t of
        Node b Empty r ->
          case cmp a b of
            LT -> Node b Empty r
            GT -> Node b Empty (rec a r)
            EQ -> r
        Node b l Empty ->
          case cmp a b of
            LT -> Node b (rec a l) Empty
            GT -> Node b l Empty
            EQ -> l
        Node b l r ->
          case cmp a b of
            LT -> Node b (rec a l) r
            GT -> Node b l (rec a r)
            EQ -> case min_ r of
              Just rep -> Node rep l (rec rep r)
              Nothing -> Debug.crash "unreachable"
        Empty -> Empty in
    Root cmp (rec a t)

reorder : (a -> a -> Order) -> Tree a -> Tree a
reorder = map identity

map : (a -> b) -> (b -> b -> Order) -> Tree a -> Tree b
map f cmp = toList >> List.map f >> List.foldl insert (Root cmp Empty)
