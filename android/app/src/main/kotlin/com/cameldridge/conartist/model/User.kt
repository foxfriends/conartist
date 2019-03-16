package com.cameldridge.conartist.model

import android.os.Parcelable
import com.cameldridge.conartist.model.Money.Currency
import com.cameldridge.conartist.services.api.graphql.fragment.FullUserFragment
import kotlinx.android.parcel.Parcelize

@Parcelize
data class User(
  val email: String,
  val name: String,
  val verified: Boolean,
  val products: List<Product>,
  val productTypes: List<ProductType>,
  val prices: List<Price>,
  val conventions: List<Convention>,
  val settings: Settings
): Parcelable {

  fun merge(user: User) = User(
    user.email,
    user.name,
    user.verified,
    user.products,
    user.productTypes,
    user.prices,
    user.conventions, // TODO: merge conventions
    user.settings
  )

  fun withCurrency(currency: Currency) = User(
    email,
    name,
    verified,
    products,
    productTypes,
    prices,
    conventions,
    settings.withCurrency(currency)
  )

  fun addProductType(productType: ProductType) = User(
    email,
    name,
    verified,
    products,
    productTypes + listOf(productType),
    prices,
    conventions,
    settings
  )

  fun addProduct(product: Product) = User(
    email,
    name,
    verified,
    products + listOf(product),
    productTypes,
    prices,
    conventions,
    settings
  )

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
