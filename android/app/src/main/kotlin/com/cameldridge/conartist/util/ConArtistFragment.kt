package com.cameldridge.conartist.util

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.CallSuper
import androidx.annotation.LayoutRes
import androidx.appcompat.widget.Toolbar
import androidx.fragment.app.Fragment
import com.cameldridge.conartist.R
import io.reactivex.disposables.CompositeDisposable

public abstract class ConArtistFragment(@LayoutRes private val layout: Int): Fragment() {
  protected val disposeBag = CompositeDisposable() // TODO: should this be in onCreate?

  open val title: String? get() = null
  open val menu: Int? = null
  open val backButtonIcon: Int? = null

  @CallSuper
  override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View?
    = inflater.inflate(layout, container, false)

  @CallSuper
  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    view.findViewById<Toolbar>(R.id.toolbar)?.let { toolbar ->
      menu?.let { toolbar.inflateMenu(it) }
      title?.let { toolbar.title = it }
      backButtonIcon?.let { toolbar.setNavigationIcon(it) }
    }
  }

  @CallSuper
  override fun onDestroy() {
    super.onDestroy()
    disposeBag.dispose()
  }
}
