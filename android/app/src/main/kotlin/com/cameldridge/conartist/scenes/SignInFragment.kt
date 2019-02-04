package com.cameldridge.conartist.scenes

import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import com.apollographql.apollo.api.Input
import com.cameldridge.conartist.ConArtist
import com.cameldridge.conartist.R
import com.cameldridge.conartist.R.string
import com.cameldridge.conartist.model.ConRequest
import com.cameldridge.conartist.model.User
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.services.api.ConArtistAPI.SignIn
import com.cameldridge.conartist.services.api.graphql.query.FullUserQuery
import com.cameldridge.conartist.util.ConArtistFragment
import com.cameldridge.conartist.util.observe
import com.cameldridge.conartist.util.recover
import com.jakewharton.rxbinding3.view.clicks
import com.jakewharton.rxbinding3.widget.textChanges
import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.rxkotlin.Observables
import io.reactivex.rxkotlin.addTo
import io.reactivex.rxkotlin.withLatestFrom
import io.reactivex.subjects.BehaviorSubject
import kotlinx.android.synthetic.main.fragment_sign_in.*

class SignInFragment : ConArtistFragment(R.layout.fragment_sign_in) {
  private class SignInError(message: String) : Throwable(message)

  private val processing = BehaviorSubject.createDefault(false)

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)

    val email = email_field.textChanges().share()
    val password = password_field.textChanges().share()

    Observables
      .combineLatest(
        email.map { it.matches(Regex("""[^@]+@[^@.]+\.[^@]+""")) },
        password.map { it.isNotEmpty() },
        processing
      )
      .map { (emailValid, passwordValid, processing) -> !processing && emailValid && passwordValid }
      .subscribe { enabled -> sign_in_button.isEnabled = enabled }
      .addTo(disposeBag)
    sign_in_button.clicks()
      .withLatestFrom(email, password)
      .doOnEach { processing.onNext(true) }
      .switchMap { (_, email, password) -> API.request
        .signIn(SignIn(email.toString(), password.toString()))
        .observeOn(AndroidSchedulers.mainThread())
        .toObservable()
        .onErrorResumeNext { error: Throwable ->
          Toast.makeText(context, R.string.An_unknown_error_has_occurred, Toast.LENGTH_SHORT).show()
          processing.onNext(false)
          Observable.empty<ConRequest<String>>()
        }
      }
      .flatMap { response -> when (response) {
        is ConRequest.Success -> Observable.just(ConArtist.authorize(response.data))
        is ConRequest.Failure -> {
          password_text_input_layout.error = getString(string.Your_password_is_incorrect)
          processing.onNext(false)
          Observable.empty()
        }
      }}
      .switchMap { _ -> API.graphql
        .observe(FullUserQuery(Input.absent()))
        .map { it.user.fragments.fullUserFragment }
        .map { User.fromFragment(it) }
        .observeOn(AndroidSchedulers.mainThread())
        .onErrorResumeNext { error: Throwable ->
          Toast.makeText(context, R.string.An_unknown_error_has_occurred, Toast.LENGTH_SHORT).show()
          ConArtist.authorize(API.UNAUTHORIZED)
          processing.onNext(false)
          Observable.empty<User>()
        }
      }
      .map { user -> ConArtist.signIn(user) }
      .doOnEach { processing.onNext(false) }
      .subscribe { ConArtist.replace(ConventionListFragment()) }
      .addTo(disposeBag)
  }
}
