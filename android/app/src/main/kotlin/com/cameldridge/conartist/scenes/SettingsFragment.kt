package com.cameldridge.conartist.scenes

import android.os.Bundle
import android.view.View
import androidx.annotation.LayoutRes
import androidx.annotation.StringRes
import androidx.recyclerview.widget.LinearLayoutManager
import com.cameldridge.conartist.ConArtist
import com.cameldridge.conartist.R
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.scenes.SettingsFragment.Action.*
import com.cameldridge.conartist.util.ConArtistFragment
import com.cameldridge.conartist.util.RecyclerViewAdaptor
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import io.reactivex.rxkotlin.addTo
import kotlinx.android.synthetic.main.fragment_convention_list.toolbar
import kotlinx.android.synthetic.main.fragment_settings.settings_list
import kotlinx.android.synthetic.main.item_settings_heading.view.title_label

class SettingsFragment : ConArtistFragment(R.layout.fragment_settings) {
  override val title get() = getString(R.string.Settings)
  override val backButtonIcon = R.drawable.ic_close

  private final enum class Action {
    SignOut;
  }

  private sealed class Item(@LayoutRes layout: Int): RecyclerViewAdaptor.Item(layout) {
    final class Heading(@StringRes val title: Int): Item(R.layout.item_settings_heading) {
      override fun setup(view: View)
        = view.title_label.setText(title)
    }
    final class Button(val title: String, val action: Action): Item(R.layout.item_settings_button) {
      override val clickable = true
      override fun setup(view: View)
        = view.title_label.setText(title)
    }
  }

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    toolbar
      .navigationClicks()
      .subscribe { ConArtist.back() }
      .addTo(disposeBag)

    val settingsOptions = listOf(
      Item.Heading(R.string.Products),
      Item.Heading(R.string.General),
      Item.Heading(R.string.Account),
      Item.Button(getString(R.string.Sign_out), SignOut),
      Item.Heading(R.string.Support),
      Item.Heading(R.string.About)
    )

    val adaptor = RecyclerViewAdaptor(settingsOptions)
    settings_list.adapter = adaptor
    settings_list.setHasFixedSize(true)
    settings_list.layoutManager = LinearLayoutManager(context)

    adaptor.itemClicks
      .map { (settingsOptions[it] as Item.Button).action }
      .subscribe{ when (it!!) {
        SignOut -> ConArtist.signOut()
      }}
      .addTo(disposeBag)
  }
}
