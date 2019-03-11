package com.cameldridge.conartist.scenes.manage.products

import android.os.Bundle
import android.util.Log
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
import com.jakewharton.rxbinding3.appcompat.itemClicks
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import com.jakewharton.rxbinding3.view.clicks
import io.reactivex.rxkotlin.Observables
import io.reactivex.rxkotlin.addTo
import io.reactivex.rxkotlin.withLatestFrom
import io.reactivex.subjects.BehaviorSubject
import kotlinx.android.synthetic.main.fragment_manage_product_types.*
import kotlin.math.max
import kotlin.math.min

final class ManageProductTypesFragment : ConArtistFragment<Null>(R.layout.fragment_manage_product_types) {
  @MenuRes override val menu = R.menu.manage
  @DrawableRes override val backButtonIcon: Int? = R.drawable.ic_back

  private var isEditing = BehaviorSubject.createDefault(false)

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    toolbar
      .navigationClicks()
      .subscribe { ConArtistActivity.back() }
      .addTo(disposeBag)

    toolbar
      .itemClicks()
      .subscribe { item ->
        when (item.itemId) {
          R.id.edit_action -> isEditing.onNext(!isEditing.value!!)
          else -> throw RuntimeException("Unreachable")
        }
      }
      .addTo(disposeBag)

    val adaptor = RecyclerViewAdaptor<ManageProductTypeItem>(product_type_list)
    Observables
      .combineLatest(
        Model.user.map { user -> user.unwrap().productTypes },
        isEditing
      )
      .map { (types, editing) -> types.map { ManageProductTypeItem(it, editing) }}
      .bindTo(adaptor)
      .addTo(disposeBag)
    product_type_list.setHasFixedSize(true)
    product_type_list.layoutManager = LinearLayoutManager(context)

    add_button.clicks()
      .subscribe { ConArtistActivity.present(NewProductTypeFragment()) }
      .addTo(disposeBag)

    adaptor.itemClicks
      .map { it.productType }
      .subscribe { productType -> ConArtistActivity.push(ManageProductsFragment.create(productType)) }
      .addTo(disposeBag)

    adaptor.itemDrops
      .subscribe { (_item, from, to) -> {
        Log.i("DROP", "from $from to $to")
      }}
      .addTo(disposeBag)
  }
}
