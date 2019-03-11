package com.cameldridge.conartist.scenes.settings

import android.os.Bundle
import android.os.Parcelable
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import com.cameldridge.conartist.ConArtistActivity
import com.cameldridge.conartist.R
import com.cameldridge.conartist.item.settings.SettingsSelectOptionItem
import com.cameldridge.conartist.scenes.settings.SettingsSelectFragment.Arguments
import com.cameldridge.conartist.scenes.settings.SettingsSelectFragment.Item
import com.cameldridge.conartist.util.fragments.ConArtistFragment
import com.cameldridge.conartist.util.fragments.FragmentReturn
import com.cameldridge.conartist.util.recyclerview.RecyclerViewAdaptor
import com.cameldridge.conartist.util.recyclerview.bindTo
import com.jakewharton.rxbinding3.appcompat.navigationClicks
import com.jakewharton.rxbinding3.view.clicks
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.rxkotlin.addTo
import io.reactivex.rxkotlin.withLatestFrom
import io.reactivex.subjects.BehaviorSubject
import kotlinx.android.parcel.IgnoredOnParcel
import kotlinx.android.parcel.Parcelize
import kotlinx.android.synthetic.main.fragment_settings_select.options_list
import kotlinx.android.synthetic.main.fragment_settings_select.save_button
import kotlinx.android.synthetic.main.fragment_settings_select.toolbar

final class SettingsSelectFragment<I>
  : ConArtistFragment<Arguments<I>>(R.layout.fragment_settings_select)
  , FragmentReturn<I>
where I: Item {
  override val backButtonIcon: Int? = R.drawable.ic_close

  @Parcelize data class Arguments<I: Item>(
    val title: String,
    val options: List<I>,
    val selected: I
  ): Parcelable

  sealed class Item: Parcelable {
    abstract val title: String

    @Parcelize data class Currency(val currency: com.cameldridge.conartist.model.Money.Currency): Item() {
      @IgnoredOnParcel override val title = currency.name
    }
  }

  override val title get() = args.title
  private val options get() = args.options
  private val selection = BehaviorSubject.create<I>()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    selection.onNext(args.selected)
  }

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    toolbar
      .navigationClicks()
      .subscribe { ConArtistActivity.back() }
      .addTo(disposeBag)

    val adaptor = RecyclerViewAdaptor<SettingsSelectOptionItem<I>>(options_list)
    selection
      .observeOn(AndroidSchedulers.mainThread())
      .map { selected -> options.map {
        SettingsSelectOptionItem(
          it, it == selected
        )
      } }
      .bindTo(adaptor)
      .addTo(disposeBag)
    options_list.setHasFixedSize(true)
    options_list.layoutManager = LinearLayoutManager(context)

    adaptor.itemClicks
      .subscribe { selection.onNext(it.item) }
      .addTo(disposeBag)

    save_button
      .clicks()
      .withLatestFrom(selection)
      .subscribe { (_, selection) -> ConArtistActivity.respond(selection) }
      .addTo(disposeBag)
  }

  companion object {
    fun <I: Item> create(title: String, options: List<I>, selected: I)
      = ConArtistFragment.create(SettingsSelectFragment<I>(), Arguments(title, options, selected))
  }
}
