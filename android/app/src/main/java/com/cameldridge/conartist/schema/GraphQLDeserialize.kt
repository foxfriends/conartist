package com.cameldridge.conartist.schema

import com.beust.klaxon.JsonObject

interface GraphQLDeserializer<out T> {
    fun deserialize(json: JsonObject): T?
}