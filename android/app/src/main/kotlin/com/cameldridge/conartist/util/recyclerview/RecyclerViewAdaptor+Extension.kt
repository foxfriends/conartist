package com.cameldridge.conartist.util.recyclerview

import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers

fun <I: RecyclerViewAdaptor.Item> Observable<List<I>>.bindTo(adaptor: RecyclerViewAdaptor<I>)
  = distinctUntilChanged()
  .observeOn(AndroidSchedulers.mainThread())
  .subscribe { items ->
    adaptor.dataSource = items
    adaptor.notifyDataSetChanged()
  }
