/* @flow */
import * as model from './index'
export type Currency = 'AUTO' | 'CAD' | 'USD' | 'MXN'

export class Money {
  amount: number
  currency: Currency

  static fromJSON(raw: string): Money {
    return new Money((raw.slice(0, 3): any), Number(raw.slice(3)))
  }

  static parse(string: string, currency?: Currency = model.model.getValue().settings.currency): Money {
    if (string === '') { throw new Error('Empty string cannot be parsed as Money') }
    switch (currency) {
      case 'CAD':
      case 'USD':
      case 'MXN':
        const amount = Number(string.startsWith('$') ? string.slice(1) : string)
        if (isNaN(amount)) {
          break
        }
        return new Money(currency, Math.floor(amount * 100))
    }
    throw new Error(`Money string ${string} could not be parsed as ${currency}`);
  }

  toJSON() {
    const currency = this.currency === 'AUTO' ? model.model.getValue().settings.currency : this.currency
    return `${currency}${this.amount}`
  }

  toString() {
    const currency = this.currency === 'AUTO' ? model.model.getValue().settings.currency : this.currency
    const locale = model.model.getValue().settings.language
    return (this.amount / 100.0).toLocaleString(locale, { style: 'currency', currency })
  }

  constructor(currency: Currency, amount: number) {
    this.amount = amount
    this.currency = currency
  }

  static get zero(): Money {
    return new Money('AUTO', 0)
  }

  add(other: Money): Money {
    const currency = this.currency === 'AUTO' ? other.currency : this.currency
    if (currency === other.currency || other.currency === 'AUTO') {
      return new Money(currency, this.amount + other.amount)
    } else {
      return this
    }
  }

  negate(): Money {
    return new Money(this.currency, -this.amount)
  }

  multiply(factor: number): Money {
    return new Money(this.currency, Math.round(this.amount * factor))
  }

  equals(other: ?Money): boolean {
    if (!other) { return false }
    const currency = this.currency === 'AUTO' ? other.currency : this.currency
    if (currency === other.currency || other.currency === 'AUTO') {
      return this.amount === other.amount
    } else {
      return false
    }
  }
}
