package com.cameldridge.conartist.util.recyclerview

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.LayoutRes
import androidx.recyclerview.widget.ItemTouchHelper
import androidx.recyclerview.widget.RecyclerView
import com.cameldridge.conartist.R
import com.cameldridge.conartist.model.Direction
import com.cameldridge.conartist.model.Direction.Left
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor.Item
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor.ViewHolder
import com.jakewharton.rxbinding3.view.clicks
import io.reactivex.Observable
import io.reactivex.disposables.CompositeDisposable
import io.reactivex.rxkotlin.addTo
import io.reactivex.subjects.PublishSubject
import kotlinx.android.synthetic.main.item_base.view.content_view
import java.lang.RuntimeException
import java.lang.ref.WeakReference
import java.util.Collections

final class RecyclerViewAdaptor<I: Item>(
  val recyclerView: RecyclerView
): RecyclerView.Adapter<ViewHolder<I>>() {
  abstract class Item(@LayoutRes val layout: Int) {
    open fun setup(view: View) {}
    open val clickable: Boolean = false
    open val dragFlags: Int = 0
    open val swipeFlags: Int = 0
  }

  private final class ItemTouchHelperCallback<I: Item>(
    private val itemMoves: PublishSubject<Triple<I, Int, Int>>,
    private val itemDrops: PublishSubject<Triple<I, Int, Int>>,
    private val itemSwipes: PublishSubject<Pair<I, Direction>>
  ) : ItemTouchHelper.Callback() {
    var draggedFrom: Int? = null
    var draggedTo: Int? = null
    var draggingItem: I? = null

    @Suppress("UNCHECKED_CAST")
    override fun getMovementFlags(recyclerView: RecyclerView, viewHolder: RecyclerView.ViewHolder): Int {
      return makeMovementFlags(
        (viewHolder as ViewHolder<I>).item?.get()?.dragFlags ?: 0,
        viewHolder.item?.get()?.swipeFlags ?: 0
      )
    }

    @Suppress("UNCHECKED_CAST")
    override fun onMove(recyclerView: RecyclerView, viewHolder: RecyclerView.ViewHolder, target: RecyclerView.ViewHolder): Boolean {
      draggedTo = target.adapterPosition
      itemMoves.onNext(Triple(
        (viewHolder as ViewHolder<I>).item!!.get()!!,
        viewHolder.adapterPosition,
        target.adapterPosition
      ))
      return true
    }

    @Suppress("UNCHECKED_CAST")
    override fun onSwiped(viewHolder: RecyclerView.ViewHolder, direction: Int) {
      val dir = when (direction) {
        ItemTouchHelper.START -> Direction.Left
        ItemTouchHelper.END -> Direction.Right
        else -> return
      }
      itemSwipes.onNext(Pair((viewHolder as ViewHolder<I>).item!!.get()!!, dir))
    }

    @Suppress("UNCHECKED_CAST")
    override fun onSelectedChanged(viewHolder: RecyclerView.ViewHolder?, actionState: Int) {
      super.onSelectedChanged(viewHolder, actionState)
      when (actionState) {
        ItemTouchHelper.ACTION_STATE_DRAG -> viewHolder?.also {
          draggedFrom = it.adapterPosition
          draggingItem = (it as ViewHolder<I>).item!!.get()!!
        }
        ItemTouchHelper.ACTION_STATE_IDLE -> {
          if (draggingItem != null && draggedFrom != null && draggedTo != null) {
            itemDrops.onNext(Triple(
              draggingItem!!,
              draggedFrom!!,
              draggedTo!!
            ))
            draggingItem = null
            draggedFrom = null
            draggedTo = null
          }
        }
      }
    }
  }

  class ViewHolder<I: Item>(
    parent: ViewGroup
  ) : RecyclerView.ViewHolder(
    LayoutInflater
      .from(parent.context)
      .inflate(R.layout.item_base, parent, false)
  ) {
    var disposeBag = CompositeDisposable()
    val context = parent.context

    var item: WeakReference<I>? = null

    fun setItem(item: I) {
      this.item = WeakReference(item)
    }

    fun recycle() {
      disposeBag.dispose()
      disposeBag = CompositeDisposable()
      itemView.content_view.removeAllViews()
    }
  }

  private var disposeBag = CompositeDisposable()
  var dataSource: List<I> = listOf()

  private val _itemClicks = PublishSubject.create<I>()
  private val _itemSwipes = PublishSubject.create<Pair<I, Direction>>()
  private val _itemMoves = PublishSubject.create<Triple<I, Int, Int>>()
  private val _itemDrops = PublishSubject.create<Triple<I, Int, Int>>()
  val itemClicks get(): Observable<I> = _itemClicks
  val itemMoves get(): Observable<Triple<I, Int, Int>> = _itemMoves
  val itemDrops get(): Observable<Triple<I, Int, Int>> = _itemDrops
  val itemSwipes get(): Observable<Pair<I, Direction>> = _itemSwipes

  init {
    val itemTouchHelper = ItemTouchHelper(ItemTouchHelperCallback(_itemMoves, _itemDrops, _itemSwipes))
    itemTouchHelper.attachToRecyclerView(recyclerView)
    itemMoves
      .subscribe { (_, from, to) ->
        // TODO: investigate using remove + insert instead of swapswapswap
        val moved = dataSource.toMutableList()
        moved.add(to, moved.removeAt(from))
        dataSource = moved.toList()
        notifyItemMoved(from, to)
      }
      .addTo(disposeBag)
    recyclerView.adapter = this
  }

  override fun getItemCount(): Int = dataSource.size

  override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder<I> {
    return ViewHolder(parent)
  }

  override fun onBindViewHolder(holder: ViewHolder<I>, position: Int) {
    val item = dataSource[position]
    LayoutInflater.from(holder.context)
      .inflate(item.layout, holder.itemView.content_view, true)
      .let(item::setup)
    holder.setItem(item)
    if (item.clickable) {
      holder.itemView
        .clicks()
        .subscribe { _itemClicks.onNext(item) }
        .addTo(holder.disposeBag)
    }
  }

  override fun onViewRecycled(holder: ViewHolder<I>) {
    holder.recycle()
  }
}

