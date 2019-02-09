package com.cameldridge.conartist.scenes

import android.os.Bundle
import android.view.View
import com.cameldridge.conartist.ConArtist
import com.cameldridge.conartist.R
import com.cameldridge.conartist.util.ConArtistFragment
import com.jakewharton.rxbinding3.appcompat.itemClicks
import io.reactivex.rxkotlin.addTo
import kotlinx.android.synthetic.main.fragment_convention_list.toolbar

class SettingsFragment : ConArtistFragment(R.layout.fragment_settings) {
  override val title get() = getString(R.string.Settings)
}
