package com.cameldridge.conartist.api

import java.net.InetAddress
import kotlin.properties.ReadOnlyProperty
import kotlin.reflect.KProperty

object NetworkChecker: ReadOnlyProperty<API, Boolean> {
    override fun getValue(thisRef: API, property: KProperty<*>): Boolean =
        try {
            InetAddress.getByName(API.baseURL).toString() != ""
        } catch (e: Exception) {
            false
        }
}

object API {
    val baseURL = "https://con--artist.herokuapp.com"
    val apiURL = "/api"
    val available: Boolean by NetworkChecker
}