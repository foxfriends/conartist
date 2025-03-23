/*       */
import * as model from "./index";

export const CURRENCIES = [
  "CAD",
  "USD",
  "MXN",
  "AUD",
  "EUR",
  "GBP",
  "SEK",
  "CNY",
  "JPY",
  "PHP",
  "SGD",
  "NZD",
];

function stripCurrencySymbol(string, ...symbols) {
  for (const symbol of symbols.map((s) => s.toLowerCase())) {
    if (string.toLowerCase().startsWith(symbol)) {
      string = string.slice(symbol.length);
    }
    if (string.toLowerCase().endsWith(symbol)) {
      string = string.slice(0, -symbol.length);
    }
    string = string.trim();
  }
  return string;
}

function parseDollarsAndCents(string, currency, ...symbols) {
  const amount = Number(stripCurrencySymbol(string, currency, ...symbols));
  if (isNaN(amount)) {
    throw new Error(
      `Money string ${string} could not be parsed as ${currency}`,
    );
  }
  return new Money(currency, Math.floor(amount * 100));
}

function parseJustDollars(string, currency, ...symbols) {
  const amount = Number(stripCurrencySymbol(string, currency, ...symbols));
  if (isNaN(amount)) {
    throw new Error(
      `Money string ${string} could not be parsed as ${currency}`,
    );
  }
  return new Money(currency, Math.floor(amount));
}

export class Money {
  amount;
  currency;

  static fromJSON(raw) {
    return new Money(raw.slice(0, 3), Number(raw.slice(3)));
  }

  static parse(string, currency = model.model.getValue().settings.currency) {
    string = string.replace(/\s/g, "");
    if (string === "") {
      throw new Error("Empty string cannot be parsed as Money");
    }
    switch (currency) {
      case "CAD":
        return parseDollarsAndCents(string, currency, "$", "CA$", "$CA");
      case "USD":
        return parseDollarsAndCents(string, currency, "$", "US$", "$US");
      case "MXN":
        return parseDollarsAndCents(string, currency, "$", "MX$", "$MX");
      case "AUD":
        return parseDollarsAndCents(string, currency, "$", "A$", "$AU");
      case "EUR":
        return parseDollarsAndCents(string, currency, "€");
      case "GBP":
        return parseDollarsAndCents(string, currency, "£");
      case "SEK":
        return parseDollarsAndCents(string, currency, "kr");
      case "JPY":
        return parseJustDollars(string, currency, "¥", "JP¥", "￥", "JP￥");
      case "CNY":
        return parseDollarsAndCents(
          string,
          currency,
          "¥",
          "￥",
          "CN¥",
          "CN￥",
          "元",
        );
      case "PHP":
        return parseDollarsAndCents(string, currency, "₱");
      case "SGD":
        return parseDollarsAndCents(string, currency, "$", "S$", "$SG");
      case "NZD":
        return parseDollarsAndCents(string, currency, "$", "NZ$", "$NZ");
    }
    throw new Error(`Unknown currency to parse: ${currency}`);
  }

  toJSON() {
    const currency =
      this.currency === "AUTO"
        ? model.model.getValue().settings.currency
        : this.currency;
    return `${currency}${this.amount}`;
  }

  toString() {
    const currency =
      this.currency === "AUTO"
        ? model.model.getValue().settings.currency
        : this.currency;
    const locale = model.model.getValue().settings.language;
    switch (currency) {
      case "CAD":
      case "USD":
      case "MXN":
      case "AUD":
      case "EUR":
      case "GBP":
      case "SEK":
      case "CNY":
      case "PHP":
      case "SGD":
      case "NZD":
        return (this.amount / 100.0).toLocaleString(locale, {
          style: "currency",
          currency,
          useGrouping: false,
        });
      case "JPY":
        return this.amount.toLocaleString(locale, {
          style: "currency",
          currency,
          useGrouping: false,
        });
      default:
        console.error(`Unrecogized currency ${currency}`);
        return (this.amount / 100.0).toLocaleString(locale, {
          style: "currency",
          currency,
          useGrouping: false,
        });
    }
  }

  constructor(currency, amount) {
    this.amount = amount;
    this.currency = currency;
  }

  static get zero() {
    return new Money("AUTO", 0);
  }

  add(other) {
    const currency = this.currency === "AUTO" ? other.currency : this.currency;
    if (currency === other.currency || other.currency === "AUTO") {
      return new Money(currency, this.amount + other.amount);
    } else {
      return this;
    }
  }

  negate() {
    return new Money(this.currency, -this.amount);
  }

  multiply(factor) {
    return new Money(this.currency, Math.round(this.amount * factor));
  }

  equals(other) {
    if (!other) {
      return false;
    }
    const currency = this.currency === "AUTO" ? other.currency : this.currency;
    if (currency === other.currency || other.currency === "AUTO") {
      return this.amount === other.amount;
    } else {
      return false;
    }
  }
}
