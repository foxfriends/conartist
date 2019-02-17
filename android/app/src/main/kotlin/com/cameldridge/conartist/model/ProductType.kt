package com.cameldridge.conartist.model

import android.os.Parcelable
import com.cameldridge.conartist.services.api.graphql.fragment.ProductTypeFragment
import kotlinx.android.parcel.Parcelize

@Parcelize
data class ProductType(
  val id: Id,
  val name: String,
  val color: Int?,
  val sort: Int,
  val discontinued: Boolean
): Parcelable {
  companion object {
    fun fromFragment(fragment: ProductTypeFragment) = ProductType(
      Id.Id(fragment.id),
      fragment.name,
      fragment.color,
      fragment.sort,
      fragment.isDiscontinued
    )
  }
}
