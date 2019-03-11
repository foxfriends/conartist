package com.cameldridge.conartist.scenes.manage.products

import android.os.Bundle
import android.os.Parcelable
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import com.cameldridge.conartist.ConArtistActivity
import com.cameldridge.conartist.R
import com.cameldridge.conartist.item.manage.ManageProductItem
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.model.ProductType
import com.cameldridge.conartist.scenes.manage.products.ManageProductsFragment.Arguments
import com.cameldridge.conartist.util.fragments.ConArtistFragment
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor
import com.cameldridge.conartist.util.recyclerview.bindTo
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import io.reactivex.rxkotlin.addTo
import kotlinx.android.parcel.Parcelize
import kotlinx.android.synthetic.main.fragment_manage_products.*

final class ManageProductsFragment: ConArtistFragment<Arguments>(R.layout.fragment_manage_products) {
  override val backButtonIcon: Int? = R.drawable.ic_back
  override val title: String? get() = args.productType.name

  @Parcelize
  data class Arguments(
    val productType: ProductType
  ): Parcelable

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)

    toolbar
      .navigationClicks()
      .subscribe { ConArtistActivity.back() }
      .addTo(disposeBag)

    val adaptor = RecyclerViewAdaptor<ManageProductItem>(products_list)
    Model.user
      .map { user -> user.unwrap().products }
      .map { products -> products.filter { it.typeId == args.productType.id } }
      .map { products -> products.map { ManageProductItem(it) }}
      .bindTo(adaptor)
      .addTo(disposeBag)
    products_list.setHasFixedSize(true)
    products_list.layoutManager = LinearLayoutManager(context)

    adaptor.itemClicks
      .map { it.product }
      .subscribe { /* TODO: present the next view */ }
      .addTo(disposeBag)
  }

  companion object {
    fun create(productType: ProductType)
      = ConArtistFragment.create(ManageProductsFragment(), Arguments(productType))
  }
}
