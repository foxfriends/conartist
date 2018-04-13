/* @flow */
export type Currency = 'AUTO' | 'CAD' | 'USD'

export class Money {
  raw: string
  amount: number
  currency: Currency

  constructor(raw: string) {
    this.raw = raw
    this.amount = parseInt(this.raw.slice(3), 10)
    this.currency = (this.raw.slice(0, 3): any)
  }
}
