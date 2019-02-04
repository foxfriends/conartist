package com.cameldridge.conartist.util

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.CallSuper
import androidx.annotation.LayoutRes
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import io.reactivex.disposables.CompositeDisposable

public abstract class ConArtistFragment(@LayoutRes val layout: Int): Fragment() {
  protected val disposeBag = CompositeDisposable() // TODO: should this be in onCreate?

  @CallSuper
  override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View?
    = inflater.inflate(layout, container, false)

  override fun onDestroy() {
    super.onDestroy()
    disposeBag.dispose()
  }
}
