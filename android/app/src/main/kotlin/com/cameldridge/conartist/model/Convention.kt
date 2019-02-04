package com.cameldridge.conartist.model

import com.cameldridge.conartist.services.api.graphql.fragment.ConventionBasicInfoFragment
import com.cameldridge.conartist.services.api.graphql.fragment.FullConventionFragment
import com.cameldridge.conartist.services.api.graphql.fragment.MetaConventionFragment
import java.util.Date

data class Convention(
  val id: Id,
  val name: String,
  val start: Date,
  val end: Date,
  val recordTotal: Money?,
  val expenseTotal: Money?,
  val productTypes: List<ProductType>,
  val products: List<Product>,
  val records: List<Record>,
  val expenses: List<Expense>
) {
  companion object {
    fun fromFragment(fragment: MetaConventionFragment) = Convention(
      Id.Id(fragment.fragments.conventionBasicInfoFragment.id),
      fragment.fragments.conventionBasicInfoFragment.name,
      fragment.fragments.conventionBasicInfoFragment.start,
      fragment.fragments.conventionBasicInfoFragment.end,
      fragment.recordTotal,
      fragment.expenseTotal,
      listOf(),
      listOf(),
      listOf(),
      listOf()
    )

    fun fromFragment(fragment: FullConventionFragment) = Convention(
      Id.Id(fragment.fragments.metaConventionFragment.fragments.conventionBasicInfoFragment.id),
      fragment.fragments.metaConventionFragment.fragments.conventionBasicInfoFragment.name,
      fragment.fragments.metaConventionFragment.fragments.conventionBasicInfoFragment.start,
      fragment.fragments.metaConventionFragment.fragments.conventionBasicInfoFragment.end,
      fragment.fragments.metaConventionFragment.recordTotal,
      fragment.fragments.metaConventionFragment.expenseTotal,
      fragment.productTypes
        .map { it.fragments.productTypeFragment }
        .map { ProductType.fromFragment(it) },
      fragment.products
        .map { it.fragments.productFragment }
        .map { Product.fromFragment(it) },
      fragment.records
        .map { it.fragments.recordFragment }
        .map { Record.fromFragment(it) },
      fragment.expenses
        .map { it.fragments.expenseFragment }
        .map { Expense.fromFragment(it) }
    )
  }
}
