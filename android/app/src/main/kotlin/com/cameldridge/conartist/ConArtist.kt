package com.cameldridge.conartist

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.cameldridge.conartist.model.User
import com.cameldridge.conartist.scenes.SignInFragment
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.util.ConArtistFragment
import com.cameldridge.conartist.util.transaction
import io.reactivex.subjects.BehaviorSubject

class ConArtist : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    root = this
    setContentView(R.layout.activity_con_artist)
    supportFragmentManager.transaction {
      replace(R.id.fragment_container, SignInFragment())
    }
  }

  companion object {
    lateinit var root: ConArtist
    val user = BehaviorSubject.create<User>()

    private lateinit var currentFragment: ConArtistFragment

    fun <T: ConArtistFragment> replace(fragment: T) {
      root.supportFragmentManager.transaction {
        replace(R.id.fragment_container, fragment)
        currentFragment = fragment
      }
    }

    fun <T: ConArtistFragment> push(fragment: T) {
      root.supportFragmentManager.transaction {
        hide(currentFragment)
        add(R.id.fragment_container, fragment)
        currentFragment = fragment
      }
    }

    fun <T: ConArtistFragment> present(fragment: T) {
      root.supportFragmentManager.transaction {
        hide(currentFragment)
        add(R.id.fragment_container, fragment)
        currentFragment = fragment
      }
    }

    fun <T: ConArtistFragment> back() {
      root.supportFragmentManager.popBackStack()
    }

    fun authorize(authtoken: String) {
      API.authtoken = authtoken
    }

    fun signIn(user: User) {
      this.user.onNext(user)
    }
  }
}
