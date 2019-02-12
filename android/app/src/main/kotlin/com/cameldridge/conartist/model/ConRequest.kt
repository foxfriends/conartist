package com.cameldridge.conartist.model

import com.cameldridge.conartist.model.ConRequest.Failure
import com.cameldridge.conartist.model.ConRequest.Success
import com.squareup.moshi.FromJson
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.JsonDataException
import com.squareup.moshi.JsonReader
import com.squareup.moshi.JsonWriter
import com.squareup.moshi.Moshi
import com.squareup.moshi.ToJson
import com.squareup.moshi.Types
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type

sealed class ConRequest<out T> {
  final data class Success<out T>(val data: T) : ConRequest<T>()
  final data class Failure<out T>(val error: String) : ConRequest<T>()

  object AdaptorFactory: JsonAdapter.Factory {
    override fun create(
      type: Type,
      annotations: MutableSet<out Annotation>,
      moshi: Moshi
    ): JsonAdapter<*>? {
      val rawType = Types.getRawType(type)
      if (rawType == ConRequest::class.java && type is ParameterizedType) {
        val subtype = type.actualTypeArguments.first()
        val adaptor: JsonAdapter<Any> = moshi.adapter(subtype)
        return Adaptor(adaptor)
      }
      return null
    }

    private class Adaptor<T>(val adaptor: JsonAdapter<T>): JsonAdapter<ConRequest<T>>() {
      override fun toJson(writer: JsonWriter, request: ConRequest<T>?) {
        throw NotImplementedError("Should never re-serialize a ConRequest")
      }

      override fun fromJson(reader: JsonReader): ConRequest<T> {
        var status: String? = null
        var data: T? = null
        var error: String? = null

        reader.beginObject()
        while (reader.hasNext()) {
          when (reader.nextName()) {
            "status" -> status = reader.nextString()
            "data" -> data = adaptor.fromJson(reader)
            "error" -> error = reader.nextString()
            else -> reader.skipValue()
          }
        }
        reader.endObject()

        return when (status) {
          "Success" -> Success<T>(data ?: throw JsonDataException())
          "Failure" -> Failure<T>(error ?: throw JsonDataException())
          else -> throw JsonDataException()
        }
      }
    }
  }
}
