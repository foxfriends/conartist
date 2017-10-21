package com.cameldridge.conartist.api

object Authorization {
    private var authToken: String? = null

    fun set(authToken: String) { this.authToken = authToken }
    fun header() = authToken?.let { "Authorization" to "Bearer $it" }
    fun remove() { this.authToken = null }
}