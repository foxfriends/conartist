/* @flow */

export type Export
  = ExportProducts

type ExportProducts = { name: 'export', type: 'products' }
export const exportProducts: ExportProducts = { name: 'export', type: 'products' }
