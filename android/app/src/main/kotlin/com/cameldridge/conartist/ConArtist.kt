package com.cameldridge.conartist

import android.app.Application
import android.content.Context
import android.graphics.Typeface
import com.cameldridge.conartist.R.color
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.services.Storage
import com.cameldridge.conartist.services.StorageKey
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.util.prettystring.Attribute.TextColor
import com.cameldridge.conartist.util.prettystring.Attribute.TextStyle
import com.cameldridge.conartist.util.prettystring.Config
import com.cameldridge.conartist.util.prettystring.Rule
import java.lang.ref.WeakReference

final class ConArtist : Application() {
  override fun onCreate() {
    super.onCreate()
    context = WeakReference(applicationContext)
    configPrettyString()
  }
  
  private fun configPrettyString() {
    Config.default = Config(
      listOf(TextColor(getColor(color.text))),
      listOf(
        Rule("action", listOf(TextColor(getColor(color.text_action)))),
        Rule("light", listOf(
          TextColor(getColor(color.text_placeholder)),
          TextStyle(Typeface.NORMAL)
        ))
      )
    )
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
