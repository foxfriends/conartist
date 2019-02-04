package com.cameldridge.conartist.model

import java.lang.RuntimeException
import java.text.NumberFormat

data class Money(
  val currency: Currency,
  val amount: Long
) {
  enum class Currency {
    AUTO,
    CAD,
    USD,
    MXN,
    EUR,
    GBP;

    val std get() = when (this) {
      AUTO -> throw RuntimeException("Cannot print AUTO currency")
      else -> java.util.Currency.getInstance(this.toString())
    }

    val symbol get() = when (this) {
      AUTO -> ""
      CAD, USD, MXN -> "$"
      EUR -> "€"
      GBP -> "£"
    }

    val variants get() = listOf(CAD, USD, MXN, EUR, GBP)
  }

  fun toJSON() =
    if (currency == Currency.AUTO) throw RuntimeException("Cannot use AUTO currency as JSON")
    else "${currency.name}${amount}"

  override fun toString(): String {
    val currencyFormatter = NumberFormat.getCurrencyInstance()
    if (currency != Currency.AUTO) {
      currencyFormatter.currency = currency.std
    }
    return currencyFormatter.format(amount.toDouble() / 100.0)
  }

  operator fun unaryMinus() = Money(currency, -amount)

  operator fun plus(rhs: Money): Money {
    if (currency != rhs.currency && (currency != Currency.AUTO && rhs.currency != Currency.AUTO)) { return this }
    return Money(
      if (currency == Currency.AUTO) rhs.currency else currency,
      amount + rhs.amount
    )
  }

  operator fun minus(rhs: Money) = this + -rhs

  override fun equals(other: Any?): Boolean {
    if (!(other is Money)) { return false }
    if (currency != other.currency && (currency != Currency.AUTO && other.currency != Currency.AUTO)) { return false }
    return amount == other.amount
  }

  override fun hashCode() = toJSON().hashCode()

  companion object {
    val zero = Money(Currency.AUTO, 0)

    fun fromJSON(string: String) = Money(
      Currency.valueOf(string.subSequence(0, 3).toString()),
      string.drop(3).toLong()
    )

    fun parse(string: String, currency: Currency) =
      when (currency) {
        Currency.AUTO -> null
        Currency.CAD,
        Currency.USD,
        Currency.MXN,
        Currency.EUR,
        Currency.GBP -> parseDollarsAndCents(string, currency)
      }

    private fun parseDollarsAndCents(string: String, currency: Currency): Money? {
      var str = string.trim().toString()
      if (string.startsWith(currency.symbol)) {
        str = string.drop(currency.symbol.length).trim().toString()
      } else if (string.endsWith(currency.symbol)) {
        str = string.dropLast(currency.symbol.length).trim().toString()
      }
      val pieces = string.split(Regex("""\."""), 1)
      val centString = pieces.getOrElse(1) { "" }
      if (centString.length > 2) { return null }

      val dollarString = pieces.getOrNull(0) ?: return null
      val dollars = dollarString.toLongOrNull() ?: return null
      val cents = centString.padStart(2, '0').toLongOrNull() ?: return null

      return Money(currency, dollars * 100 + cents)
    }
  }
}
