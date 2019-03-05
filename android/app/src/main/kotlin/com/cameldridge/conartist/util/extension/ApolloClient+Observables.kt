package com.cameldridge.conartist.util.extension

import com.apollographql.apollo.ApolloClient
import com.apollographql.apollo.api.Mutation
import com.apollographql.apollo.api.Operation
import com.apollographql.apollo.api.Query
import com.apollographql.apollo.exception.ApolloHttpException
import com.apollographql.apollo.rx2.Rx2Apollo
import com.cameldridge.conartist.ConArtist

fun <D: Operation.Data, T, V: Operation.Variables> ApolloClient.observe(query: Query<D, T, V>)
  = Rx2Apollo
  .from(query(query))
  .singleOrError()
  .map { it.data() }
  .doOnError { error -> when (error) {
    is ApolloHttpException -> when (error.code()) {
      401 -> ConArtist.signOut()
    }
  }}

fun <D: Operation.Data, T, V: Operation.Variables> ApolloClient.observe(mutation: Mutation<D, T, V>)
  = Rx2Apollo
  .from(mutate(mutation))
  .singleOrError()
  .map { it.data() }
  .doOnError { error -> when (error) {
    is ApolloHttpException -> when (error.code()) {
      401 -> ConArtist.signOut()
    }
  }}
