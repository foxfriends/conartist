package com.cameldridge.conartist.scenes

import android.os.Bundle

import com.cameldridge.conartist.R
import com.cameldridge.conartist.util.ConArtistToolbarActivity
import com.jakewharton.rxbinding3.appcompat.itemClicks
import io.reactivex.rxkotlin.addTo

import kotlinx.android.synthetic.main.activity_convention_list.*

class ConventionListActivity : ConArtistToolbarActivity(R.layout.activity_convention_list, R.menu.convention_list) {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    toolbar.itemClicks()
      .filter { item -> item.itemId == R.id.settings_action }
      .subscribe()
      .addTo(disposeBag)
  }
}
