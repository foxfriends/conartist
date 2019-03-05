package com.cameldridge.conartist.item.settings

import android.view.View
import com.cameldridge.conartist.R
import kotlinx.android.synthetic.main.item_settings_info.view.title_label

final class SettingsInfoItem(val title: CharSequence): SettingsListItem(R.layout.item_settings_info) {
  override fun setup(view: View) = view.title_label.setText(title)
}
