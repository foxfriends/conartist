package com.cameldridge.conartist.services

import com.cameldridge.conartist.BuildConfig
import com.cameldridge.conartist.R
import com.cameldridge.conartist.model.ConRequestAdaptorFactory
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.moshi.MoshiConverterFactory

object API {
  var authtoken: String = "Unauthorized"

  private val authInterceptor = Interceptor { chain ->
    val newRequest = chain.request()
      .newBuilder()
      .addHeader("Authorization", "Bearer ${authtoken}")
      .build()
    chain.proceed(newRequest)
  }

  private val client = OkHttpClient().newBuilder()
    .addInterceptor(authInterceptor)
    .build()

  val request: ConArtistAPI = Retrofit.Builder()
    .client(client)
    .baseUrl(BuildConfig.API_URL)
    .addConverterFactory(MoshiConverterFactory.create(
      Moshi.Builder()
        .add(ConRequestAdaptorFactory)
        .add(KotlinJsonAdapterFactory())
        .build()
    ))
    .addCallAdapterFactory(RxJava2CallAdapterFactory.createAsync())
    .build()
    .create(ConArtistAPI::class.java)
}
