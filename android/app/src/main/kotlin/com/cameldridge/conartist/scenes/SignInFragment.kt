package com.cameldridge.conartist.scenes

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Toast
import com.cameldridge.conartist.BuildConfig
import com.cameldridge.conartist.ConArtist
import com.cameldridge.conartist.ConArtistActivity
import com.cameldridge.conartist.R
import com.cameldridge.conartist.R.string
import com.cameldridge.conartist.model.ConRequest
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.model.User
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.services.api.ConArtistAPI.SignIn
import com.cameldridge.conartist.util.Null
import com.cameldridge.conartist.util.fragments.ConArtistFragment
import com.cameldridge.conartist.util.prettystring.prettify
import com.jakewharton.rxbinding3.view.clicks
import com.jakewharton.rxbinding3.widget.textChanges
import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.rxkotlin.Observables
import io.reactivex.rxkotlin.addTo
import io.reactivex.rxkotlin.withLatestFrom
import io.reactivex.schedulers.Schedulers
import io.reactivex.subjects.BehaviorSubject
import kotlinx.android.synthetic.main.fragment_sign_in.email_field
import kotlinx.android.synthetic.main.fragment_sign_in.password_field
import kotlinx.android.synthetic.main.fragment_sign_in.password_text_input_layout
import kotlinx.android.synthetic.main.fragment_sign_in.privacy_button
import kotlinx.android.synthetic.main.fragment_sign_in.sign_in_button
import kotlinx.android.synthetic.main.fragment_sign_in.terms_button
import kotlinx.android.synthetic.main.fragment_sign_in.visit_website_button

final class SignInFragment : ConArtistFragment<Null>(R.layout.fragment_sign_in) {
  private class SignInError(message: String) : Exception(message)

  private val processing = BehaviorSubject.createDefault(false)

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)

    visit_website_button.text = getString(R.string.Visit_conartist_app).prettify()

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
      .observeOn(Schedulers.io())
      .switchMap { (_, email, password) -> API.request
        .signIn(SignIn(email.toString(), password.toString()))
        .observeOn(AndroidSchedulers.mainThread())
        .toObservable()
        .onErrorResumeNext { _: Throwable ->
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
      .observeOn(Schedulers.io())
      .switchMap { _ -> Model.loadUser()
        .toObservable()
        .observeOn(AndroidSchedulers.mainThread())
        .onErrorResumeNext { _: Throwable ->
          Toast.makeText(context, R.string.An_unknown_error_has_occurred, Toast.LENGTH_SHORT).show()
          ConArtist.authorize(API.UNAUTHORIZED)
          processing.onNext(false)
          Observable.empty<User>()
        }
      }
      .doOnEach { processing.onNext(false) }
      .subscribe { ConArtistActivity.replace(ConventionListFragment()) }
      .addTo(disposeBag)

    Observable
      .merge(
        visit_website_button.clicks().map { BuildConfig.WEB_URL },
        terms_button.clicks().map { BuildConfig.TERMS_URL },
        privacy_button.clicks().map { BuildConfig.PRIVACY_URL }
      )
      .map { Intent(Intent.ACTION_VIEW, Uri.parse(it)) }
      .subscribe { startActivity(it) }
      .addTo(disposeBag)
  }
}
