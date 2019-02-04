package com.cameldridge.conartist.model

import com.cameldridge.conartist.services.api.graphql.fragment.ExpenseFragment
import java.util.Date
import java.util.UUID

data class Expense(
  val id: Id,
  val category: String,
  val description: String,
  val time: Date,
  val price: Money,
  val uuid: UUID?
) {
  companion object {
    fun fromFragment(fragment: ExpenseFragment) = Expense(
      Id.Id(fragment.id),
      fragment.category,
      fragment.description,
      fragment.time,
      fragment.price,
      fragment.uuid
    )
  }
}
