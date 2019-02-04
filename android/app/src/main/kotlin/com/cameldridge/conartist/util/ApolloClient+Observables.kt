package com.cameldridge.conartist.util

import com.apollographql.apollo.ApolloClient
import com.apollographql.apollo.api.Operation
import com.apollographql.apollo.api.Query
import com.apollographql.apollo.rx2.Rx2Apollo
import io.reactivex.Observable

fun <D: Operation.Data, T, V: Operation.Variables> ApolloClient.observe(query: Query<D, T, V>): Observable<T>
  = Rx2Apollo
  .from(query(query))
  .map { it.data() }
