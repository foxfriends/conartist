package com.cameldridge.conartist.model

import android.os.Parcelable
import com.cameldridge.conartist.model.Money.Currency
import com.cameldridge.conartist.services.api.graphql.fragment.SettingsFragment
import kotlinx.android.parcel.Parcelize

@Parcelize
data class Settings(
  val currency: Currency,
  val language: String
): Parcelable {

  fun withCurrency(currency: Currency) = Settings(currency, language)

  companion object {
    fun fromFragment(fragment: SettingsFragment) = Settings(
      fragment.currency,
      fragment.language
    )
  }
}
