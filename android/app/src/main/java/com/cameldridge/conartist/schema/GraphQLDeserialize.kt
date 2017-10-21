package com.cameldridge.conartist.schema

import com.beust.klaxon.JsonObject

interface GraphQLDeserializer<T> {
    fun deserialize(json: JsonObject): T?
}