module Either_ exposing (both)
import Either exposing (Either, unpack)

both : Either a a -> a
both = unpack identity identity
