package com.cameldridge.conartist.scenes.settings

import android.content.Intent
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Bundle
import android.view.View
import androidx.annotation.LayoutRes
import androidx.annotation.StringRes
import androidx.appcompat.content.res.AppCompatResources.getDrawable
import androidx.recyclerview.widget.LinearLayoutManager
import com.cameldridge.conartist.BuildConfig
import com.cameldridge.conartist.ConArtistActivity
import com.cameldridge.conartist.R
import com.cameldridge.conartist.R.drawable
import com.cameldridge.conartist.R.string
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.model.Money.Currency
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action.*
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Item.Button
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Item.Heading
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Item.Info
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.util.Null
import com.cameldridge.conartist.util.fragments.ConArtistFragment
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor
import com.cameldridge.conartist.util.recyclerview.bindTo
import com.cameldridge.conartist.util.prettystring.prettify
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import io.reactivex.rxkotlin.addTo
import kotlinx.android.synthetic.main.fragment_convention_list.toolbar
import kotlinx.android.synthetic.main.fragment_settings.settings_list
import kotlinx.android.synthetic.main.item_settings_button.view.detail_icon
import kotlinx.android.synthetic.main.item_settings_heading.view.title_label

class SettingsFragment : ConArtistFragment<Null>(R.layout.fragment_settings) {
  override val title get() = getString(R.string.Settings)
  override val backButtonIcon = R.drawable.ic_close

  private final enum class Action {
    VerifyEmail,
    SignOut,
    ChooseCurrency,
    PrivacyPolicy,
    TermsOfService;
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
        Heading(string.Products),
        Heading(string.General),
        Heading(string.Account),
        getString(R.string.Email____)
          .format(user.unwrap().email)
          .prettify()
          .let { title ->
            if (!user.unwrap().verified)
              Button(title, VerifyEmail, getDrawable(context!!, drawable.ic_warning))
            else
              Info(title)
          },
        Button(getString(string.Sign_out), SignOut),
        Heading(string.Support),
        Heading(string.About),
        Info(getString(string.Version).format(BuildConfig.VERSION_NAME).prettify()),
        Button(getString(string.Privacy_Policy), PrivacyPolicy),
        Button(getString(string.Terms_of_Service), TermsOfService)
      ) }
      .bindTo(adaptor)
      .addTo(disposeBag)
    settings_list.adapter = adaptor
    settings_list.setHasFixedSize(true)
    settings_list.layoutManager = LinearLayoutManager(context)

    adaptor.itemClicks
      .map { (it as Button).action }
      .subscribe { when (it!!) {
        SignOut -> ConArtistActivity.signOut()
        VerifyEmail -> API.request.resendVerificationEmail().subscribe()
        ChooseCurrency -> ConArtistActivity
          .present(SettingsSelectFragment.create(
            title = getString(R.string.Currency),
            options = Currency.variants.map { SettingsSelectFragment.Item.Currency(it) },
            selected = SettingsSelectFragment.Item.Currency(Currency.CAD)
          ))
        PrivacyPolicy -> startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(BuildConfig.PRIVACY_URL)))
        TermsOfService -> startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(BuildConfig.TERMS_URL)))
      }}
      .addTo(disposeBag)
  }
}
