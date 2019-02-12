package com.cameldridge.conartist.model

import com.cameldridge.conartist.services.api.graphql.fragment.FullUserFragment

data class User(
  val email: String,
  val name: String,
  val verified: Boolean,
  val products: List<Product>,
  val productTypes: List<ProductType>,
  val prices: List<Price>,
  val conventions: List<Convention>,
  val settings: Settings
) {
  companion object {
    fun fromFragment(fragment: FullUserFragment) = User(
      fragment.fragments.userFragment.email,
      fragment.fragments.userFragment.name,
      fragment.fragments.userFragment.isVerified,
      fragment.products
        .map { it.fragments.productFragment }
        .map { Product.fromFragment(it) },
      fragment.productTypes
        .map { it.fragments.productTypeFragment }
        .map { ProductType.fromFragment(it) },
      fragment.prices
        .map { it.fragments.priceFragment }
        .map { Price.fromFragment(it) },
      fragment.fragments.userFragment.conventions
        .map { it.fragments.metaConventionFragment }
        .map { Convention.fromFragment(it) },
      fragment.fragments.userFragment.settings
        .fragments.settingsFragment
        .let { Settings.fromFragment(it) }
    )
  }
}
