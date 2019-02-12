package com.cameldridge.conartist.scenes

import android.graphics.drawable.Drawable
import android.os.Bundle
import android.view.View
import androidx.annotation.DrawableRes
import androidx.annotation.LayoutRes
import androidx.annotation.StringRes
import androidx.appcompat.content.res.AppCompatResources.getDrawable
import androidx.recyclerview.widget.LinearLayoutManager
import com.cameldridge.conartist.ConArtistActivity
import com.cameldridge.conartist.R
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.scenes.SettingsFragment.Action.*
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.util.ConArtistFragment
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor
import com.cameldridge.conartist.util.recyclerview.bindTo
import com.cameldridge.conartist.util.prettystring.prettify
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import io.reactivex.rxkotlin.addTo
import kotlinx.android.synthetic.main.fragment_convention_list.toolbar
import kotlinx.android.synthetic.main.fragment_settings.settings_list
import kotlinx.android.synthetic.main.item_settings_button.view.detail_icon
import kotlinx.android.synthetic.main.item_settings_heading.view.title_label

class SettingsFragment : ConArtistFragment(R.layout.fragment_settings) {
  override val title get() = getString(R.string.Settings)
  override val backButtonIcon = R.drawable.ic_close

  private final enum class Action {
    VerifyEmail,
    SignOut;
  }

  private sealed class Item(@LayoutRes layout: Int): RecyclerViewAdaptor.Item(layout) {
    final class Heading(@StringRes val title: Int): Item(R.layout.item_settings_heading) {
      override fun setup(view: View)
        = view.title_label.setText(title)
    }
    final class Button(val title: CharSequence, val action: Action, val detailIcon: Drawable? = null): Item(R.layout.item_settings_button) {
      override val clickable = true
      override fun setup(view: View) {
        view.title_label.setText(title)
        view.detail_icon.setImageDrawable(detailIcon)
      }
    }
    final class Info(val title: CharSequence): Item(R.layout.item_settings_info) {
      override fun setup(view: View)
        = view.title_label.setText(title)
    }
  }

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    toolbar
      .navigationClicks()
      .subscribe { ConArtistActivity.back() }
      .addTo(disposeBag)

    val adaptor = RecyclerViewAdaptor<Item>()
    Model.user
      .map { user -> listOf(
        Item.Heading(R.string.Products),
        Item.Heading(R.string.General),
        Item.Heading(R.string.Account),
        getString(R.string.Email____)
          .format(user.unwrap().email)
          .prettify()
          .let { title ->
            if (!user.unwrap().verified)
              Item.Button(title, VerifyEmail, getDrawable(context!!, R.drawable.ic_warning))
            else
              Item.Info(title)
          },
        Item.Button(getString(R.string.Sign_out), SignOut),
        Item.Heading(R.string.Support),
        Item.Heading(R.string.About)
      ) }
      .bindTo(adaptor)
      .addTo(disposeBag)
    settings_list.adapter = adaptor
    settings_list.setHasFixedSize(true)
    settings_list.layoutManager = LinearLayoutManager(context)

    adaptor.itemClicks
      .map { (it as Item.Button).action }
      .subscribe{ when (it!!) {
        SignOut -> ConArtistActivity.signOut()
        VerifyEmail -> API.request.resendVerificationEmail().subscribe()
      }}
      .addTo(disposeBag)
  }
}
