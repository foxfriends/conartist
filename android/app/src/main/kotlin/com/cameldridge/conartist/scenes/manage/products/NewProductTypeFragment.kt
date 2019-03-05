package com.cameldridge.conartist.scenes.manage.products

import android.os.Bundle
import android.view.View
import android.widget.Toast
import com.cameldridge.conartist.ConArtistActivity
import com.cameldridge.conartist.R
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.model.ProductType
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.services.api.graphql.mutation.AddProductTypeMutation
import com.cameldridge.conartist.services.api.graphql.type.ProductTypeAdd
import com.cameldridge.conartist.util.Null
import com.cameldridge.conartist.util.extension.observe
import com.cameldridge.conartist.util.fragments.ConArtistFragment
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import com.jakewharton.rxbinding3.view.clicks
import com.jakewharton.rxbinding3.widget.textChanges
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.rxkotlin.addTo
import io.reactivex.rxkotlin.withLatestFrom
import kotlinx.android.synthetic.main.fragment_new_product_type.*

final class NewProductTypeFragment: ConArtistFragment<Null>(R.layout.fragment_new_product_type) {
  override val title: String? get() = getString(R.string.New_Product_Type)
  override val backButtonIcon: Int? = R.drawable.ic_close

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)

    toolbar.navigationClicks()
      .subscribe { ConArtistActivity.back() }
      .addTo(disposeBag)

    name_field.textChanges()
      .map { name -> name.isNotEmpty() && Model.user.value!!.unwrap().productTypes.find { it.name == name } == null }
      .subscribe { isOk -> save_button.isEnabled = isOk }
      .addTo(disposeBag)

    save_button.clicks()
      .withLatestFrom(name_field.textChanges())
      .map { (_, name) -> name.toString() }
      .flatMap { name -> API.graphql
        .observe(
          AddProductTypeMutation
            .builder()
            .productType(ProductTypeAdd
              .builder()
              .name(name)
              .color(0xFFFFFF)
              .sort(Model.user.value!!.unwrap().productTypes.size)
              .build())
            .build()
        )
        .map { it -> it.addUserProductType.fragments.productTypeFragment }
        .map { Result.success(ProductType.fromFragment(it)) }
        .toObservable()
        .onErrorReturn { Result.failure(it) }
      }
      .observeOn(AndroidSchedulers.mainThread())
      .subscribe { result ->
        if (result.isSuccess) {
          val productType = result.getOrThrow()
          Model.addProductType(productType)
          ConArtistActivity.back()
        } else {
          val exception = result.exceptionOrNull()
          Toast.makeText(context, R.string.An_unknown_error_has_occurred, Toast.LENGTH_SHORT).show()
        }
      }
      .addTo(disposeBag)
  }
}
