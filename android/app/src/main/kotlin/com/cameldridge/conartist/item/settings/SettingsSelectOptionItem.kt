package com.cameldridge.conartist.item.settings

import android.view.View
import com.cameldridge.conartist.R
import com.cameldridge.conartist.scenes.settings.SettingsSelectFragment
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor
import kotlinx.android.synthetic.main.item_settings_select_option.view.*

final class SettingsSelectOptionItem<I: SettingsSelectFragment.Item>(
  val item: I,
  val selected: Boolean
): RecyclerViewAdaptor.Item(R.layout.item_settings_select_option) {
  override val clickable = true
  override fun setup(view: View) {
    view.title_label.setText(item.title)
    view.selected_icon.visibility = if (selected) { View.VISIBLE } else { View.INVISIBLE }
  }
}
