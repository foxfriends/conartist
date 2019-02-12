package com.cameldridge.conartist.model

import com.squareup.moshi.FromJson
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.JsonDataException
import com.squareup.moshi.JsonReader
import com.squareup.moshi.JsonReader.Token
import com.squareup.moshi.JsonWriter
import com.squareup.moshi.Moshi
import com.squareup.moshi.ToJson
import com.squareup.moshi.Types
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type
import java.util.UUID

sealed class Id {
  data class Id(val int: Int) : com.cameldridge.conartist.model.Id()
  data class Uuid(val uuid: UUID): com.cameldridge.conartist.model.Id()

  object IdAdaptor: JsonAdapter<com.cameldridge.conartist.model.Id>() {
    @ToJson
    override fun toJson(writer: JsonWriter, request: com.cameldridge.conartist.model.Id?) {
      when (request) {
        is Id -> writer.value(request.int)
        is Uuid -> writer.value(request.uuid.toString())
        null -> writer.nullValue()
      }
    }

    @FromJson
    override fun fromJson(reader: JsonReader): com.cameldridge.conartist.model.Id? = when (reader.peek()) {
      Token.NUMBER -> Id(reader.nextInt())
      Token.STRING -> Uuid(UUID.fromString(reader.nextString()))
      else -> throw JsonDataException("Expected int or string to encode an ID")
    }
  }
}
