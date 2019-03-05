package com.cameldridge.conartist.services

import com.cameldridge.conartist.Constants.RFC3339
import com.cameldridge.conartist.model.ConRequest
import com.cameldridge.conartist.model.Id
import com.cameldridge.conartist.model.Money
import com.cameldridge.conartist.model.Money.Currency
import com.cameldridge.conartist.util.Null
import com.squareup.moshi.FromJson
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.JsonReader
import com.squareup.moshi.JsonWriter
import com.squareup.moshi.Moshi
import com.squareup.moshi.ToJson
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

object JSON {
  private object DateAdaptor: JsonAdapter<Date>() {
    private val format = SimpleDateFormat(RFC3339, Locale.US)

    @FromJson
    override fun fromJson(reader: JsonReader)
      = format.parse(reader.nextString())

    @ToJson
    override fun toJson(writer: JsonWriter, value: Date?) {
      writer.value(value?.let(format::format))
    }
  }

  private object UUIDAdaptor: JsonAdapter<UUID>() {
    private val format = SimpleDateFormat(RFC3339, Locale.US)

    @FromJson
    override fun fromJson(reader: JsonReader)
      = UUID.fromString(reader.nextString())

    @ToJson
    override fun toJson(writer: JsonWriter, value: UUID?) {
      writer.value(value?.toString())
    }
  }

  private object MoneyAdaptor: JsonAdapter<Money>() {
    @FromJson
    override fun fromJson(reader: JsonReader)
      = Money.fromJSON(reader.nextString())

    @ToJson
    override fun toJson(writer: JsonWriter, value: Money?) {
      writer.value(value?.toJSON())
    }
  }

  private object CurrencyAdaptor: JsonAdapter<Currency>() {
    @FromJson
    override fun fromJson(reader: JsonReader)
      = Currency.valueOf(reader.nextString())

    @ToJson
    override fun toJson(writer: JsonWriter, value: Currency?) {
      writer.value(value?.name)
    }
  }

  private object NullAdaptor: JsonAdapter<Null>() {
    @FromJson
    override fun fromJson(reader: JsonReader): Null {
      reader.nextNull<Null>()
      return Null
    }

    @ToJson
    override fun toJson(writer: JsonWriter, value: Null?) {
      writer.nullValue()
    }
  }

  val converter = Moshi.Builder()
    .add(ConRequest.AdaptorFactory)
    .add(Id.IdAdaptor)
    .add(DateAdaptor)
    .add(UUIDAdaptor)
    .add(MoneyAdaptor)
    .add(CurrencyAdaptor)
    .add(NullAdaptor)
    .add(KotlinJsonAdapterFactory())
    .build()
}
