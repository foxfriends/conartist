package com.cameldridge.conartist.util

import android.os.Bundle
import androidx.annotation.LayoutRes
import androidx.appcompat.app.AppCompatActivity

import io.reactivex.disposables.CompositeDisposable

public abstract class ConArtistActivity(@LayoutRes val layout: Int): AppCompatActivity() {
  protected val disposeBag = CompositeDisposable()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(layout)
  }

  override fun onDestroy() {
    disposeBag.dispose()
    super.onDestroy()
  }
}
