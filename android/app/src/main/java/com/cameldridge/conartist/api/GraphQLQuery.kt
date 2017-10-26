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
            .httpGet(listOf(
                "query" to query.requestQueryString(),
                "variables" to query.requestVariableString(),
                "operationName" to query.requestOperationName()
            ))
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
                    query ("GetUser") {
                        field("user") {
                            field("name")
                            field("email")
                            field("conventions") {
                                fragment("MetaConvention")
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
                    query ("GetUserConvention") {
                        field("userConvention", mapOf("code" to code)) {
                            fragment("MetaConvention")
                            field("productTypes") {
                                field("id")
                                field("name")
                                field("color")
                            }
                            field("products", mapOf("includeAll" to true)) {
                                field("id")
                                field("typeId")
                                field("name")
                                field("quantity")
                            }
                            field("condensedPrices", mapOf("includeAll" to true)) {
                                field("typeId")
                                field("productId")
                                fieldObject("prices") {
                                    field("quantity")
                                    field("price")
                                }
                            }
                            field("records") {
                                fragment("Record")
                            }
                            field("expenses") {
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