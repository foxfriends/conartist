package com.cameldridge.conartist.util

import android.content.Context
import android.text.Layout
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.annotation.LayoutRes
import androidx.recyclerview.widget.RecyclerView
import com.cameldridge.conartist.R
import com.jakewharton.rxbinding3.view.clicks
import io.reactivex.Observable
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.rxkotlin.addTo
import io.reactivex.subjects.PublishSubject
import kotlinx.android.synthetic.main.item_base.view.content_view

class RecyclerViewAdaptor<Item: RecyclerViewAdaptor.Item>(val dataSource: List<Item>): RecyclerView.Adapter<RecyclerViewAdaptor.ViewHolder>() {
  open class Item(@LayoutRes val layout: Int) {
    open fun setup(view: View) {}
    open val clickable: Boolean = false
  }

  private val _itemClicks = PublishSubject.create<Int>()
  val itemClicks get(): Observable<Int> = _itemClicks

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
        .subscribe { _itemClicks.onNext(it) }
        .addTo(holder.disposeBag)
    }
  }

  override fun onViewRecycled(holder: ViewHolder) {
    holder.recycle()
  }
}
