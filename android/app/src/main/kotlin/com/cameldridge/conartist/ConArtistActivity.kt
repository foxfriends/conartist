package com.cameldridge.conartist

import android.graphics.Typeface
import android.os.Bundle
import android.os.Parcelable
import android.view.LayoutInflater
import android.widget.Toast
import androidx.annotation.StringRes
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.FragmentManager
import com.apollographql.apollo.exception.ApolloNetworkException
import com.cameldridge.conartist.model.ConRequest.Failure
import com.cameldridge.conartist.model.ConRequest.Success
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.scenes.ConventionListFragment
import com.cameldridge.conartist.scenes.SignInFragment
import com.cameldridge.conartist.services.Storage
import com.cameldridge.conartist.services.StorageKey
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.util.fragments.ConArtistFragment
import com.cameldridge.conartist.util.prettystring.Attribute.TextColor
import com.cameldridge.conartist.util.prettystring.Config
import com.cameldridge.conartist.util.prettystring.Rule
import com.cameldridge.conartist.util.extension.transaction
import com.cameldridge.conartist.util.extension.visibleFragment
import com.cameldridge.conartist.util.fragments.FragmentReturn
import com.cameldridge.conartist.util.prettystring.Attribute.TextStyle
import io.reactivex.Maybe
import io.reactivex.Single
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.subjects.PublishSubject
import kotlinx.android.synthetic.main.item_toast.toast_container
import kotlinx.android.synthetic.main.item_toast.view.title_label
import java.lang.ref.WeakReference
import java.util.Stack
import java.util.Timer
import java.util.TreeMap
import kotlin.concurrent.schedule

final class ConArtistActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    ConArtistActivity.fragmentManager = WeakReference(supportFragmentManager)

    setContentView(R.layout.activity_con_artist)

    Storage.retrieve(StorageKey.AuthToken)?.let {
      API.authtoken = it
      API.request.reauthorize()
        .subscribe(
          { when (it) {
            is Success -> ConArtist.authorize(it.data)
            is Failure -> {
              ConArtist.signOut()
              showToast(R.string.Uh_oh__You_have_been_logged_out_)
            } // TODO: toast them here
          } },
          { } // TODO: show an error?
        )
      Model.setUser(Storage.retrieve(StorageKey.CurrentUser))
      Model.loadUser().observeOn(AndroidSchedulers.mainThread()).subscribe(
        { /* ok */ },
        { error -> Toast.makeText(this, R.string.An_unknown_error_has_occurred, Toast.LENGTH_SHORT).show() }
      )
      set(ConventionListFragment())
    } ?: set(SignInFragment())
  }

  fun showToast(@StringRes message: Int) {
    val view = LayoutInflater.from(this).inflate(R.layout.item_toast, toast_container)
    view.title_label.setText(message)
    val toast = Toast(this)
    toast.view = view
    toast.duration = Toast.LENGTH_SHORT
    toast.show()
  }

  companion object {
    // this is a dirty implementation of what will hopefully be a clean API
    private val responses: Stack<Any> = Stack()

    lateinit var fragmentManager: WeakReference<FragmentManager>
    private val backstackName get() = "${fragmentManager.get()!!.backStackEntryCount}"

    fun <A: Parcelable, T: ConArtistFragment<A>> set(fragment: T) {
      fragmentManager.get()!!.transaction {
        replace(R.id.fragment_container, fragment)
      }
    }

    fun <A: Parcelable, T: ConArtistFragment<A>> replace(fragment: T) {
      val toRemove = fragmentManager.get()!!.visibleFragment()
      fragmentManager.get()!!.transaction {
        setCustomAnimations(R.anim.push, R.anim.leave, R.anim.come_back, R.anim.pop)
        toRemove?.let(::hide)
        add(R.id.fragment_container, fragment)
      }
      // Remove the fragment after the transition is completed.
      // This is kind of a hack, but whatever.
      Timer().schedule(500) {
        fragmentManager.get()!!.transaction {
          toRemove?.let(::remove)
        }
      }
    }

    fun <A: Parcelable, T: ConArtistFragment<A>> push(fragment: T) {
      fragmentManager.get()!!.transaction {
        setCustomAnimations(R.anim.push, R.anim.leave, R.anim.come_back, R.anim.pop)
        fragmentManager.get()!!.visibleFragment()?.let(::hide)
        add(R.id.fragment_container, fragment)
        addToBackStack(backstackName)
      }
    }

    fun <A: Parcelable, T: ConArtistFragment<A>> present(fragment: T) {
      fragmentManager.get()!!.transaction {
        setCustomAnimations(R.anim.present, R.anim.fly, R.anim.fall, R.anim.dismiss)
        fragmentManager.get()!!.visibleFragment()?.let(::hide)
        add(R.id.fragment_container, fragment)
        addToBackStack(backstackName)
      }
    }

    fun <A: Parcelable, R: Parcelable, T> presentForResult(fragment: T): Maybe<R>
      where T: ConArtistFragment<A>,
            T: FragmentReturn<R> {
      present(fragment)
      val responder = PublishSubject.create<R>()
      responses.push(responder)
      return responder.singleElement()
    }

    fun <R: Parcelable, F: FragmentReturn<R>> respond(response: R) {
      @Suppress("UNCHECKED_CAST")
      responses.peek()
        ?.let { (it as PublishSubject<R>).onNext(response) }
      back()
    }

    fun back() {
      @Suppress("UNCHECKED_CAST")
      if (!responses.isEmpty()) {
        responses.pop()
          ?.let { (it as PublishSubject<R>).onComplete() }
      }
      fragmentManager.get()!!.popBackStack()
    }

    fun signOut() {
      fragmentManager.get()!!.popBackStack("0", FragmentManager.POP_BACK_STACK_INCLUSIVE)
      set(SignInFragment())
    }
  }
}
