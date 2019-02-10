package com.cameldridge.conartist.scenes

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ListAdapter
import androidx.annotation.LayoutRes
import androidx.annotation.StringRes
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView.Recycler
import com.cameldridge.conartist.ConArtist
import com.cameldridge.conartist.R
import com.cameldridge.conartist.util.ConArtistFragment
import com.cameldridge.conartist.util.RecyclerViewAdaptor
import com.jakewharton.rxbinding3.appcompat.itemClicks
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import io.reactivex.rxkotlin.addTo
import kotlinx.android.synthetic.main.fragment_convention_list.toolbar
import kotlinx.android.synthetic.main.fragment_settings.settings_list
import kotlinx.android.synthetic.main.item_settings_heading.view.title_label

class SettingsFragment : ConArtistFragment(R.layout.fragment_settings) {
  override val title get() = getString(R.string.Settings)
  override val backButtonIcon = R.drawable.ic_close

  private sealed class SettingsItem(@LayoutRes layout: Int): RecyclerViewAdaptor.Item(layout) {
    class Heading(@StringRes val title: Int): SettingsItem(R.layout.item_settings_heading) {
      override fun setup(view: View) {
        view.title_label.setText(title)
      }
    }
  }

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    toolbar
      .navigationClicks()
      .subscribe { ConArtist.back() }
      .addTo(disposeBag)

    val settingsOptions = listOf(
      SettingsItem.Heading(R.string.Products),
      SettingsItem.Heading(R.string.General),
      SettingsItem.Heading(R.string.Account),
      SettingsItem.Heading(R.string.Support),
      SettingsItem.Heading(R.string.About)
    )

    settings_list.adapter = RecyclerViewAdaptor(settingsOptions)
    settings_list.setHasFixedSize(true)
    settings_list.layoutManager = LinearLayoutManager(context)
  }

  final enum class SettingsListItem
}
