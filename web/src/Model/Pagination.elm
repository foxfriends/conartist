module Model.Pagination exposing (Pagination)
{-| Pagination is returned from the server when data comes in pages.

# Definition
@docs Pagination
-}

{-| The Pagination object contains the total number of pages, the page that was just returned, and
the data for that page. The number of pages and the amount of data depends on the request that
generated the Pagination value.

    Pagination [] 0 0
-}
type alias Pagination t =
  { data: (List t)
  , pages: Int
  , page: Int }
