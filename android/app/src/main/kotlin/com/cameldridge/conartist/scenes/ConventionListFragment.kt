package com.cameldridge.conartist.scenes

import android.os.Bundle
import android.view.View
import com.cameldridge.conartist.ConArtistActivity
import com.cameldridge.conartist.R
import com.cameldridge.conartist.scenes.settings.SettingsFragment
import com.cameldridge.conartist.util.Null
import com.cameldridge.conartist.util.fragments.ConArtistFragment
import com.jakewharton.rxbinding3.appcompat.itemClicks
import io.reactivex.rxkotlin.addTo
import kotlinx.android.synthetic.main.fragment_convention_list.toolbar

final class ConventionListFragment : ConArtistFragment<Null>(R.layout.fragment_convention_list) {
  override val title get() = getString(R.string.Conventions)
  override val menu = R.menu.convention_list

  override fun onViewCreated(
    view: View,
    savedInstanceState: Bundle?
  ) {
    super.onViewCreated(view, savedInstanceState)

    toolbar
      .itemClicks()
      .filter { it.itemId == R.id.settings_action }
      .subscribe { ConArtistActivity.present(SettingsFragment()) }
      .addTo(disposeBag)
  }
}
