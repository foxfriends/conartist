package com.cameldridge.conartist.services

import com.cameldridge.conartist.model.ConRequestAdaptorFactory
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

object JSON {
  val converter = Moshi.Builder()
    .add(ConRequestAdaptorFactory)
    .add(KotlinJsonAdapterFactory())
    .build()
}
