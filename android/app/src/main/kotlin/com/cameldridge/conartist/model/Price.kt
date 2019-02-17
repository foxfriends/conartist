package com.cameldridge.conartist.model

import android.os.Parcelable
import com.cameldridge.conartist.services.api.graphql.fragment.PriceFragment
import kotlinx.android.parcel.Parcelize

@Parcelize
data class Price(
  val typeId: Id,
  val productId: Id?,
  val price: Money,
  val quantity: Int
): Parcelable {
  companion object {
    fun fromFragment(fragment: PriceFragment) = Price(
      Id.Id(fragment.typeId),
      fragment.productId?.let { Id.Id(it) },
      fragment.price,
      fragment.quantity
    )
  }
}
