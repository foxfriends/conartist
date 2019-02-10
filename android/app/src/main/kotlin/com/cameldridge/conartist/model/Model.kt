package com.cameldridge.conartist.model

import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.services.api.graphql.query.FullUserQuery
import com.cameldridge.conartist.util.Option
import com.cameldridge.conartist.util.Option.None
import com.cameldridge.conartist.util.asOption
import com.cameldridge.conartist.util.extension.observe
import io.reactivex.Observable
import io.reactivex.Single
import io.reactivex.subjects.BehaviorSubject

object Model {
  private val _user = BehaviorSubject.createDefault<Option<User>>(None())
  val user get(): Observable<Option<User>> = _user

  fun setUser(user: User?) = _user.onNext(user.asOption)

  fun loadUser(): Single<User> = API.graphql
    .observe(FullUserQuery.builder().build())
    .map { it.user.fragments.fullUserFragment }
    .map { User.fromFragment(it) }
    .doAfterSuccess { _user.onNext(it.asOption) }
}
