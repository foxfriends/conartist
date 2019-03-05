package com.cameldridge.conartist.scenes.manage.products

import android.os.Bundle
import android.view.View
import androidx.annotation.DrawableRes
import androidx.annotation.MenuRes
import androidx.recyclerview.widget.LinearLayoutManager
import com.cameldridge.conartist.ConArtistActivity
import com.cameldridge.conartist.R
import com.cameldridge.conartist.item.manage.ManageProductTypeItem
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.util.Null
import com.cameldridge.conartist.util.fragments.ConArtistFragment
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor
import com.cameldridge.conartist.util.recyclerview.bindTo
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import com.jakewharton.rxbinding3.view.clicks
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

    val adaptor = RecyclerViewAdaptor<ManageProductTypeItem>()
    Model.user
      .map { user -> user.unwrap().productTypes }
      .map { types -> types.map { ManageProductTypeItem(it) }}
      .bindTo(adaptor)
      .addTo(disposeBag)
    product_type_list.adapter = adaptor
    product_type_list.setHasFixedSize(true)
    product_type_list.layoutManager = LinearLayoutManager(context)

    add_button.clicks()
      .subscribe { ConArtistActivity.present(NewProductTypeFragment()) }
      .addTo(disposeBag)

    adaptor.itemClicks
      .map { it.productType }
      .subscribe { productType -> ConArtistActivity.push(ManageProductsFragment.create(productType)) }
      .addTo(disposeBag)
  }
}
