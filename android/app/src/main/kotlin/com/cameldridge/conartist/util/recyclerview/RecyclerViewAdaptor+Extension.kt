package com.cameldridge.conartist.util.recyclerview

import io.reactivex.Observable

fun <Item: RecyclerViewAdaptor.Item> Observable<List<Item>>.bindTo(adaptor: RecyclerViewAdaptor<Item>)
  = distinctUntilChanged()
  .subscribe { items ->
    adaptor.dataSource = items
    adaptor.notifyDataSetChanged()
  }
