package com.cameldridge.conartist.services

import android.app.Activity
import com.cameldridge.conartist.ConArtist
import com.cameldridge.conartist.model.User
import com.squareup.moshi.Moshi

sealed class StorageKey<T> {
  abstract val name: String
  abstract val TClass: Class<T>

  object AuthToken: StorageKey<String>() {
    override val name = "authtoken"
    override val TClass = String::class.java
  }

  object CurrentUser: StorageKey<User>() {
    override val name = "currentuser"
    override val TClass = User::class.java
  }
}

object Storage {
  private val prefs get() = ConArtist.root.getSharedPreferences("conartist.preferences", Activity.MODE_PRIVATE)

  fun <T> store(item: T, key: StorageKey<T>) = prefs
    .edit()
    .putString(key.name, JSON.converter.adapter(key.TClass).toJson(item))
    .apply()

  fun <T> retrieve(key: StorageKey<T>): T? = prefs
    .getString(key.name, null)
    ?.let { JSON.converter.adapter(key.TClass).fromJson(it) }

  fun <T> remove(key: StorageKey<T>) = prefs
    .edit()
    .remove(key.name)
    .apply()
}
