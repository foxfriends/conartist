package com.cameldridge.conartist.util

import android.content.Context
import android.widget.Toast
import io.reactivex.Observable

fun <T> Observable<T>.recover(context: Context, recovery: T? = null, message: (Throwable) -> CharSequence): Observable<T?>
  = this
  .doOnError { error -> Toast.makeText(context, message(error), Toast.LENGTH_SHORT).show()  }
  .onErrorReturn { recovery }
