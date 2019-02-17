package com.cameldridge.conartist.model

import android.os.Parcelable
import com.cameldridge.conartist.services.api.graphql.fragment.ProductFragment
import kotlinx.android.parcel.Parcelize

@Parcelize
data class Product(
  val id: Id,
  val typeId: Id,
  val name: String,
  val quantity: Int,
  val sort: Int,
  val discontinued: Boolean
): Parcelable {
  companion object {
    fun fromFragment(fragment: ProductFragment) = Product(
      Id.Id(fragment.id),
      Id.Id(fragment.typeId),
      fragment.name,
      fragment.quantity,
      fragment.sort,
      fragment.isDiscontinued
    )
  }
}
