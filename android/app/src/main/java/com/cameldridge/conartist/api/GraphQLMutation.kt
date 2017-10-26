package com.cameldridge.conartist.api

import android.os.AsyncTask
import com.beust.klaxon.obj
import com.cameldridge.conartist.result.unwrap
import com.cameldridge.conartist.schema.GraphQLDeserializer
import com.cameldridge.conartist.schema.Record
import com.cameldridge.conartist.schema.formatTime
import com.github.kittinunf.fuel.httpPost
import me.lazmaid.kraph.Kraph

/**
 * Handles a query to the GraphQL API
 */
class GraphQLMutation<T>(
        private val query: Kraph,
        private val deserializer: Pair<String, GraphQLDeserializer<T>>,
        private val onFinish: (T?) -> Unit
) : AsyncTask<Void, Void, T>() {
    override fun doInBackground(vararg params: Void): T? =
        "/v2"
            .httpPost()
            .header(Authorization.header())
            .body(query.toRequestString())
            .let{ println(it); it }
            .responseObject(JsonDeserializer)
            .let{ println(it); it }
            .third
            .unwrap()
            ?.obj("data")
            ?.obj(deserializer.first)
            ?.let(deserializer.second::deserialize)

    override fun onPostExecute(result: T?) {
        onFinish(result)
    }

    override fun onCancelled() {
        onFinish(null)
    }

    companion object {
        fun addUserRecord(conId: Int, record: Record, handler: (Record?) -> Unit) =
            GraphQLMutation(
                Kraph {
                    mutation("AddUserRecord") {
                        fieldObject("addUserRecord", mapOf(
                            "record" to mapOf(
                                "conId" to conId,
                                "products" to record.products,
                                "price" to record.price,
                                "time" to formatTime(record.time)
                            )
                        )) {
                            fragment("Record")
                        }
                    }
                },
                "addUserRecord" to Record.Companion,
                handler
            )
    }
}
