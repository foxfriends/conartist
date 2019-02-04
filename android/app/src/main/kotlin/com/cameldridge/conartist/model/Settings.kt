package com.cameldridge.conartist.model

import com.cameldridge.conartist.services.api.graphql.fragment.SettingsFragment

data class Settings(
  val currency: Money.Currency,
  val language: String
) {
  companion object {
    fun fromFragment(fragment: SettingsFragment) = Settings(
      fragment.currency,
      fragment.language
    )
  }
}
