package com.cameldridge.conartist.scenes.manage.products

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import androidx.annotation.DrawableRes
import androidx.annotation.MenuRes
import androidx.appcompat.content.res.AppCompatResources
import androidx.recyclerview.widget.LinearLayoutManager
import com.cameldridge.conartist.BuildConfig
import com.cameldridge.conartist.ConArtistActivity
import com.cameldridge.conartist.R
import com.cameldridge.conartist.R.drawable
import com.cameldridge.conartist.R.string
import com.cameldridge.conartist.item.manage.ManageProductTypeItem
import com.cameldridge.conartist.item.settings.SettingsButtonItem
import com.cameldridge.conartist.item.settings.SettingsHeadingItem
import com.cameldridge.conartist.item.settings.SettingsInfoItem
import com.cameldridge.conartist.item.settings.SettingsSelectionItem
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.model.Money
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action.ChooseCurrency
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action.PrivacyPolicy
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action.SignOut
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action.TermsOfService
import com.cameldridge.conartist.scenes.settings.SettingsFragment.Action.VerifyEmail
import com.cameldridge.conartist.scenes.settings.SettingsSelectFragment
import com.cameldridge.conartist.scenes.settings.SettingsSelectFragment.Item.Currency
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
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor.Item
import com.cameldridge.conartist.util.recyclerview.bindTo
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import io.reactivex.rxkotlin.addTo
import kotlinx.android.synthetic.main.fragment_manage_product_types.*

final class ManageProductTypesFragment : ConArtistFragment<Null>(R.layout.fragment_manage_product_types) {
  @MenuRes override val menu = R.menu.manage
  @DrawableRes override val backButtonIcon: Int? = R.drawable.ic_back

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    toolbar
      .navigationClicks()
      .subscribe { ConArtistActivity.back() }
      .addTo(disposeBag)

    val adaptor = RecyclerViewAdaptor<Item>()
    Model.user
      .map { user -> user.unwrap().productTypes }
      .map { types -> types.map { ManageProductTypeItem(it) as RecyclerViewAdaptor.Item }}
      .bindTo(adaptor)
      .addTo(disposeBag)
    product_type_list.adapter = adaptor
    product_type_list.setHasFixedSize(true)
    product_type_list.layoutManager = LinearLayoutManager(context)

    adaptor.itemClicks
      .map { when (it) {
        is ManageProductTypeItem -> it
        else -> null
      } }
      .map { it.productType }
      .subscribe { /* TODO: present the next view */ }
      .addTo(disposeBag)
  }
}
