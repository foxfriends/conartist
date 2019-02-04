package com.cameldridge.conartist.model

import com.cameldridge.conartist.services.api.graphql.fragment.ProductTypeFragment

data class ProductType(
  val id: Id,
  val name: String,
  val color: Int?,
  val sort: Int,
  val discontinued: Boolean
) {
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
