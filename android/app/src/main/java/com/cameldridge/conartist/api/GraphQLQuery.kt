package com.cameldridge.conartist.api

import android.os.AsyncTask
import com.beust.klaxon.obj
import com.cameldridge.conartist.result.unwrap
import com.cameldridge.conartist.schema.FullConvention
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
    override fun doInBackground(vararg params: Void): T? =
        "/v2"
            .httpGet(listOf("query" to query.toGraphQueryString()))
            .header(Authorization.header())
            .responseObject(JsonDeserializer)
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
        // TODO: make some PRs to the Kraph package so this doesn't get so big and unmaintainable
        //       also maybe just change to use Apollo or something, along with all the other apps
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

        fun con(code: String, handler: (FullConvention?) -> Unit) =
            GraphQLQuery(
                Kraph {
                    query {
                        fieldObject("userConvention", mapOf("code" to code)) {
                            field("id")
                            field("name")
                            field("code")
                            field("start")
                            field("end")
                            fieldObject("productTypes") {
                                field("id")
                                field("name")
                                field("color")
                            }
                            fieldObject("products") {
                                field("id")
                                field("typeId")
                                field("name")
                                field("quantity")
                            }
                            fieldObject("condensedPrices") {
                                field("typeId")
                                field("productId")
                                fieldObject("prices") {
                                    field("quantity")
                                    field("price")
                                }
                            }
                            fieldObject("records") {
                                field("products")
                                field("price")
                                field("time")
                            }
                            fieldObject("expenses") {
                                field("price")
                                field("category")
                                field("description")
                                field("time")
                            }
                        }
                    }
                },
                "userConvention" to FullConvention.Companion,
                handler
            )
    }
}