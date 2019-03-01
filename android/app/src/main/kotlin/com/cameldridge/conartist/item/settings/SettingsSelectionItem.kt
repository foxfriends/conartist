package com.cameldridge.conartist.item.settings

import android.view.View
import com.cameldridge.conartist.R
import com.cameldridge.conartist.scenes.settings.SettingsFragment
import com.cameldridge.conartist.scenes.settings.SettingsSelectFragment
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor.Item
import kotlinx.android.synthetic.main.item_settings_selection.view.*

final class SettingsSelectionItem(
  val title: CharSequence,
  val action: SettingsFragment.Action,
  val selection: SettingsSelectFragment.Item
): Item(R.layout.item_settings_selection) {
  override val clickable = true
  override fun setup(view: View) {
    view.title_label.setText(title)
    view.detail_label.setText(selection.title)
  }
}
