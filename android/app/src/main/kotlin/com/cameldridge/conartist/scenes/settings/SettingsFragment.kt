package com.cameldridge.conartist.scenes.settings

import android.content.Intent
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Bundle
import android.view.View
import androidx.annotation.LayoutRes
import androidx.appcompat.content.res.AppCompatResources.getDrawable
import androidx.recyclerview.widget.LinearLayoutManager
import com.cameldridge.conartist.BuildConfig
import com.cameldridge.conartist.ConArtistActivity
import com.cameldridge.conartist.R
import com.cameldridge.conartist.R.drawable
import com.cameldridge.conartist.R.string
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action.*
import com.cameldridge.conartist.item.SettingsButtonItem
import com.cameldridge.conartist.item.SettingsHeadingItem
import com.cameldridge.conartist.item.SettingsInfoItem
import com.cameldridge.conartist.item.SettingsSelectionItem
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.model.Money.Currency
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.util.Null
import com.cameldridge.conartist.util.fragments.ConArtistFragment
import com.cameldridge.conartist.util.option.Option
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor
import com.cameldridge.conartist.util.recyclerview.bindTo
import com.cameldridge.conartist.util.prettystring.prettify
import com.cameldridge.conartist.util.option.Option.*
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import io.reactivex.rxkotlin.addTo
import kotlinx.android.synthetic.main.fragment_convention_list.toolbar
import kotlinx.android.synthetic.main.fragment_settings.settings_list
import kotlinx.android.synthetic.main.item_settings_button.view.detail_icon
import kotlinx.android.synthetic.main.item_settings_heading.view.title_label

class SettingsFragment : ConArtistFragment<Null>(R.layout.fragment_settings) {
  final enum class Action {
    VerifyEmail,
    SignOut,
    ChooseCurrency,
    PrivacyPolicy,
    TermsOfService;
  }

  override val title get() = getString(R.string.Settings)
  override val backButtonIcon = R.drawable.ic_close

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    toolbar
      .navigationClicks()
      .subscribe { ConArtistActivity.back() }
      .addTo(disposeBag)

    val adaptor = RecyclerViewAdaptor()
    Model.user
      .map { user -> listOf(
        SettingsHeadingItem(string.Products),
        SettingsHeadingItem(string.General),
        SettingsSelectionItem(getString(R.string.Currency), ChooseCurrency, SettingsSelectFragment.Item.Currency(user.unwrap().settings.currency)),
        SettingsHeadingItem(string.Account),
        getString(R.string.Email____)
          .format(user.unwrap().email)
          .prettify()
          .let { title ->
            if (!user.unwrap().verified)
              SettingsButtonItem(title, VerifyEmail, getDrawable(context!!, drawable.ic_warning))
            else
              SettingsInfoItem(title)
          },
        SettingsButtonItem(getString(string.Sign_out), SignOut),
        SettingsHeadingItem(string.Support),
        SettingsHeadingItem(string.About),
        SettingsInfoItem(getString(string.Version).format(BuildConfig.VERSION_NAME).prettify()),
        SettingsButtonItem(getString(string.Privacy_Policy), PrivacyPolicy),
        SettingsButtonItem(getString(string.Terms_of_Service), TermsOfService)
      ) }
      .bindTo(adaptor)
      .addTo(disposeBag)
    settings_list.adapter = adaptor
    settings_list.setHasFixedSize(true)
    settings_list.layoutManager = LinearLayoutManager(context)

    adaptor.itemClicks
      .map {
        when (it) {
          is SettingsButtonItem -> Some(it.action)
          is SettingsSelectionItem -> Some(it.action)
          else -> None<Action>()
        }
      }
      .filter { it is Some }
      .subscribe {
        when (it.unwrap()) {
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
        }
      }
      .addTo(disposeBag)
  }
}
