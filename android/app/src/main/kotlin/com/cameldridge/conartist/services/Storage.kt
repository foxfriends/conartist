package com.cameldridge.conartist.services

import android.app.Activity
import android.util.Log
import com.cameldridge.conartist.ConArtist
import com.squareup.moshi.JsonDataException

object Storage {
  private val prefs get() = ConArtist.context.get()!!
    .getSharedPreferences("conartist.preferences", Activity.MODE_PRIVATE)

  fun <T> store(item: T, key: StorageKey<T>) = prefs
    .edit()
    .putString(key.name, JSON.converter.adapter(key.TClass).toJson(item))
    .apply()

  fun <T> retrieve(key: StorageKey<T>): T? = prefs
    .getString(key.name, null)
    ?.let {
      try {
        JSON.converter.adapter(key.TClass).fromJson(it)
      } catch (e: JsonDataException) {
        Log.d("Storage.retrieve", e.message)
        remove(key)
        null
      }
    }
  fun <T> remove(key: StorageKey<T>) = prefs
    .edit()
    .remove(key.name)
    .apply()
}
