package com.cameldridge.conartist.model

import android.os.Parcelable
import kotlinx.android.parcel.Parcelize
import java.lang.RuntimeException
import java.text.NumberFormat

@Parcelize
data class Money(
  val currency: Currency,
  val amount: Long
): Parcelable {
  @Parcelize
  enum class Currency: Parcelable {
    AUTO,
    CAD,
    USD,
    MXN,
    AUD,
    EUR,
    GBP,
    SEK,
    CNY,
    JPY,
    PHP,
    SGD,
    NZD;

    val std get() = when (this) {
      AUTO -> throw RuntimeException("Cannot print AUTO currency")
      else -> java.util.Currency.getInstance(this.toString())
    }

    val symbol get() = when (this) {
      AUTO -> listOf("")
      CAD -> listOf("$", "CA$", "$CA")
      USD -> listOf("$", "US$", "$US")
      MXN -> listOf("$", "MX$", "$MX")
      AUD -> listOf("$", "A$", "$AU")
      EUR -> listOf("€")
      GBP -> listOf("£")
      SEK -> listOf("kr")
      CNY -> listOf("￥", "¥", "CN¥", "CN￥", "元")
      JPY -> listOf("￥", "¥", "JP¥", "JP￥")
      PHP -> listOf("₱")
      SGD -> listOf("$", "S$", "$SG")
      NZD -> listOf("$", "NZ$", "$NZ")
    }

    companion object {
      val variants get() = listOf(CAD, USD, MXN, AUD, EUR, GBP, SEK, CNY, JPY, PHP, SGD, NZD)
    }
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
        Currency.AUD,
        Currency.EUR,
        Currency.GBP,
        Currency.SEK,
        Currency.CNY,
        Currency.PHP,
        Currency.SGD,
        Currency.NZD  -> parseDollarsAndCents(string, currency)
        Currency.JPY -> parseJustDollars(string, currency)
      }

    private fun stripCurrencySymbol(string: String, currency: Currency): String {
      var str = string.trim()
      for (symbol in currency.symbol) {
        if (string.startsWith(symbol)) {
          str = string.drop(symbol.length).trim()
        } else if (string.endsWith(symbol)) {
          str = string.dropLast(symbol.length).trim()
        }
      }
      return str
    }

    private fun parseDollarsAndCents(string: String, currency: Currency): Money? {
      val pieces = stripCurrencySymbol(string, currency).split(Regex("""\."""), 1)
      val centString = pieces.getOrElse(1) { "" }
      if (centString.length > 2) { return null }

      val dollarString = pieces.getOrNull(0) ?: return null
      val dollars = dollarString.toLongOrNull() ?: return null
      val cents = centString.padStart(2, '0').toLongOrNull() ?: return null

      return Money(currency, dollars * 100 + cents)
    }

    private fun parseJustDollars(string: String, currency: Currency): Money? {
      val dollars = stripCurrencySymbol(string, currency).toLongOrNull() ?: return null
      return Money(currency, dollars)
    }
  }
}
