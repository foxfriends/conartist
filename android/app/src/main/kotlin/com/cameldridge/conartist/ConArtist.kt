package com.cameldridge.conartist

import android.app.Application
import android.content.Context
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.services.Storage
import com.cameldridge.conartist.services.StorageKey
import com.cameldridge.conartist.services.api.API
import java.lang.ref.WeakReference

class ConArtist : Application() {
  override fun onCreate() {
    super.onCreate()
    context = WeakReference(applicationContext)
  }

  companion object {
    lateinit var context: WeakReference<Context>

    fun authorize(authtoken: String) {
      API.authtoken = authtoken
      Storage.store(authtoken, StorageKey.AuthToken)
    }

    fun signOut() {
      Model.setUser(null)
      Storage.remove(StorageKey.AuthToken)
      API.authtoken = API.UNAUTHORIZED
      ConArtistActivity.signOut()
    }
  }
}
