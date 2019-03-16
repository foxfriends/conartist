package com.cameldridge.conartist.scenes.manage.products

import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.annotation.DrawableRes
import androidx.annotation.MenuRes
import androidx.recyclerview.widget.LinearLayoutManager
import com.apollographql.apollo.api.Response
import com.cameldridge.conartist.ConArtistActivity
import com.cameldridge.conartist.R
import com.cameldridge.conartist.item.manage.ManageProductTypeItem
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.model.ProductType
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.services.api.graphql.mutation.ModProductTypeMutation
import com.cameldridge.conartist.services.api.graphql.type.ProductTypeMod
import com.cameldridge.conartist.util.Null
import com.cameldridge.conartist.util.extension.observe
import com.cameldridge.conartist.util.fragments.ConArtistFragment
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor
import com.cameldridge.conartist.util.recyclerview.bindTo
import com.jakewharton.rxbinding3.appcompat.itemClicks
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import com.jakewharton.rxbinding3.view.clicks
import io.reactivex.Single
import io.reactivex.android.schedulers.AndroidSchedulers
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
      .withLatestFrom(Model.user.map { it.unwrap().productTypes })
      .flatMapSingle { (drop, productTypes) ->
        val (_, from, to) = drop
        val moved = productTypes.toMutableList()
        moved.add(to, moved.removeAt(from))
        val low = min(from, to)
        val hi = max(from, to)
        Single.zip(moved
          .asSequence()
          .withIndex()
          .drop(low)
          .take(hi - low + 1)
          .map { (sort, type) -> ModProductTypeMutation
              .builder()
              .productType(ProductTypeMod.builder()
                .typeId(type.id.intValue)
                .sort(sort)
                .build())
              .build()
          }
          .map { API.graphql.observe(it) }
          .toList()
        ) { it }
      }
      .flatMapSingle { Model.loadUser() }
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe(
        { },
        { error ->
          Log.e("Reordering product types", Log.getStackTraceString(error))
          Toast.makeText(context, R.string.An_unknown_error_has_occurred, Toast.LENGTH_SHORT).show()
        }
      )
      .addTo(disposeBag)
  }
}
