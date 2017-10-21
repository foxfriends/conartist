package com.cameldridge.conartist.result

import com.github.kittinunf.result.Result

fun <V: Any, E: Exception>Result<V, E>.unwrap() =
    when(this) {
        is Result.Success<V, E> -> this.get()
        is Result.Failure<V, E> -> null
    }
