package com.cameldridge.conartist.scenes.settings

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.content.res.AppCompatResources.getDrawable
import androidx.recyclerview.widget.LinearLayoutManager
import com.cameldridge.conartist.BuildConfig
import com.cameldridge.conartist.ConArtistActivity
import com.cameldridge.conartist.R
import com.cameldridge.conartist.item.settings.SettingsButtonItem
import com.cameldridge.conartist.item.settings.SettingsHeadingItem
import com.cameldridge.conartist.item.settings.SettingsInfoItem
import com.cameldridge.conartist.item.settings.SettingsListItem
import com.cameldridge.conartist.item.settings.SettingsSelectionItem
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.model.Money.Currency
import com.cameldridge.conartist.scenes.manage.products.ManageProductTypesFragment
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action.ChooseCurrency
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action.ManageProducts
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action.PrivacyPolicy
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action.SignOut
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action.TermsOfService
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action.VerifyEmail
import com.cameldridge.conartist.scenes.settings.SettingsSelectFragment.Item
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.services.api.graphql.mutation.UpdateCurrencyMutation
import com.cameldridge.conartist.util.Null
import com.cameldridge.conartist.util.extension.observe
import com.cameldridge.conartist.util.fragments.ConArtistFragment
import com.cameldridge.conartist.util.option.Option.None
import com.cameldridge.conartist.util.option.Option.Some
import com.cameldridge.conartist.util.option.asOption
import com.cameldridge.conartist.util.prettystring.prettify
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor
import com.cameldridge.conartist.util.recyclerview.bindTo
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import io.reactivex.rxkotlin.addTo
import kotlinx.android.synthetic.main.fragment_convention_list.toolbar
import kotlinx.android.synthetic.main.fragment_settings.settings_list

final class SettingsFragment : ConArtistFragment<Null>(R.layout.fragment_settings) {
  final enum class Action {
    ManageProducts,
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

    val adaptor = RecyclerViewAdaptor<SettingsListItem>()
    Model.user
      .map { user -> listOf(
        SettingsHeadingItem(R.string.Products),
        SettingsButtonItem(getString(R.string.Manage_Products), ManageProducts),
        SettingsHeadingItem(R.string.General),
        SettingsSelectionItem(
          getString(R.string.Currency), ChooseCurrency,
          Item.Currency(user.unwrap().settings.currency)
        ),
        SettingsHeadingItem(R.string.Account),
        getString(R.string.Email____)
          .format(user.unwrap().email)
          .prettify()
          .let { title ->
            if (!user.unwrap().verified)
              SettingsButtonItem(
                title, VerifyEmail, getDrawable(context!!, R.drawable.ic_warning)
              )
            else
              SettingsInfoItem(title)
          },
        SettingsButtonItem(
          getString(R.string.Sign_out), SignOut
        ),
        SettingsHeadingItem(R.string.Support),
        SettingsHeadingItem(R.string.About),
        SettingsInfoItem(
          getString(R.string.Version).format(BuildConfig.VERSION_NAME).prettify()
        ),
        SettingsButtonItem(
          getString(R.string.Privacy_Policy), PrivacyPolicy
        ),
        SettingsButtonItem(
          getString(R.string.Terms_of_Service), TermsOfService
        )
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
          ManageProducts -> ConArtistActivity.present(ManageProductTypesFragment())
          SignOut -> ConArtistActivity.signOut()
          VerifyEmail -> API.request.resendVerificationEmail().subscribe()
          ChooseCurrency -> ConArtistActivity
            .presentForResult(SettingsSelectFragment.create(
              title = getString(R.string.Currency),
              options = Currency.variants.map { SettingsSelectFragment.Item.Currency(it) },
              selected = SettingsSelectFragment.Item.Currency(Model.user.value!!.unwrap().settings.currency)
            ))
            .map { it.currency }
            .flatMap { currency ->
              Model.setCurrency(currency)
              API.graphql
                .observe(UpdateCurrencyMutation.builder().currency(currency).build())
                .toMaybe()
            }
            .subscribe(
              {},
              { _error -> Toast.makeText(context, R.string.An_unknown_error_has_occurred, Toast.LENGTH_SHORT).show() }
            )
          PrivacyPolicy -> startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(BuildConfig.PRIVACY_URL)))
          TermsOfService -> startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(BuildConfig.TERMS_URL)))
        }
      }
      .addTo(disposeBag)
  }
}
