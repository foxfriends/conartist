package com.cameldridge.conartist.scenes.settings

import android.os.Bundle
import android.os.Parcelable
import android.view.View
import com.cameldridge.conartist.R
import com.cameldridge.conartist.util.fragments.ConArtistFragment
import com.cameldridge.conartist.scenes.settings.SettingsSelectFragment.Arguments
import com.cameldridge.conartist.scenes.settings.SettingsSelectFragment.Item
import com.cameldridge.conartist.util.Null
import com.cameldridge.conartist.util.fragments.FragmentReturn
import io.reactivex.subjects.BehaviorSubject
import kotlinx.android.parcel.IgnoredOnParcel
import kotlinx.android.parcel.Parcelize

class SettingsSelectFragment<I>
  : ConArtistFragment<Arguments<I>>(R.layout.fragment_settings_select)
  , FragmentReturn<I>
where I: Item {
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
  private val selection = BehaviorSubject.create<I>()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    selection.onNext(args.selected)
  }

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
  }

  companion object {
    fun <I: Item> create(title: String, options: List<I>, selected: I)
      = ConArtistFragment.create(SettingsSelectFragment<I>(), Arguments(title, options, selected))
  }
}
