package com.cameldridge.conartist.api

import android.os.AsyncTask
import com.beust.klaxon.JsonObject
import com.github.kittinunf.fuel.core.ResponseDeserializable
import com.github.kittinunf.fuel.httpPost
import com.github.kittinunf.result.*
import com.beust.klaxon.*

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
        println("Request sent with $email, $password")

        val result = "/auth"
            .httpPost(listOf( "usr" to email, "psw" to password ))
            .responseObject(JsonDeserializer)
            .third

        println("Response received $result")

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