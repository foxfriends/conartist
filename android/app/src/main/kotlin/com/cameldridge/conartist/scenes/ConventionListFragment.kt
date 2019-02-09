package com.cameldridge.conartist.scenes

import android.os.Bundle
import android.util.Log
import android.view.View
import com.cameldridge.conartist.ConArtist
import com.cameldridge.conartist.R
import com.cameldridge.conartist.util.ConArtistFragment
import com.jakewharton.rxbinding3.appcompat.itemClicks
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import io.reactivex.rxkotlin.addTo
import kotlinx.android.synthetic.main.fragment_convention_list.toolbar

class ConventionListFragment : ConArtistFragment(R.layout.fragment_convention_list) {
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
      .subscribe { ConArtist.present(SettingsFragment()) }
      .addTo(disposeBag)
  }
}
