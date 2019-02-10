package com.cameldridge.conartist.util.extension

import com.apollographql.apollo.ApolloClient
import com.apollographql.apollo.api.Operation
import com.apollographql.apollo.api.Query
import com.apollographql.apollo.rx2.Rx2Apollo
import io.reactivex.android.schedulers.AndroidSchedulers

fun <D: Operation.Data, T, V: Operation.Variables> ApolloClient.observe(query: Query<D, T, V>)
  = Rx2Apollo
  .from(query(query))
  .singleOrError()
  .map { it.data() }
