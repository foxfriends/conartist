package com.cameldridge.conartist.util

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.annotation.LayoutRes
import androidx.recyclerview.widget.RecyclerView
import io.reactivex.subjects.BehaviorSubject

class RecyclerViewAdaptor<Item: RecyclerViewAdaptor.Item>(val dataSource: List<Item>): RecyclerView.Adapter<RecyclerViewAdaptor.ViewHolder>() {
  open class Item(@LayoutRes val layout: Int) {
    open fun setup(view: View) {}
  }

  class ViewHolder(val context: Context) : RecyclerView.ViewHolder(FrameLayout(context)) {}

  override fun getItemCount(): Int = dataSource.size ?: 0

  override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
    return ViewHolder(parent.context)
  }

  override fun onBindViewHolder(holder: ViewHolder, position: Int) {
    val item = dataSource[position]
    LayoutInflater.from(holder.context)
      .inflate(item.layout, holder.itemView as FrameLayout)
      .let(item::setup)
  }
}
