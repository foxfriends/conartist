package com.cameldridge.conartist.model

import android.os.Parcelable
import com.cameldridge.conartist.services.api.graphql.fragment.RecordFragment
import kotlinx.android.parcel.Parcelize
import java.util.Date
import java.util.UUID

@Parcelize
data class Record(
  val id: Id,
  val products: List<Id>,
  val price: Money,
  val info: String,
  val uuid: UUID?,
  val time: Date
): Parcelable {
  companion object {
    fun fromFragment(fragment: RecordFragment) = Record(
      Id.Id(fragment.id),
      fragment.products.map { Id.Id(it) },
      fragment.price,
      fragment.info,
      fragment.uuid,
      fragment.time
    )
  }
}
