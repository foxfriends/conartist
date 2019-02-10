package com.cameldridge.conartist.services

import android.app.Activity
import com.cameldridge.conartist.ConArtist

object Storage {
  private val prefs get() = ConArtist.context.get()!!
    .getSharedPreferences("conartist.preferences", Activity.MODE_PRIVATE)

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
