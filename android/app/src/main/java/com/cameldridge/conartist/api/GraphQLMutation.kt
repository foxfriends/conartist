package com.cameldridge.conartist.api

import android.os.AsyncTask
import com.cameldridge.conartist.result.unwrap
import com.cameldridge.conartist.schema.GraphQLDeserializer
import com.github.kittinunf.fuel.httpPost
import me.lazmaid.kraph.Kraph

/**
 * Handles a query to the GraphQL API
 */
class GraphQLMutation<T>(
        private val query: Kraph,
        private val deserializer: GraphQLDeserializer<T?>,
        private val onFinish: (T?) -> Unit
) : AsyncTask<Void, Void, T>() {
    override fun doInBackground(vararg params: Void): T? {
        val json = "/v2"
            .httpPost()
            .header(Authorization.header())
            .body(query.toRequestString())
            .responseObject(JsonDeserializer)
            .third
            .unwrap()

        return json?.let(deserializer::deserialize)
    }

    override fun onPostExecute(result: T?) {
        onFinish(result)
    }

    override fun onCancelled() {
        onFinish(null)
    }
}