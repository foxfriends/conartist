package com.cameldridge.conartist.api

import android.os.AsyncTask
import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import com.beust.klaxon.string
import com.github.kittinunf.fuel.core.ResponseDeserializable
import com.github.kittinunf.fuel.httpPost
import com.github.kittinunf.result.getOrElse
import com.github.kittinunf.result.map

object JsonDeserializer : ResponseDeserializable<JsonObject> {
    override fun deserialize(content: String): JsonObject = Parser().parse(StringBuilder(content)) as JsonObject
}

/**
 * Represents an asynchronous login task used to authenticate the user.
 */
class UserLoginTask(
    private val email: String,
    private val password: String,
    private val onFinish: (String?) -> Unit
) : AsyncTask<Void, Void, String?>() {
    override fun doInBackground(vararg params: Void): String? {
        val result = "/auth"
            .httpPost(listOf( "usr" to email, "psw" to password ))
            .responseObject(JsonDeserializer)
            .third

        val authToken = result
            .map {
                if(it.string("status") == "Success") {
                    it.string("data") ?: ""
                } else {
                    ""
                }
            }
            .getOrElse("")
        return if(authToken == "") { null } else { authToken }
    }

    override fun onPostExecute(result: String?) {
        onFinish(result)
    }

    override fun onCancelled() {
        onFinish(null)
    }
}