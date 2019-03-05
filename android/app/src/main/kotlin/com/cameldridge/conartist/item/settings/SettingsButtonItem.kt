package com.cameldridge.conartist.item.settings

import android.graphics.drawable.Drawable
import android.view.View
import com.cameldridge.conartist.R
import com.cameldridge.conartist.scenes.settings.SettingsFragment
import kotlinx.android.synthetic.main.item_settings_button.view.detail_icon
import kotlinx.android.synthetic.main.item_settings_button.view.title_label

final class SettingsButtonItem(
  val title: CharSequence,
  val action: SettingsFragment.Action,
  val detailIcon: Drawable? = null
): SettingsListItem(R.layout.item_settings_button) {
  override val clickable = true
  override fun setup(view: View) {
    view.title_label.setText(title)
    view.detail_icon.setImageDrawable(detailIcon)
  }
}
