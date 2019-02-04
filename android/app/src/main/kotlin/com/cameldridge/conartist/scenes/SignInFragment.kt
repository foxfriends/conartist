package com.cameldridge.conartist.scenes

import android.os.Bundle
import android.view.View
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
import com.jakewharton.rxbinding3.view.clicks
import com.jakewharton.rxbinding3.widget.textChanges
import io.reactivex.rxkotlin.Observables
import io.reactivex.rxkotlin.addTo
import io.reactivex.rxkotlin.withLatestFrom
import kotlinx.android.synthetic.main.fragment_sign_in.*

class SignInFragment : ConArtistFragment(R.layout.fragment_sign_in) {
  private class SignInError(message: String) : Throwable(message)

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)

    val email = email_field.textChanges().share()
    val password = password_field.textChanges().share()

    Observables
      .combineLatest(
        email.map { it.matches(Regex("""[^@]+@[^@.]+\.[^@]+""")) },
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
        is ConRequest.Success -> ConArtist.authorize(response.data)
        is ConRequest.Failure -> throw SignInError(getString(string.Your_password_is_incorrect))
      }}
      .switchMap { _ -> API.graphql.observe(FullUserQuery(Input.absent())) }
      .map { it.user.fragments.fullUserFragment }
      .map { User.fromFragment(it) }
      .map { user -> ConArtist.signIn(user) }
      .subscribe(
        { ConArtist.replace(ConventionListFragment()) },
        { error -> when (error) {
          is SignInError -> {} // TODO: show the error message
          else -> {} // TODO: this was a real error!
        }}
      )
      .addTo(disposeBag)
  }
}
