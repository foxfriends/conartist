package com.cameldridge.conartist.schema

import com.beust.klaxon.JsonObject
import com.beust.klaxon.array
import com.beust.klaxon.string

data class User(
    val name: String,
    val email: String,
    val conventions: ArrayList<Convention>
) {
    companion object: GraphQLDeserializer<User> {
        override fun deserialize(json: JsonObject): User? {
            val name = json.string("name") ?: return null
            val email = json.string("email") ?: return null
            val conventions =
                json.array<JsonObject>("conventions")
                    ?.mapNotNull(MetaConvention.Companion::deserialize)
                    ?.map { it as Convention }
                    ?.let{ ArrayList(it) }
                    ?: return null

            return User(name, email, conventions)
        }
    }
}