package com.cameldridge.conartist.util.recyclerview

import io.reactivex.Observable

fun Observable<List<RecyclerViewAdaptor.Item>>.bindTo(adaptor: RecyclerViewAdaptor)
  = distinctUntilChanged()
  .subscribe { items ->
    adaptor.dataSource = items
    adaptor.notifyDataSetChanged()
  }
