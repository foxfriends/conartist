package com.cameldridge.conartist.item.settings

import android.view.View
import androidx.annotation.StringRes
import com.cameldridge.conartist.R
import kotlinx.android.synthetic.main.item_settings_heading.view.title_label

final class SettingsHeadingItem(@StringRes val title: Int): SettingsListItem(R.layout.item_settings_heading) {
  override fun setup(view: View) = view.title_label.setText(title)
}
