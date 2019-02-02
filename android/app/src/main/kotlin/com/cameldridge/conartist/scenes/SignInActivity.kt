package com.cameldridge.conartist.scenes

import android.os.Bundle
import com.cameldridge.conartist.R
import com.cameldridge.conartist.R.layout

import com.cameldridge.conartist.model.ConRequest
import com.cameldridge.conartist.services.API
import com.cameldridge.conartist.services.ConArtistAPI.SignIn
import com.cameldridge.conartist.util.ConArtistActivity

import com.jakewharton.rxbinding3.view.clicks
import com.jakewharton.rxbinding3.widget.textChanges

import io.reactivex.rxkotlin.Observables
import io.reactivex.rxkotlin.addTo
import io.reactivex.rxkotlin.withLatestFrom

import kotlinx.android.synthetic.main.activity_sign_in.*

class SignInActivity : ConArtistActivity(layout.activity_sign_in) {
  private class SignInError(message: String): Throwable(message)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val email = email_field.textChanges().share()
    val password = password_field.textChanges().share()

    Observables
      .combineLatest(
        email.map { it.matches(Regex("[^@]+@[^@.]+\\.[^@]+")) },
        password.map { it.isNotEmpty() }
      )
      .map { (emailValid, passwordValid) -> emailValid && passwordValid }
      .subscribe { enabled -> sign_in_button.isEnabled = enabled }
      .addTo(disposeBag)

    sign_in_button.clicks()
      .withLatestFrom(email, password)
      .switchMap { (_, email, password) -> API.request
        .signIn(SignIn(email.toString(), password.toString()))
        .toObservable()
      }
      .map { response -> when (response) {
        is ConRequest.Success -> { API.authtoken = response.data } // TODO: handle signing in
        is ConRequest.Failure -> throw SignInError(getString(R.string.Your_password_is_incorrect))
      }}
      .subscribe(
        {},
        { error -> when (error) {
          is SignInError -> {} // TODO: show the error message
          else -> {} // TODO: this was a real error!
        }}
      )
      .addTo(disposeBag)
  }
}
