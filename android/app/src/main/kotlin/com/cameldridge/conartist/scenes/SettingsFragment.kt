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

class SettingsFragment : ConArtistFragment(R.layout.fragment_settings) {
  override val title get() = getString(R.string.Settings)
  override val backButtonIcon = R.drawable.ic_close

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    toolbar
      .navigationClicks()
      .subscribe { ConArtist.back() }
      .addTo(disposeBag)
  }
}
