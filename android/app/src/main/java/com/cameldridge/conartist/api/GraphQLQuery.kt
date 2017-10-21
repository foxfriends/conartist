package com.cameldridge.conartist.api

import android.os.AsyncTask
import com.beust.klaxon.obj
import com.cameldridge.conartist.result.unwrap
import com.cameldridge.conartist.schema.GraphQLDeserializer
import com.cameldridge.conartist.schema.User
import com.github.kittinunf.fuel.httpGet
import me.lazmaid.kraph.Kraph

/**
 * Handles a query to the GraphQL API
 */
class GraphQLQuery<T>(
        private val query: Kraph,
        private val deserializer: Pair<String, GraphQLDeserializer<T>>,
        private val onFinish: (T?) -> Unit
) : AsyncTask<Void, Void, T>() {
    override fun doInBackground(vararg params: Void): T? {
        val (req, res, result) = "/v2"
            .httpGet(listOf("query" to query.toGraphQueryString()))
            .header(Authorization.header())
            .responseObject(JsonDeserializer)

        println("$result")

        return result.unwrap()
            ?.obj("data")
            ?.obj(deserializer.first)
            ?.let(deserializer.second::deserialize)
    }

    override fun onPostExecute(result: T?) {
        onFinish(result)
    }

    override fun onCancelled() {
        onFinish(null)
    }

    companion object {
        fun user(handler: (User?) -> Unit) =
            GraphQLQuery(
                Kraph {
                    query {
                        fieldObject("user") {
                            field("name")
                            field("email")
                            fieldObject("conventions") {
                                field("id")
                                field("code")
                                field("name")
                                field("start")
                                field("end")
                            }
                        }
                    }
                },
                "user" to User.Companion,
                handler
            )
    }
}