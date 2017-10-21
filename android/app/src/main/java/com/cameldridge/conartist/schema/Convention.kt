package com.cameldridge.conartist.schema

import com.beust.klaxon.JsonObject
import com.beust.klaxon.int
import com.beust.klaxon.string
import java.util.*

interface Convention {
    fun meta(): MetaConvention
}

data class MetaConvention(
    val conId: Int,
    val name: String,
    val code: String,
    val start: Date,
    val end: Date
): Convention {
    override fun meta() = this

    override fun equals(other: Any?): Boolean {
        return when(other) {
            is MetaConvention -> other.conId == conId
            else -> false
        }
    }

    override fun hashCode(): Int {
        return code.hashCode()
    }

    companion object: GraphQLDeserializer<MetaConvention> {
        override fun deserialize(json: JsonObject): MetaConvention? {
            val id = json.int("id") ?: return null
            val name = json.string("name") ?: return null
            val code = json.string("code") ?: return null
            val start = json.string("start") ?: return null
            val end = json.string("end") ?: return null

            return MetaConvention(id, name, code, parseDate(start), parseDate(end))
        }
    }
}

data class FullConvention(
    val conId: Int,
    val name: String,
    val code: String,
    val start: Date,
    val end: Date,
    val productTypes: ArrayList<Unit>,
    val products: ArrayList<Unit>,
    val prices: ArrayList<Unit>,
    val records: ArrayList<Unit>,
    val expenses: ArrayList<Unit>
): Convention {
    override fun meta() = MetaConvention(conId, name, code, start, end)

    override fun equals(other: Any?): Boolean {
        return when(other) {
            is FullConvention -> other.conId == conId
            else -> false
        }
    }

    override fun hashCode(): Int {
        return code.hashCode()
    }
}
