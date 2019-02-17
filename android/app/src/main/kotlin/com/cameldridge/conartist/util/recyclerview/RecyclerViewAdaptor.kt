package com.cameldridge.conartist.util.recyclerview

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.LayoutRes
import androidx.recyclerview.widget.RecyclerView
import com.cameldridge.conartist.R
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor.Item
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor.ViewHolder
import com.jakewharton.rxbinding3.view.clicks
import io.reactivex.Observable
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.rxkotlin.addTo
import io.reactivex.subjects.PublishSubject
import kotlinx.android.synthetic.main.item_base.view.content_view

final class RecyclerViewAdaptor<I: Item>(var dataSource: List<I> = listOf()): RecyclerView.Adapter<ViewHolder>() {
  private var disposeBag = CompositeDisposable()

  abstract class Item(@LayoutRes val layout: Int) {
    open fun setup(view: View) {}
    open val clickable: Boolean = false
  }

  private val _itemClicks = PublishSubject.create<I>()
  val itemClicks get(): Observable<I> = _itemClicks

  class ViewHolder(
    parent: ViewGroup
  ) : RecyclerView.ViewHolder(
    LayoutInflater
      .from(parent.context)
      .inflate(R.layout.item_base, parent, false)
  ) {
    var disposeBag = CompositeDisposable()
    val context = parent.context

    fun recycle() {
      disposeBag.dispose()
      disposeBag = CompositeDisposable()
      itemView.content_view.removeAllViews()
    }
  }

  override fun getItemCount(): Int = dataSource.size

  override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
    return ViewHolder(parent)
  }

  override fun onBindViewHolder(holder: ViewHolder, position: Int) {
    val item = dataSource[position]
    LayoutInflater.from(holder.context)
      .inflate(item.layout, holder.itemView.content_view, true)
      .let(item::setup)
    if (item.clickable) {
      holder.itemView
        .clicks()
        .map { position }
        .subscribe { _itemClicks.onNext(item) }
        .addTo(holder.disposeBag)
    }
  }

  override fun onViewRecycled(holder: ViewHolder) {
    holder.recycle()
  }
}

