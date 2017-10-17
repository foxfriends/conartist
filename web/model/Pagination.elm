module Pagination exposing (Pagination)

type alias Pagination t =
  { data: (List t)
  , pages: Int
  , page: Int }
