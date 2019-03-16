package com.cameldridge.conartist.model

import android.util.Log
import com.cameldridge.conartist.model.Money.Currency
import com.cameldridge.conartist.services.Storage
import com.cameldridge.conartist.services.StorageKey.CurrentUser
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.services.api.graphql.query.FullUserQuery
import com.cameldridge.conartist.util.extension.observe
import com.cameldridge.conartist.util.option.Option
import com.cameldridge.conartist.util.option.Option.None
import com.cameldridge.conartist.util.option.Option.Some
import com.cameldridge.conartist.util.option.asOption
import io.reactivex.Single
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.subjects.BehaviorSubject

object Model {
  val user = BehaviorSubject.createDefault<Option<User>>(None())

  fun setUser(user: User?) = this.user.onNext(user.asOption)

  fun loadUser(): Single<User> = API.graphql
    .observe(FullUserQuery.builder().build())
    .map { it.user.fragments.fullUserFragment }
    .map { User.fromFragment(it) }
    .doAfterSuccess {
      Storage.store(it, CurrentUser)
      when (user.value!!) {
        is None -> user.onNext(it.asOption)
        is Some -> user.onNext(user.value!!.unwrap().merge(it).asOption)
      }
    }

  fun setCurrency(currency: Currency) {
    user.onNext(user.value!!.unwrap().withCurrency(currency).asOption)
  }

  fun addProductType(productType: ProductType) {
    user.onNext(user.value!!.unwrap().addProductType(productType).asOption)
  }
}
