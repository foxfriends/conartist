package com.cameldridge.conartist.util.recyclerview

import io.reactivex.Observable

fun <I: RecyclerViewAdaptor.Item> Observable<List<I>>.bindTo(adaptor: RecyclerViewAdaptor<I>)
  = distinctUntilChanged()
  .subscribe { items ->
    adaptor.dataSource = items
    adaptor.notifyDataSetChanged()
  }
