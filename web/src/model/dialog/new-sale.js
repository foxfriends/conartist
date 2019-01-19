/* @flow */

export type NewSale = { name: 'new-sale' }

export const newSale: (?Record) => NewSale = record => ({
  name: 'new-sale',
  record,
})
