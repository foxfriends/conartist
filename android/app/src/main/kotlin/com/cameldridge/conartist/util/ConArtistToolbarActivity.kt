package com.cameldridge.conartist.util

import android.os.Bundle
import androidx.annotation.LayoutRes
import androidx.annotation.MenuRes
import androidx.appcompat.widget.Toolbar
import com.cameldridge.conartist.R

abstract class ConArtistToolbarActivity(@LayoutRes val resource: Int, @MenuRes val menu: Int): ConArtistActivity(resource) {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    val toolbar = findViewById<Toolbar>(R.id.toolbar)
    toolbar.inflateMenu(menu)
  }
}
