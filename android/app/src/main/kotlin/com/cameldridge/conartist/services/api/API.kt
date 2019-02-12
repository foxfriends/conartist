package com.cameldridge.conartist.services.api

import com.apollographql.apollo.ApolloClient
import com.apollographql.apollo.response.CustomTypeAdapter
import com.apollographql.apollo.response.CustomTypeValue
import com.cameldridge.conartist.BuildConfig
import com.cameldridge.conartist.Constants.RFC3339
import com.cameldridge.conartist.model.ConRequest
import com.cameldridge.conartist.model.ConRequest.Failure
import com.cameldridge.conartist.model.ConRequest.Success
import com.cameldridge.conartist.model.Money
import com.cameldridge.conartist.model.Money.Currency
import com.cameldridge.conartist.services.JSON
import com.cameldridge.conartist.services.api.graphql.type.CustomType
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.JsonDataException
import com.squareup.moshi.JsonReader
import com.squareup.moshi.JsonWriter
import com.squareup.moshi.Moshi
import com.squareup.moshi.Types
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.moshi.MoshiConverterFactory
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type
import java.text.DateFormat
import java.text.ParseException
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Date
import java.util.Locale
import java.util.UUID

object API {
  val UNAUTHORIZED = "Unauthorized"
  var authtoken: String = UNAUTHORIZED

  private val authInterceptor = Interceptor { chain ->
    val newRequest = chain.request()
      .newBuilder()
      .addHeader("Authorization", "Bearer $authtoken")
      .build()
    chain.proceed(newRequest)
  }

  private val client = OkHttpClient().newBuilder()
    .addInterceptor(authInterceptor)
    .build()

  private final class DateAdaptor(format: String): CustomTypeAdapter<Date> {
    private val format = SimpleDateFormat(format, Locale.US)

    override fun decode(value: CustomTypeValue<Any>): Date
      = format.parse(value.value.toString())
    override fun encode(value: Date): CustomTypeValue<String>
      = CustomTypeValue.GraphQLString(format.format(value))
  }

  private object MoneyAdaptor: CustomTypeAdapter<Money> {
    override fun decode(value: CustomTypeValue<Any>)
      = Money.fromJSON(value.value.toString())
    override fun encode(value: Money): CustomTypeValue<String>
      = CustomTypeValue.GraphQLString(value.toJSON())
  }

  private object CurrencyAdaptor: CustomTypeAdapter<Currency> {
    override fun decode(value: CustomTypeValue<Any>)
      = Currency.valueOf(value.value.toString())
    override fun encode(value: Currency): CustomTypeValue<String>
      = CustomTypeValue.GraphQLString(value.name)
  }

  private object UUIDAdaptor: CustomTypeAdapter<UUID> {
    override fun decode(value: CustomTypeValue<Any>)
      = UUID.fromString(value.value.toString())
    override fun encode(value: UUID): CustomTypeValue<String>
      = CustomTypeValue.GraphQLString(value.toString())
  }

  val request: ConArtistAPI = Retrofit.Builder()
    .client(client)
    .baseUrl(BuildConfig.API_URL)
    .addConverterFactory(MoshiConverterFactory.create(JSON.converter))
    .addCallAdapterFactory(RxJava2CallAdapterFactory.createAsync())
    .build()
    .create(ConArtistAPI::class.java)

  val graphql: ApolloClient = ApolloClient.builder()
    .serverUrl(BuildConfig.GRAPH_URL)
    .okHttpClient(client)
    .addCustomTypeAdapter(CustomType.DATETIMEFIXEDOFFSET, DateAdaptor(RFC3339))
    .addCustomTypeAdapter(CustomType.DATETIMEUTC, DateAdaptor(RFC3339))
    .addCustomTypeAdapter(CustomType.NAIVEDATE, DateAdaptor(RFC3339))
    .addCustomTypeAdapter(CustomType.CURRENCY, CurrencyAdaptor)
    .addCustomTypeAdapter(CustomType.MONEY, MoneyAdaptor)
    .addCustomTypeAdapter(CustomType.UUID, UUIDAdaptor)
    .build()
}
