package com.cameldridge.conartist

import android.os.Bundle

import com.jakewharton.rxbinding3.view.clicks
import com.jakewharton.rxbinding3.widget.textChanges

import io.reactivex.Observable
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.rxkotlin.Observables
import io.reactivex.rxkotlin.addTo

import kotlinx.android.synthetic.main.activity_sign_in.*

import com.cameldridge.conartist.util.ConArtistActivity

class SignInActivity : ConArtistActivity(R.layout.activity_sign_in) {
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
      .subscribe() // TODO: sign in here
      .addTo(disposeBag)
  }
}
