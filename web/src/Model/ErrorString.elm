module Model.ErrorString exposing (..)

emptyName : String
emptyName = "Name is empty"

duplicateName : String
duplicateName = "Name is duplicated"

nanQuantity : String
nanQuantity = "Quantity is not a number"

negQuantity : String
negQuantity = "Quantity is less than 0"

noQuantity : String
noQuantity = "Quantity is 0"

emptyQuantity : String
emptyQuantity = "Quantity is not set"

duplicateQuantity : String
duplicateQuantity = "Quantity is duplicated"

negPrice : String
negPrice = "Price is less than 0"

nanPrice : String
nanPrice = "Price is not a number"

emptyPrice : String
emptyPrice = "Price is not set"

noType : String
noType = "Type is not set"
