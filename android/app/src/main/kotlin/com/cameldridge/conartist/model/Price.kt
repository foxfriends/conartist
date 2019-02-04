package com.cameldridge.conartist.model

import com.cameldridge.conartist.services.api.graphql.fragment.PriceFragment

data class Price(
  val typeId: Id,
  val productId: Id?,
  val price: Money,
  val quantity: Int
) {
  companion object {
    fun fromFragment(fragment: PriceFragment) = Price(
      Id.Id(fragment.typeId),
      fragment.productId?.let { Id.Id(it) },
      fragment.price,
      fragment.quantity
    )
  }
}
