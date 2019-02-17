package com.cameldridge.conartist.util.fragments

import android.os.Bundle
import android.os.Parcelable
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.CallSuper
import androidx.annotation.LayoutRes
import androidx.appcompat.widget.Toolbar
import androidx.fragment.app.Fragment
import com.cameldridge.conartist.R
import io.reactivex.disposables.CompositeDisposable
import kotlin.reflect.KMutableProperty
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.memberProperties

public abstract class ConArtistFragment<A: Parcelable>(@LayoutRes private val layout: Int): Fragment() {
  protected val disposeBag = CompositeDisposable()
  lateinit var args: A private set

  open val title: String? get() = null
  open val menu: Int? = null
  open val backButtonIcon: Int? = null

  @CallSuper
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    arguments?.getParcelable<A>(ARGUMENTS)?.let { args = it }
  }

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

  companion object {
    private val ARGUMENTS = "arguments"

    fun <A: Parcelable, F: ConArtistFragment<A>> create(fragment: F, arguments: A): F {
      val bundle = Bundle()
      bundle.putParcelable(ARGUMENTS, arguments)
      fragment.arguments = bundle
      return fragment
    }
  }
}
