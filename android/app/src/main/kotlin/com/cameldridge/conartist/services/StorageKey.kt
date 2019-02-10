package com.cameldridge.conartist.services

import com.cameldridge.conartist.model.User

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
